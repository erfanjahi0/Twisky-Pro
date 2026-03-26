import { useState, useCallback, useRef, memo } from "react";
import {
  Building2, RectangleHorizontal, Flag, CloudUpload, PenLine,
  Heading, Link, Globe, MousePointerClick, Send, X, CheckCircle,
  AlertTriangle, Lock, Flower2, CalendarClock, Clock, Calendar, ToggleLeft, ToggleRight
} from "lucide-react";
import TerminalLog, { type LogEntry } from "./TerminalLog";
import CustomSelect from "./CustomSelect";
import { fbApi } from "@/lib/facebook-api";

const CTA_OPTIONS = [
  { value: "NO_BUTTON", label: "No Button" }, { value: "LEARN_MORE", label: "Learn More" },
  { value: "SHOP_NOW", label: "Shop Now" }, { value: "SIGN_UP", label: "Sign Up" },
  { value: "DOWNLOAD", label: "Download" }, { value: "BOOK_TRAVEL", label: "Book Travel" },
  { value: "CONTACT_US", label: "Contact Us" }, { value: "APPLY_NOW", label: "Apply Now" },
  { value: "GET_OFFER", label: "Get Offer" }, { value: "GET_QUOTE", label: "Get Quote" },
  { value: "SUBSCRIBE", label: "Subscribe" }, { value: "WATCH_MORE", label: "Watch More" },
  { value: "SEND_MESSAGE", label: "Send Message" }, { value: "ORDER_NOW", label: "Order Now" },
  { value: "CALL_NOW", label: "Call Now" }, { value: "LIKE_PAGE", label: "Like Page" },
  { value: "OPEN_LINK", label: "Open Link" }, { value: "WHATSAPP_MESSAGE", label: "WhatsApp Message" },
];

interface PublisherPageProps {
  connected: boolean;
  onOpenDrawer: () => void;
  adAccounts: any[];
  pages: any[];
  credentials: { token: string; c_user: string; xs: string } | null;
}

const FormCard = memo(({ children, title, icon: Icon, iconColor, accent }: {
  children: React.ReactNode;
  title: string;
  icon: any;
  iconColor: string;
  accent?: boolean;
}) => (
  <div
    className="rounded-2xl p-5 mb-3 blossom-card"
    style={accent ? { background: "linear-gradient(135deg, hsl(335 70% 60% / 0.04), hsl(350 65% 72% / 0.06))", border: "1.5px solid hsl(335 70% 60% / 0.25)" } : {}}
  >
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center"
        style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
      </div>
      <span className="text-xs font-semibold tracking-tight text-foreground">{title}</span>
    </div>
    {children}
  </div>
));
FormCard.displayName = "FormCard";

