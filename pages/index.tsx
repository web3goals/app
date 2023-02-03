import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Link as MuiLink, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import Layout from "components/layout";
import {
  CentralizedBox,
  LandingTimelineDot,
  XxlLoadingButton,
} from "components/styled";
import Link from "next/link";

/**
 * Landing page.
 */
export default function Landing() {
  return (
    <Layout>
      <CentralizedBox>
        {/* Title */}
        <Box>
          <Typography
            variant="h1"
            fontWeight={700}
            textAlign="center"
            sx={{ mt: 6 }}
          >
            A social space that motivates to{" "}
            <Link href="/goals/set" legacyBehavior passHref>
              <MuiLink>achieve</MuiLink>
            </Link>
            !
          </Typography>
        </Box>
        {/* How it works */}
        <Timeline
          position="alternate"
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{ width: 1, mt: 8 }}
        >
          {/* Step one */}
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="h6"
              fontWeight={700}
            >
              Set a goal
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "#2B6EFD" }}
                variant="outlined"
              >
                <Typography fontSize={32}>🏔️</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography color={grey[600]} gutterBottom>
                code every day for 100 days
              </Typography>
              <Typography color={grey[500]} gutterBottom>
                pass a Spanish test
              </Typography>
              <Typography color={grey[400]}>
                go to the Himalayas this summer
              </Typography>
            </TimelineContent>
          </TimelineItem>
          {/* Step two */}
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="h6"
              fontWeight={700}
            >
              Stake funds
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "#410C92" }}
                variant="outlined"
              >
                <Typography fontSize={32}>💰</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "24px", px: 2 }}>
              <Typography color={grey[600]} gutterBottom>
                5 ethers
              </Typography>
              <Typography color={grey[500]}>100 matic</Typography>
            </TimelineContent>
          </TimelineItem>
          {/* Step three */}
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="h6"
              fontWeight={700}
            >
              Achieve the goal
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "#1DB954" }}
                variant="outlined"
              >
                <Typography fontSize={32}>🎯</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "36px", px: 2 }}>
              <Typography color={grey[600]}>
                friends, look, I did it!
              </Typography>
            </TimelineContent>
          </TimelineItem>
          {/* Step four */}
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="h6"
              fontWeight={700}
            >
              Or your stake will be shared between watchers
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "#FF4400" }}
                variant="outlined"
              >
                <Typography fontSize={32}>💸</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}></TimelineContent>
          </TimelineItem>
        </Timeline>
        <XxlLoadingButton variant="contained" href="/goals/set" sx={{ mt: 2 }}>
          Set Goal
        </XxlLoadingButton>
      </CentralizedBox>
    </Layout>
  );
}
