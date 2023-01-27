import { Telegram, Twitter } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Link as MuiLink,
  SxProps,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton } from "components/styled";
import useToasts from "hooks/useToast";
import Link from "next/link";

/**
 * A component with buttons to share a goal.
 */
export default function GoalShareActions(props: { id: string; sx?: SxProps }) {
  const { showToastSuccess } = useToasts();
  const goalLink = `${global.window.location.origin}/goals/${props.id}`;

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
        <Typography variant="h6" textAlign="center">
          🗣️ Share this goal with your friends and followers
        </Typography>
        {/* Buttons to share via social networks */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <IconButton
            href={`https://twitter.com/intent/tweet?url=${goalLink}`}
            target="_blank"
            color="primary"
            sx={{ border: 4, p: 3 }}
          >
            <Twitter sx={{ fontSize: 36 }} />
          </IconButton>
          <IconButton
            href={`https://t.me/share/url?url=${goalLink}`}
            target="_blank"
            color="primary"
            sx={{ border: 4, p: 3 }}
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
            mt: 2,
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
              🔗 {goalLink}
            </MuiLink>
          </Link>
          <XlLoadingButton
            variant="outlined"
            onClick={() => {
              navigator.clipboard.writeText(goalLink);
              showToastSuccess("Link copied");
            }}
          >
            Copy
          </XlLoadingButton>
        </Box>
      </Box>
    );
  }

  return <></>;
}
