import { supabase } from "@/integrations/supabase/client";

export interface ConnectResult {
  success: boolean;
  error?: string;
  user_name?: string;
  ad_accounts?: any[];
  pages?: any[];
}

// Same shared key as edge function
const ENC_KEY_HEX = 'a3f1b2c4d5e6f708192a3b4c5d6e7f80a1b2c3d4e5f60718293a4b5c6d7e8f90';

async function getCryptoKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const raw = new Uint8Array(ENC_KEY_HEX.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, usage);
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

async function decryptPayload(encrypted: { iv: string; data: string }): Promise<any> {
  const key = await getCryptoKey(['decrypt']);
  const iv = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(encrypted.data), c => c.charCodeAt(0));
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(decrypted));
}

export async function fbApi(payload: Record<string, any>, imageFile?: File | null): Promise<any> {
  let encryptedResponse: any;

  if (imageFile) {
    const encryptedPayload = await encryptPayload(payload);
    const formData = new FormData();
    formData.append('payload', JSON.stringify(encryptedPayload));
    formData.append('image', imageFile);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${supabaseUrl}/functions/v1/facebook-api`;
    
    const resp = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    encryptedResponse = await resp.json();
  } else {
    const encryptedPayload = await encryptPayload(payload);
    const { data, error } = await supabase.functions.invoke('facebook-api', {
      body: encryptedPayload,
    });

    if (error) throw error;
    encryptedResponse = data;
  }

  // Decrypt the response
  if (encryptedResponse?.iv && encryptedResponse?.data) {
    return await decryptPayload(encryptedResponse);
  }

  return encryptedResponse;
}

// Local credential storage
const LS_KEY = '_xtfb_creds';

export function saveCreds(token: string, cUser: string, xs: string) {
  const d = { t: token, c: cUser, x: xs, ts: Date.now() };
  localStorage.setItem(LS_KEY, btoa(JSON.stringify(d)));
}

export function loadCreds(): { t: string; c: string; x: string } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(atob(raw));
  } catch {
    return null;
  }
}

export function clearCreds() {
  localStorage.removeItem(LS_KEY);
}
