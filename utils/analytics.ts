import { POST_HOG_EVENT, POST_HOG_PROPERTY } from "constants/analytics";
import { IS_LOCALHOST_ANALYTICS_ENABLED } from "constants/features";
import packageJson from "package.json";
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
        loaded: () => {
          posthog.register({
            [POST_HOG_PROPERTY.appVersion]: packageJson.version,
          });
        },
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

  export function clickedShareGoalToTwitter(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.clickedShareGoalToTwitter, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function clickedShareGoalToTelegram(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.clickedShareGoalToTelegram, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function postedMessage(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.postedMessage, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function evaluatedMessage(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.evaluatedMessage, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function postedProof(goalId: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.postedProof, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function closedGoal(goalId: any, isGoalAchieved: any, chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.closedGoal, {
        [POST_HOG_PROPERTY.goal]: goalId,
        [POST_HOG_PROPERTY.isGoalAchieved]: isGoalAchieved,
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function createdProfile(chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.createdProfile, {
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function editedProfile(chainId: any) {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.editedProfile, {
        [POST_HOG_PROPERTY.chain]: chainId,
      });
    }
  }

  export function postedFeedback() {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.postedFeedback, {});
    }
  }

  export function postedContacts() {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.postedContacts, {});
    }
  }

  export function openedEarlyAdoptersClub() {
    if (isEnabled()) {
      posthog.capture(POST_HOG_EVENT.openedEarlyAdoptersClub, {});
    }
  }
}
