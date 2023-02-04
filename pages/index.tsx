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
  ThickDivider,
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
                sx={{ borderColor: "blue" }}
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
                sx={{ borderColor: "purpleDark" }}
                variant="outlined"
              >
                <Typography fontSize={32}>💰</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "32px", px: 2 }}>
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
                sx={{ borderColor: "green" }}
                variant="outlined"
              >
                <Typography fontSize={32}>🎯</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "48px", px: 2 }}>
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
                sx={{ borderColor: "red" }}
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
        {/* Roadmap */}
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ mt: 16, mb: 3 }}
          textAlign="center"
        >
          A space that improves with you!
        </Typography>
        <Timeline
          position="alternate"
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{ width: 1, mt: 2 }}
        >
          {/* Version one */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ m: "auto 0" }} align="right">
              <Typography variant="h6" fontWeight={700}>
                Version 1.0
              </Typography>
              <Typography>Feb & Mar 2023</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "orange" }}
                variant="outlined"
              >
                <Typography fontSize={32}>😀</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "24px", px: 2 }}>
              <Typography color={grey[700]} gutterBottom>
                goals with staking
              </Typography>
              <Typography color={grey[600]} gutterBottom>
                watchers motivators
              </Typography>
              <Typography color={grey[500]} gutterBottom>
                notifications
              </Typography>
              <Typography color={grey[400]}>
                account page with history
              </Typography>
            </TimelineContent>
          </TimelineItem>
          {/* Version two */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ m: "auto 0" }} align="right">
              <Typography variant="h6" fontWeight={700}>
                Version 2.0
              </Typography>
              <Typography>Apr & May 2023</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "blue" }}
                variant="outlined"
              >
                <Typography fontSize={32}>🤩</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "24px", px: 2 }}>
              <Typography color={grey[700]} gutterBottom>
                validated goals
              </Typography>
              <Typography color={grey[600]} gutterBottom>
                watchers super motivators
              </Typography>
              <Typography color={grey[500]} gutterBottom>
                group marathons
              </Typography>
              <Typography color={grey[400]}>journal</Typography>
            </TimelineContent>
          </TimelineItem>
          {/* Version three */}
          <TimelineItem>
            <TimelineOppositeContent sx={{ m: "auto 0" }} align="right">
              <Typography variant="h6" fontWeight={700}>
                Version 3.0
              </Typography>
              <Typography>Summer 2023</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector sx={{ height: 12 }} />
              <LandingTimelineDot
                sx={{ borderColor: "green" }}
                variant="outlined"
              >
                <Typography fontSize={32}>🤯</Typography>
              </LandingTimelineDot>
              <TimelineConnector sx={{ height: 12 }} />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "24px", px: 2 }}>
              <Typography color={grey[700]} gutterBottom>
                private goals with friends
              </Typography>
              <Typography color={grey[600]} gutterBottom>
                AI to motivate and visualise
              </Typography>
              <Typography color={grey[500]} gutterBottom>
                dashboard and analysis
              </Typography>
              <Typography color={grey[400]}>and a lot more...</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
        <XxlLoadingButton variant="outlined" href="/feedback" sx={{ mt: 2 }}>
          Suggest Improvement
        </XxlLoadingButton>
        {/* Copyright */}
        <ThickDivider sx={{ width: 1, mt: 12, mb: 6 }} />
        <Typography
          color="text.secondary"
          variant="body2"
          sx={{ textAlign: "center" }}
        >
          Web3 Goals — A social space that motivates to achieve! © 2023
        </Typography>
      </CentralizedBox>
    </Layout>
  );
}
