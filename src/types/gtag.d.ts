interface GtagConsentParams {
  analytics_storage?: "granted" | "denied";
  ad_storage?: "granted" | "denied";
  ad_user_data?: "granted" | "denied";
  ad_personalization?: "granted" | "denied";
  wait_for_update?: number;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: string }>;
}

interface Window {
  gtag: (
    command: "consent" | "config" | "event" | "js" | "set",
    targetOrAction: string | Date,
    params?: Record<string, unknown> | GtagConsentParams
  ) => void;
  dataLayer: unknown[];
  __pwaPrompt?: BeforeInstallPromptEvent | null;
}
