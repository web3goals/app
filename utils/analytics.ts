import { POST_HOG_EVENT, POST_HOG_PROPERTY } from "constants/analytics";
import { IS_LOCALHOST_ANALYTICS_ENABLED } from "constants/features";
import posthog from "posthog-js";

export function isAnalyticsEnabled() {
  const isLocalhost =
    window.location.href.includes("127.0.0.1") ||
    window.location.href.includes("localhost");
  const isAnalyticsEnabled =
    !isLocalhost || (isLocalhost && IS_LOCALHOST_ANALYTICS_ENABLED);
  return isAnalyticsEnabled;
}

export function initAnalytics() {
  if (isAnalyticsEnabled() && process.env.NEXT_PUBLIC_POST_HOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POST_HOG_KEY, {
      api_host: "https://app.posthog.com",
      debug: true, // TODO: Disable debug
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

export function handleCatchErrorEvent(error: any, chainId: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.caughtError, {
      [POST_HOG_PROPERTY.errorMessage]: error?.message,
      [POST_HOG_PROPERTY.errorStack]: error?.stack,
      [POST_HOG_PROPERTY.chain]: chainId,
    });
  }
}

export function handleConnectedAccountEvent(accountAddress: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.connectedAccount, {
      [POST_HOG_PROPERTY.account]: accountAddress,
    });
  }
}

export function handleSetGoalEvent(goalId: any, chainId: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.setGoal, {
      [POST_HOG_PROPERTY.goal]: goalId,
      [POST_HOG_PROPERTY.chain]: chainId,
    });
  }
}

export function handleCopiedGoalLinkEvent(goalId: any, chainId: any) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.copiedGoalLink, {
      [POST_HOG_PROPERTY.goal]: goalId,
      [POST_HOG_PROPERTY.chain]: chainId,
    });
  }
}

export function handleClickedShareGoalToSocialEvent(
  goalId: any,
  link: any,
  chainId: any
) {
  if (isAnalyticsEnabled()) {
    posthog.capture(POST_HOG_EVENT.clickedShareGoalToSocial, {
      [POST_HOG_PROPERTY.goal]: goalId,
      [POST_HOG_PROPERTY.link]: link,
      [POST_HOG_PROPERTY.chain]: chainId,
    });
  }
}
