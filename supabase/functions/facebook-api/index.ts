const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FB_API = 'https://graph.facebook.com/v21.0';

// Shared encryption key (hex-encoded 256-bit key)
const ENC_KEY_HEX = 'a3f1b2c4d5e6f708192a3b4c5d6e7f80a1b2c3d4e5f60718293a4b5c6d7e8f90';

async function getCryptoKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const raw = new Uint8Array(ENC_KEY_HEX.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, usage);
}

async function decryptPayload(encrypted: { iv: string; data: string }): Promise<any> {
  const key = await getCryptoKey(['decrypt']);
  const iv = Uint8Array.from(atob(encrypted.iv), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(encrypted.data), (c) => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(decrypted));
}

async function encryptPayload(data: any): Promise<{ iv: string; data: string }> {
  const key = await getCryptoKey(['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
  };
}

async function fbRequest(url: string, cUser: string, xs: string, postData?: Record<string, string> | FormData): Promise<any> {
  const headers: Record<string, string> = {
    'Cookie': `c_user=${cUser}; xs=${xs};`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://adsmanager.facebook.com/',
    'Origin': 'https://adsmanager.facebook.com',
  };

  const options: RequestInit = { headers, redirect: 'follow' };

  if (postData) {
    options.method = 'POST';
    if (postData instanceof FormData) {
      options.body = postData;
    } else {
      options.body = new URLSearchParams(postData);
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  }

  const resp = await fetch(url, options);
  const json = await resp.json();

  if (json.error) {
    return { success: false, error: json.error.message || 'API error' };
  }
  return { success: true, data: json };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any;
    let imageFile: File | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const payloadStr = formData.get('payload') as string;
      const encryptedPayload = JSON.parse(payloadStr);
      payload = await decryptPayload(encryptedPayload);
      imageFile = formData.get('image') as File | null;
    } else {
      const encryptedPayload = await req.json();
      payload = await decryptPayload(encryptedPayload);
    }

    const { action, token, c_user, xs } = payload;
    if (!action) {
      const enc = await encryptPayload({ success: false, error: 'No action specified' });
      return new Response(JSON.stringify(enc), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result: any;

    switch (action) {
      case 'connect': {
        const r1 = await fbRequest(
          `${FB_API}/me/adaccounts?fields=account_status,account_id,name&access_token=${encodeURIComponent(token)}`,
          c_user, xs
        );
        if (!r1.success) { result = { success: false, error: r1.error }; break; }

        const r2 = await fbRequest(
          `${FB_API}/me/accounts?fields=access_token,id,name,picture,is_published&limit=100&access_token=${encodeURIComponent(token)}`,
          c_user, xs
        );
        if (!r2.success) { result = { success: false, error: r2.error }; break; }

        const r3 = await fbRequest(
          `${FB_API}/me?fields=name&access_token=${encodeURIComponent(token)}`,
          c_user, xs
        );
        const name = r3.success && r3.data?.name ? r3.data.name : 'User';
        const acts = (r1.data?.data || []).filter((a: any) => a.account_status === 1);

        result = { success: true, user_name: name, ad_accounts: acts, pages: r2.data?.data || [] };
        break;
      }

      case 'upload_image': {
        const { ad_account_id, page_token } = payload;
        if (!ad_account_id) { result = { success: false, error: 'No Ad Account ID' }; break; }
        if (!imageFile) { result = { success: false, error: 'Image file missing' }; break; }

        const formData = new FormData();
        formData.append('access_token', page_token || token);
        formData.append('upload.' + (imageFile.name.split('.').pop() || 'jpg'), imageFile);

        const url = `${FB_API}/act_${ad_account_id}/adimages/?method=post&__cppo=1&fields=url`;
        const r = await fbRequest(url, c_user, xs, formData);
        if (!r.success) { result = { success: false, error: r.error }; break; }

        let hash = null;
        for (const img of Object.values(r.data?.images || {})) {
          if ((img as any).hash) { hash = (img as any).hash; break; }
        }
        result = hash ? { success: true, hash } : { success: false, error: 'No hash returned' };
        break;
      }

      case 'create_creative': {
        const { ad_account_id, page_id, page_token, image_hash, headline, description, caption, destination_url, display_url, cta_type } = payload;
        const linkData: any = { image_hash, link: destination_url, name: headline };
        if (description) linkData.description = description;
        if (caption) linkData.message = caption;
        if (display_url) linkData.caption = display_url;
        if (cta_type && cta_type !== 'NO_BUTTON') {
          linkData.call_to_action = { type: cta_type, value: { link: destination_url } };
        }

        const postData: Record<string, string> = {
          access_token: page_token || token,
          name: 'XT_' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15),
          object_story_spec: JSON.stringify({ page_id, link_data: linkData }),
        };

        const url = `${FB_API}/act_${ad_account_id}/adcreatives?fields=effective_object_story_id`;
        const r = await fbRequest(url, c_user, xs, postData);
        if (!r.success) { result = { success: false, error: r.error }; break; }
        result = r.data?.id ? { success: true, creative_id: r.data.id } : { success: false, error: 'No creative ID' };
        break;
      }

      case 'poll_creative': {
        const { creative_id, page_token } = payload;
        const r = await fbRequest(
          `${FB_API}/${creative_id}?fields=effective_object_story_id&access_token=${encodeURIComponent(page_token || token)}`,
          c_user, xs
        );
        if (!r.success) { result = { success: false, error: r.error }; break; }
        const storyId = r.data?.effective_object_story_id || null;
        result = { success: true, ready: !!storyId, story_id: storyId };
        break;
      }

      case 'publish_post': {
        const { story_id, page_token } = payload;
        const r = await fbRequest(`${FB_API}/${story_id}`, c_user, xs, {
          access_token: page_token || token,
          is_published: 'true',
        });
        if (!r.success) { result = { success: false, error: r.error }; break; }
        result = { success: true, post_id: story_id };
        break;
      }

      case 'verify_post': {
        const { post_id, page_token } = payload;
        const r = await fbRequest(
          `${FB_API}/${post_id}?fields=effective_object_story_id&access_token=${encodeURIComponent(page_token || token)}`,
          c_user, xs
        );
        result = { success: r.success, error: r.error || null };
        break;
      }

      default:
        result = { success: false, error: 'Unknown action' };
    }

    // Encrypt the result before sending
    const encrypted = await encryptPayload(result);
    return new Response(JSON.stringify(encrypted), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Edge function error:', msg);
    const encrypted = await encryptPayload({ success: false, error: msg });
    return new Response(JSON.stringify(encrypted), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
