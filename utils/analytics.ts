import { POST_HOG_EVENT, POST_HOG_PROPERTY } from "constants/analytics";
import { IS_LOCALHOST_ANALYTICS_DISABLED } from "constants/features";
import posthog from "posthog-js";

export function isAnalyticsEnabled() {
  const isLocalhost =
    window.location.href.includes("127.0.0.1") ||
    window.location.href.includes("localhost");
  const isAnalyticsEnabled =
    (IS_LOCALHOST_ANALYTICS_DISABLED && !isLocalhost) ||
    !IS_LOCALHOST_ANALYTICS_DISABLED;
  return isAnalyticsEnabled;
}

export function initAnalytics() {
  if (isAnalyticsEnabled() && process.env.NEXT_PUBLIC_POST_HOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POST_HOG_KEY, {
      api_host: "https://app.posthog.com",
      debug: false,
    });
  }
}

export function handleDefineAccountAddressEvent(accountAddress: string) {
  if (isAnalyticsEnabled()) {
    posthog.identify(accountAddress);
  }
}

export function handlePageViewEvent() {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.pageView);
  }
}

export function handleCatchErrorEvent(error: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.caughtError, {
      [POST_HOG_PROPERTY.errorMessage]: error?.message,
      [POST_HOG_PROPERTY.errorStack]: error?.stack,
    });
  }
}
