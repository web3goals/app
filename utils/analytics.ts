import { POST_HOG_EVENT, POST_HOG_PROPERTY } from "constants/analytics";
import { IS_LOCALHOST_ANALYTICS_ENABLED } from "constants/features";
import posthog from "posthog-js";

export namespace Analytics {
  export function isEnabled() {
    const isLocalhost =
      window.location.href.includes("127.0.0.1") ||
      window.location.href.includes("localhost");
    const isAnalyticsEnabled =
      !isLocalhost || (isLocalhost && IS_LOCALHOST_ANALYTICS_ENABLED);
    return isAnalyticsEnabled;
  }

  export function init() {
    if (isEnabled() && process.env.NEXT_PUBLIC_POST_HOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POST_HOG_KEY, {
        api_host: "https://app.posthog.com",
        debug: false,
      });
    }
  }

  export function identifyAccountAddress(accountAddress: string) {
    if (isEnabled()) {
      posthog.identify(accountAddress);
    }
  }

  export function pageView() {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.pageView);
    }
  }

  export function caughtError(error: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.caughtError, {
        [POST_HOG_PROPERTY.errorMessage]: error?.message,
        [POST_HOG_PROPERTY.errorStack]: error?.stack,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function connectedAccount(accountAddress: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.connectedAccount, {
        [POST_HOG_PROPERTY.account]: accountAddress,
      });
    }
  }

  export function setGoal(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.setGoal, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function copiedGoalLink(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.copiedGoalLink, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function clickedShareGoalToSocial(
    goalId: any,
    link: any,
    chainId: any
  ) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.clickedShareGoalToSocial, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.link]: link,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }
}
