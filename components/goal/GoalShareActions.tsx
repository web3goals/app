import { Telegram, Twitter } from "@mui/icons-material";
import { Box, IconButton, Link as MuiLink, SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import { LargeLoadingButton } from "components/styled";
import useToasts from "hooks/useToast";
import Link from "next/link";
import { Analytics } from "utils/analytics";
import { useNetwork } from "wagmi";

/**
 * A component with buttons to share a goal.
 */
export default function GoalShareActions(props: { id: string; sx?: SxProps }) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();
  const goalLink = `${global.window.location.origin}/goals/${props.id}`;
  const twitterLink = `https://twitter.com/intent/tweet?url=${goalLink}`;
  const telegramLink = `https://t.me/share/url?url=${goalLink}`;

  if (goalLink) {
    return (
      <Box
        sx={{
          width: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ...props.sx,
        }}
      >
        {/* Buttons to share via social networks */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <IconButton
            href={twitterLink}
            target="_blank"
            color="primary"
            sx={{ border: 4, p: 3 }}
            onClick={() =>
              Analytics.clickedShareGoalToTwitter(props.id, chain?.id)
            }
          >
            <Twitter sx={{ fontSize: 36 }} />
          </IconButton>
          <IconButton
            href={telegramLink}
            target="_blank"
            color="primary"
            sx={{ border: 4, p: 3 }}
            onClick={() =>
              Analytics.clickedShareGoalToTelegram(props.id, chain?.id)
            }
          >
            <Telegram sx={{ fontSize: 36 }} />
          </IconButton>
        </Stack>
        {/* Link and copy button */}
        <Box
          sx={{
            width: 1,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            border: 3,
            borderColor: "divider",
            borderRadius: 5,
            px: { xs: 1, md: 2 },
            py: { xs: 2, md: 1 },
            mt: 3,
          }}
        >
          <Link href={goalLink} legacyBehavior passHref>
            <MuiLink
              sx={{
                lineBreak: "anywhere",
                fontWeight: 700,
                textAlign: "center",
                mb: { xs: 2, md: 0 },
              }}
            >
              {goalLink}
            </MuiLink>
          </Link>
          <LargeLoadingButton
            variant="outlined"
            onClick={() => {
              navigator.clipboard.writeText(goalLink);
              showToastSuccess("Link copied");
              Analytics.copiedGoalLink(props.id, chain?.id);
            }}
          >
            Copy
          </LargeLoadingButton>
        </Box>
      </Box>
    );
  }

  return <></>;
}
