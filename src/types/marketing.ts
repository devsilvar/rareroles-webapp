/**
 * Marketing / tracking script manager — shared types.
 *
 * Scope note: this system DELIVERS third-party tags and ANNOUNCES conversions
 * to them. It does not measure anything. Impressions, clicks, attribution and
 * ROAS all live in the vendor's own dashboard.
 */

export type ScriptLocation = "head" | "body_start" | "body_end" | "slot";
export type PageMode = "all" | "include" | "exclude";
export type LoadTiming = "immediate" | "idle" | "delay" | "consent";

export type Platform =
  | "google_ads"
  | "ga4"
  | "gtm"
  | "meta"
  | "instagram"
  | "linkedin"
  | "tiktok"
  | "twitter"
  | "pinterest"
  | "snapchat"
  | "microsoft_ads"
  | "custom";

/** Columns the public site is allowed to read (see marketing_scripts_public). */
export interface PublicMarketingScript {
  id: string;
  name: string;
  platform: Platform;
  snippet: string | null;
  template_key: string | null;
  template_id: string | null;
  noscript_html: string | null;
  location: ScriptLocation;
  slot_id: string | null;
  page_mode: PageMode;
  page_paths: string[];
  load_timing: LoadTiming;
  load_delay_ms: number;
  priority: number;
  spa_pageview: boolean;
}

/** Full admin-facing row. */
export interface MarketingScript extends PublicMarketingScript {
  notes: string | null;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export type MarketingScriptDraft = Omit<
  MarketingScript,
  "id" | "created_at" | "updated_at" | "created_by" | "updated_by"
>;

export const PLATFORM_LABELS: Record<Platform, string> = {
  ga4: "Google Analytics 4",
  google_ads: "Google Ads",
  gtm: "Google Tag Manager",
  meta: "Meta / Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  twitter: "X / Twitter",
  pinterest: "Pinterest",
  snapchat: "Snapchat",
  microsoft_ads: "Microsoft Ads (Bing)",
  custom: "Custom / Other",
};

export const LOCATION_LABELS: Record<ScriptLocation, string> = {
  head: "In the page <head>",
  body_start: "Top of the page body",
  body_end: "Bottom of the page body",
  slot: "At a specific spot on a page",
};

export const LOCATION_HELP: Record<ScriptLocation, string> = {
  head: "Where most vendors tell you to paste. Correct for GA4, Google Ads, GTM, LinkedIn and most pixels.",
  body_start:
    "For tags whose instructions say \"immediately after the opening <body> tag\" — most commonly the Google Tag Manager noscript fallback.",
  body_end:
    "Loads last. Good for chat widgets and anything heavy that should not compete with the page rendering.",
  slot: "Places the tag at a specific point inside a page, chosen from the list your developer has set up.",
};

export const TIMING_LABELS: Record<LoadTiming, string> = {
  immediate: "As soon as possible",
  idle: "When the browser is idle",
  delay: "After a delay",
  consent: "Only after cookie consent",
};

/**
 * Guided templates. Most owners have only the measurement ID to hand, and
 * hand-pasting is where mistakes happen. `build` produces the vendor's own
 * documented snippet verbatim — we never invent or "improve" their code.
 */
export interface ScriptTemplate {
  key: string;
  platform: Platform;
  label: string;
  idLabel: string;
  idPlaceholder: string;
  idPattern: RegExp;
  help: string;
  recommendedLocation: ScriptLocation;
  build: (id: string) => string;
  buildNoscript?: (id: string) => string;
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  {
    key: "ga4",
    platform: "ga4",
    label: "Google Analytics 4",
    idLabel: "Measurement ID",
    idPlaceholder: "G-XXXXXXXXXX",
    idPattern: /^G-[A-Z0-9]{6,}$/i,
    help: "Google Analytics → Admin → Data streams → your stream. Starts with G-.",
    recommendedLocation: "head",
    build: (id) => `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`,
  },
  {
    key: "google_ads",
    platform: "google_ads",
    label: "Google Ads",
    idLabel: "Conversion ID",
    idPlaceholder: "AW-123456789",
    idPattern: /^AW-\d{6,}$/i,
    help: "Google Ads → Goals → Conversions → your action. Starts with AW-.",
    recommendedLocation: "head",
    build: (id) => `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${id}');
</script>`,
  },
  {
    key: "gtm",
    platform: "gtm",
    label: "Google Tag Manager",
    idLabel: "Container ID",
    idPlaceholder: "GTM-XXXXXXX",
    idPattern: /^GTM-[A-Z0-9]{5,}$/i,
    help: "Tag Manager → Workspace → container ID at the top. Starts with GTM-.",
    recommendedLocation: "head",
    build: (id) => `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');</script>`,
    buildNoscript: (id) =>
      `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
  },
  {
    key: "meta_pixel",
    platform: "meta",
    label: "Meta Pixel (Facebook / Instagram)",
    idLabel: "Pixel ID",
    idPlaceholder: "123456789012345",
    idPattern: /^\d{10,20}$/,
    help: "Meta Events Manager → Data sources → your pixel. A long number.",
    recommendedLocation: "head",
    build: (id) => `<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${id}');
  fbq('track', 'PageView');
</script>`,
    buildNoscript: (id) =>
      `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" alt="" />`,
  },
  {
    key: "linkedin",
    platform: "linkedin",
    label: "LinkedIn Insight Tag",
    idLabel: "Partner ID",
    idPlaceholder: "1234567",
    idPattern: /^\d{5,10}$/,
    help: "LinkedIn Campaign Manager → Analyze → Insight Tag.",
    recommendedLocation: "head",
    build: (id) => `<script type="text/javascript">
  _linkedin_partner_id = "${id}";
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
  (function(l) {
  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
  window.lintrk.q=[]}
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>`,
    buildNoscript: (id) =>
      `<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=${id}&fmt=gif" />`,
  },
  {
    key: "tiktok",
    platform: "tiktok",
    label: "TikTok Pixel",
    idLabel: "Pixel ID",
    idPlaceholder: "CXXXXXXXXXXXXXXXXXXX",
    idPattern: /^[A-Z0-9]{15,25}$/i,
    help: "TikTok Ads Manager → Assets → Events → Web Events.",
    recommendedLocation: "head",
    build: (id) => `<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${id}');
  ttq.page();
}(window, document, 'ttq');
</script>`,
  },
];

export function findTemplate(key: string | null): ScriptTemplate | undefined {
  if (!key) return undefined;
  return SCRIPT_TEMPLATES.find((t) => t.key === key);
}