// ─── Schedule Section ─────────────────────────────────────────────────────────
const ScheduleSection = ({
  enabled,
  onToggle,
  scheduledTime,
  onTimeChange,
}: {
  enabled: boolean;
  onToggle: () => void;
  scheduledTime: string;
  onTimeChange: (v: string) => void;
}) => {
  // Minimum: 10 minutes from now (Meta requires at least 10 min ahead for scheduled posts)
  const minTime = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 16);
  // Maximum: 6 months from now (Meta limit)
  const maxTime = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const getScheduleLabel = () => {
    if (!scheduledTime) return null;
    const d = new Date(scheduledTime);
    return d.toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  return (
    <div className="rounded-2xl p-5 mb-3" style={{ background: "hsl(0 0% 100%)", border: "1.5px solid hsl(var(--border))", boxShadow: "var(--shadow-sm)" }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: "hsl(var(--cherry) / 0.12)", border: "1px solid hsl(var(--cherry) / 0.25)" }}
          >
            <CalendarClock className="w-3.5 h-3.5" style={{ color: "hsl(var(--cherry))" }} />
          </div>
          <span className="text-xs font-semibold tracking-tight text-foreground">Schedule Post</span>
          <span
            className="text-[0.5rem] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase"
            style={{ background: "hsl(var(--brand-dim))", color: "hsl(var(--brand))", border: "1px solid hsl(var(--brand) / 0.2)" }}
          >
            NEW
          </span>
        </div>
        {/* Toggle */}
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 text-xs font-medium cursor-pointer bg-transparent border-none transition-colors"
          style={{ color: enabled ? "hsl(var(--brand))" : "hsl(var(--muted-foreground))" }}
        >
          {enabled ? (
            <ToggleRight className="w-6 h-6" style={{ color: "hsl(var(--brand))" }} />
          ) : (
            <ToggleLeft className="w-6 h-6" style={{ color: "hsl(var(--muted-foreground))" }} />
          )}
          {enabled ? "Enabled" : "Disabled"}
        </button>
      </div>

      <p className="text-[0.7rem] text-muted-foreground mb-4 ml-[2.375rem]">
        Schedule this post for a specific date and time. Meta requires at least 10 minutes ahead.
      </p>

      {/* Datetime input — shown when enabled */}
      {enabled && (
        <div className="animate-scale-in">
          <div
            className="p-4 rounded-xl mb-3"
            style={{
              background: "linear-gradient(135deg, hsl(335 70% 60% / 0.05), hsl(350 65% 72% / 0.08))",
              border: "1.5px dashed hsl(335 70% 60% / 0.35)",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date */}
              <div className="flex-1">
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} />
                  Publish Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  min={minTime}
                  max={maxTime}
                  onChange={(e) => onTimeChange(e.target.value)}
                  className="premium-input"
                  style={{ colorScheme: "light" }}
                />
              </div>
            </div>

            {scheduledTime && (
              <div
                className="mt-3 flex items-center gap-2 p-2.5 rounded-xl text-xs"
                style={{ background: "hsl(var(--brand-dim))", border: "1px solid hsl(var(--brand) / 0.2)", color: "hsl(var(--brand))" }}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Will publish on <strong>{getScheduleLabel()}</strong></span>
              </div>
            )}
          </div>

          {/* Meta API info note */}
          <div
            className="flex items-start gap-2 p-3 rounded-xl text-[0.68rem] leading-relaxed text-muted-foreground"
            style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
          >
            <CalendarClock className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "hsl(var(--cherry))" }} />
            <span>
              Uses Meta's <strong>published=false</strong> + <strong>scheduled_publish_time</strong> parameters (Unix timestamp). 
              Posts are scheduled via the Facebook Graph API — see{" "}
              <a
                href="https://developers.facebook.com/docs/pages/publishing/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:opacity-80 transition-opacity"
                style={{ color: "hsl(var(--brand))" }}
              >
                Meta Docs
              </a>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Publisher Page ──────────────────────────────────────────────────────
const PublisherPage = ({ connected, onOpenDrawer, adAccounts, pages, credentials }: PublisherPageProps) => {
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [caption, setCaption] = useState("");
  const [headline, setHeadline] = useState("");
  const [destUrl, setDestUrl] = useState("");
  const [dispUrl, setDispUrl] = useState("");
  const [description, setDescription] = useState("");
  const [ctaType, setCtaType] = useState("NO_BUTTON");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imgError, setImgError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schedule state
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev, { id: ++logIdRef.current, type, message, time }]);
  }, []);

  const getPageToken = useCallback(() => {
    const page = pages.find((p: any) => p.id === selectedPage);
    return page?.access_token || credentials?.token || "";
  }, [pages, selectedPage, credentials]);

  const validateImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setImgError("Invalid file type. Use an image file."); return;
    }
    if (file.size > 30 * 1024 * 1024) { setImgError("File too large. Max 30MB."); return; }
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width !== img.height) { setImgError(`Must be square (1:1). Yours: ${img.width}×${img.height}px.`); return; }
      setImgError("");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      addLog("success", `Image: ${file.name} (${img.width}×${img.height})`);
    };
    img.onerror = () => setImgError("Could not read the image file.");
    img.src = URL.createObjectURL(file);
  }, [addLog]);

  const removeImage = () => {
    setImageFile(null); setImagePreview(""); setImgError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePublish = async () => {
    if (!connected || !credentials) { addLog("error", "Not connected."); onOpenDrawer(); return; }
    if (!selectedAdAccount) { addLog("error", "Select an Ad Account."); return; }
    if (!selectedPage) { addLog("error", "Select a Facebook Page."); return; }
    if (!imageFile) { addLog("error", "Upload an image."); return; }
    if (!headline) { addLog("error", "Headline is required."); return; }
    if (!destUrl) { addLog("error", "Destination URL is required."); return; }

    // Validate schedule time if enabled
    let scheduledUnix: number | null = null;
    if (scheduleEnabled) {
      if (!scheduledTime) { addLog("error", "Please pick a schedule date & time."); return; }
      const st = new Date(scheduledTime).getTime();
      const now = Date.now();
      if (st < now + 9 * 60 * 1000) { addLog("error", "Scheduled time must be at least 10 minutes from now."); return; }
      if (st > now + 180 * 24 * 60 * 60 * 1000) { addLog("error", "Scheduled time cannot exceed 6 months from now."); return; }
      scheduledUnix = Math.floor(st / 1000);
    }

    setPublishing(true);
    setPublishSuccess(false);
    setLogs([]);
    const pageToken = getPageToken();
    const base = { token: credentials.token, c_user: credentials.c_user, xs: credentials.xs };

    try {
      addLog("pending", "Step 1/6 — Uploading image...");
      const d1 = await fbApi({ ...base, action: "upload_image", ad_account_id: selectedAdAccount, page_token: pageToken }, imageFile);
      if (!d1?.success) { addLog("error", `Step 1 FAILED: ${d1?.error || "Unknown"}`); setPublishing(false); return; }
      addLog("success", "Step 1 DONE — Image uploaded");

      addLog("pending", "Step 2/6 — Creating ad creative...");
      const d2 = await fbApi({ ...base, action: "create_creative", ad_account_id: selectedAdAccount, page_id: selectedPage, page_token: pageToken, image_hash: d1.hash, headline, description, caption, destination_url: destUrl, display_url: dispUrl, cta_type: ctaType });
      if (!d2?.success) { addLog("error", `Step 2 FAILED: ${d2?.error || "Unknown"}`); setPublishing(false); return; }
      addLog("success", "Step 2 DONE — Creative created");

      addLog("pending", "Step 3/6 — Waiting for creative...");
      let storyId: string | null = null;
      for (let i = 1; i <= 15; i++) {
        await new Promise((r) => setTimeout(r, 2500));
        const dp = await fbApi({ ...base, action: "poll_creative", creative_id: d2.creative_id, page_token: pageToken });
        if (!dp?.success) { addLog("error", `Step 3 FAILED: ${dp?.error}`); setPublishing(false); return; }
        if (dp.ready) { storyId = dp.story_id; addLog("success", `Step 3 DONE — Ready (attempt ${i})`); break; }
        addLog("info", `Step 3 — Attempt ${i}/15...`);
      }
      if (!storyId) { addLog("error", "Step 3 FAILED: Timeout"); setPublishing(false); return; }

      // Step 4: Publish or Schedule
      if (scheduleEnabled && scheduledUnix) {
        addLog("pending", `Step 4/6 — Scheduling post for ${new Date(scheduledUnix * 1000).toLocaleString()}...`);
        // Meta API: POST /{page-id}/feed with published=false and scheduled_publish_time=<unix>
        const d3 = await fbApi({
          ...base,
          action: "publish_post",
          story_id: storyId,
          page_token: pageToken,
          published: false,
          scheduled_publish_time: scheduledUnix,
        });
        if (!d3?.success) { addLog("error", `Step 4 FAILED: ${d3?.error}`); setPublishing(false); return; }
        addLog("success", "Step 4 DONE — Post scheduled ✿");

        addLog("pending", "Step 5/6 — Verifying scheduled post...");
        await new Promise((r) => setTimeout(r, 1500));
        const dv = await fbApi({ ...base, action: "verify_post", post_id: d3.post_id, page_token: pageToken });
        addLog(dv?.success ? "success" : "info", dv?.success ? "Step 5 DONE — Verified ✓" : "Step 5 — Verification inconclusive");

        addLog("complete", `All done — post scheduled for ${new Date(scheduledUnix * 1000).toLocaleString()} 🌸`);
      } else {
        addLog("pending", "Step 4/6 — Publishing now...");
        const d3 = await fbApi({ ...base, action: "publish_post", story_id: storyId, page_token: pageToken });
        if (!d3?.success) { addLog("error", `Step 4 FAILED: ${d3?.error}`); setPublishing(false); return; }
        addLog("success", "Step 4 DONE — Published");

        addLog("pending", "Step 5/6 — Verifying...");
        await new Promise((r) => setTimeout(r, 1500));
        const dv = await fbApi({ ...base, action: "verify_post", post_id: d3.post_id, page_token: pageToken });
        addLog(dv?.success ? "success" : "info", dv?.success ? "Step 5 DONE — Verified ✓" : "Step 5 — Verification inconclusive");

        addLog("complete", "All steps complete — post is live! 🌸");
      }

      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 4000);
    } catch (e: any) {
      addLog("error", `Network error: ${e.message}`);
    }
    setPublishing(false);
  };

  const adAccountOptions = adAccounts.map((a: any) => ({ value: a.account_id, label: a.name || `act_${a.account_id}` }));
  const pageOptions = pages.map((p: any) => ({ value: p.id, label: p.name || p.id }));

  const publishBtnLabel = scheduleEnabled
    ? (publishing ? "Scheduling..." : publishSuccess ? "Scheduled! 🌸" : "Schedule Post")
    : (publishing ? "Publishing..." : publishSuccess ? "Published! 🌸" : "Publish to Facebook");

  return (
    <div className="min-h-screen pt-[calc(64px+2rem)] px-4 md:px-6 pb-16">
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="font-display text-[clamp(2rem,5vw,3.2rem)] font-bold tracking-tight mb-1.5"
            style={{ fontStyle: "italic" }}
          >
            Facebook <span className="grad-text">Publisher</span>
          </h1>
          <p className="text-muted-foreground text-xs">Create, publish or schedule ad-quality posts securely</p>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          {/* Lock overlay */}
          {!connected && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center gap-3 rounded-3xl"
              style={{ background: "hsl(340 30% 98% / 0.85)", backdropFilter: "blur(8px)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
              >
                <Lock className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-xs font-medium">Connect your account to get started</p>
              <button
                onClick={onOpenDrawer}
                className="px-6 py-2.5 rounded-full border-none text-white text-xs font-semibold cursor-pointer btn-primary"
              >
                Connect Now →
              </button>
            </div>
          )}

          {/* Account Selection */}
          <FormCard icon={Building2} iconColor="hsl(var(--brand))" title="Account Selection">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <RectangleHorizontal className="w-3 h-3" style={{ color: "hsl(var(--brand))" }} /> Ad Account
                </label>
                <CustomSelect
                  options={adAccountOptions}
                  value={selectedAdAccount}
                  onChange={setSelectedAdAccount}
                  placeholder={adAccounts.length ? "Select account..." : "Connect to load"}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <Flag className="w-3 h-3" style={{ color: "hsl(var(--petal))" }} /> Facebook Page
                </label>
                <CustomSelect
                  options={pageOptions}
                  value={selectedPage}
                  onChange={setSelectedPage}
                  placeholder={pages.length ? "Select page..." : "Connect to load"}
                />
              </div>
            </div>
          </FormCard>

          {/* Image Upload */}
          <FormCard icon={CloudUpload} iconColor="hsl(var(--petal))" title="Creative Image">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && validateImage(e.target.files[0])} />
            <div
              className={`border-2 border-dashed rounded-2xl cursor-pointer relative overflow-hidden transition-all ${
                dragOver ? "border-brand" : imageFile ? "border-solid" : "hover:border-muted-foreground/30"
              }`}
              style={{
                borderColor: dragOver ? "hsl(var(--brand))" : imageFile ? "hsl(var(--sage) / 0.5)" : "hsl(var(--border))",
                background: dragOver ? "hsl(var(--brand-dim))" : imageFile ? "hsl(var(--sage) / 0.06)" : "hsl(var(--input-bg))",
              }}
              onClick={() => !imageFile && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && validateImage(e.dataTransfer.files[0]); }}
            >
              {!imageFile ? (
                <div className="py-10 px-6 text-center">
                  <div className="text-3xl mb-3 animate-float">🌸</div>
                  <div className="text-xs font-semibold mb-1 text-foreground">Drop image or tap to browse</div>
                  <div className="text-[0.65rem] text-muted-foreground">Square (1:1) · PNG, JPG, WebP · Max 30MB</div>
                </div>
              ) : (
                <div className="p-3">
                  <div
                    className="flex items-center gap-3 rounded-xl p-3"
                    style={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(var(--border))" }}
                  >
                    <img src={imagePreview} alt="preview" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate mb-0.5 text-foreground">{imageFile.name}</div>
                      <div className="text-[0.65rem] flex items-center gap-1" style={{ color: "hsl(var(--sage))" }}>
                        <CheckCircle className="w-3 h-3" /> Ready
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeImage(); }} className="bg-transparent border-none text-muted-foreground cursor-pointer p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {imgError && (
              <div className="mt-2 p-2.5 rounded-xl text-[0.7rem] flex items-center gap-2" style={{ background: "hsl(var(--destructive) / 0.05)", border: "1px solid hsl(var(--destructive) / 0.15)", color: "hsl(var(--destructive))" }}>
                <AlertTriangle className="w-3 h-3 shrink-0" /> {imgError}
              </div>
            )}
          </FormCard>

          {/* Post Details */}
          <FormCard icon={PenLine} iconColor="hsl(var(--cherry))" title="Post Details">
            <div className="flex flex-col gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <PenLine className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} /> Caption
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full font-medium normal-case tracking-normal text-muted-foreground" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>Optional</span>
                </label>
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write your post caption..." className="premium-input resize-y min-h-[72px]" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <Heading className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} /> Headline <span className="text-destructive">*</span>
                </label>
                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Eye-catching headline" className="premium-input" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <PenLine className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} /> Description
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full font-medium normal-case tracking-normal text-muted-foreground" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>Optional</span>
                </label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief website description" className="premium-input" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                    <Link className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} /> Destination URL <span className="text-destructive">*</span>
                  </label>
                  <input type="url" value={destUrl} onChange={(e) => setDestUrl(e.target.value)} placeholder="https://example.com" className="premium-input" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                    <Globe className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} /> Display URL
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full font-medium normal-case tracking-normal text-muted-foreground" style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}>Optional</span>
                  </label>
                  <input type="text" value={dispUrl} onChange={(e) => setDispUrl(e.target.value)} placeholder="example.com" className="premium-input" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                  <MousePointerClick className="w-3 h-3" style={{ color: "hsl(var(--cherry))" }} /> CTA Button
                </label>
                <CustomSelect options={CTA_OPTIONS} value={ctaType} onChange={setCtaType} searchable={false} />
              </div>
            </div>
          </FormCard>

          {/* ─── Schedule Section ─── */}
          <ScheduleSection
            enabled={scheduleEnabled}
            onToggle={() => setScheduleEnabled((v) => !v)}
            scheduledTime={scheduledTime}
            onTimeChange={setScheduledTime}
          />

          {/* Publish / Schedule Button */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full py-4 rounded-2xl border-none text-white font-semibold text-sm cursor-pointer flex items-center justify-center gap-2.5 transition-all mb-4 disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
            style={
              publishSuccess
                ? { background: "linear-gradient(135deg, hsl(var(--sage)), hsl(140 30% 38%))", boxShadow: "0 4px 20px hsl(var(--sage) / 0.2)" }
                : scheduleEnabled
                ? { background: "linear-gradient(135deg, hsl(var(--cherry)), hsl(var(--brand)))", boxShadow: "0 4px 20px hsl(var(--cherry) / 0.25)" }
                : {}
            }
          >
            {publishing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
            ) : publishSuccess ? (
              <CheckCircle className="w-4 h-4" />
            ) : scheduleEnabled ? (
              <CalendarClock className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {publishBtnLabel}
          </button>
        </div>

        {/* Terminal */}
        <div className="mt-6">
          <TerminalLog logs={logs} onClear={() => setLogs([])} />
        </div>
      </div>
    </div>
  );
};

export default PublisherPage;
