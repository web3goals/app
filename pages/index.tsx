import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Container, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import Layout from "components/layout";
import {
  CentralizedBox,
  LandingTimelineDot,
  XxlLoadingButton,
} from "components/styled";

/**
 * Landing page.
 */
export default function Landing() {
  return (
    <Layout
      maxWidth={false}
      disableGutters={true}
      hideToolbar={true}
      sx={{ pt: 0 }}
    >
      <CentralizedBox sx={{ mt: 0 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundImage: `url(/images/header.png)`,
            backgroundSize: "cover",
            minHeight: "100vh",
            width: 1,
          }}
        >
          {/* Header content */}
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "md",
              color: "#FFFFFF",
            }}
          >
            <Typography
              variant="h1"
              fontWeight={700}
              textAlign="center"
              sx={{ mt: 24, mb: 4 }}
            >
              A social space that motivates to achieve your goals!
            </Typography>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign="center"
              color="rgba(255, 255, 255, 1.0);"
              gutterBottom
            >
              💻 Become a better developer
            </Typography>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign="center"
              color="rgba(255, 255, 255, 0.85);"
              gutterBottom
            >
              🎨 Become a better artist
            </Typography>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign="center"
              color="rgba(255, 255, 255, 0.7);"
              gutterBottom
            >
              💰 Become a better entrepreneur
            </Typography>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign="center"
              color="rgba(255, 255, 255, 0.55);"
              gutterBottom
            >
              👟 Become a better athlete
            </Typography>
            <Typography
              variant="h6"
              fontWeight={300}
              textAlign="center"
              color="rgba(255, 255, 255, 0.4);"
              gutterBottom
            >
              ❤️ Become a better person
            </Typography>
            <XxlLoadingButton
              variant="contained"
              href="/goals/set"
              sx={{
                color: "primary.main",
                background: "#FFFFFF",
                ":hover": { background: "#FFFFFF" },
                mt: 4,
                mb: 12,
              }}
            >
              Start Achieve
            </XxlLoadingButton>
          </Container>
        </Box>
        {/* Content */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "md",
          }}
        >
          {/* How it works */}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 12, mb: 3 }}
            textAlign="center"
          >
            How does the space work?
          </Typography>
          <Timeline
            position="alternate"
            onResize={undefined}
            onResizeCapture={undefined}
            sx={{ width: 1, mt: 2 }}
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
                Accept watchers who motivate
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "purpleLight" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>👀</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography color={grey[600]} gutterBottom>
                  your goal is great, hope you can do it!
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
                Achieve the goal and attach the proof
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
            {/* Step five */}
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
          <XxlLoadingButton
            variant="contained"
            href="/goals/set"
            sx={{ mt: 2 }}
          >
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
                  First version
                </Typography>
                <Typography>Mar 2023</Typography>
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
                <Typography color={grey[900]} gutterBottom>
                  goals with a stake
                </Typography>
                <Typography color={grey[800]} gutterBottom>
                  motivational watchers
                </Typography>
                <Typography color={grey[700]} gutterBottom>
                  proof of achievement
                </Typography>
                <Typography color={grey[600]} gutterBottom>
                  goals as soulbound tokens
                </Typography>
                <Typography color={grey[500]} gutterBottom>
                  account page
                </Typography>
                <Typography color={grey[400]} gutterBottom>
                  notifications
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Version two */}
            <TimelineItem>
              <TimelineOppositeContent sx={{ m: "auto 0" }} align="right">
                <Typography variant="h6" fontWeight={700}>
                  Second version
                </Typography>
                <Typography>May 2023</Typography>
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
                <Typography color={grey[900]} gutterBottom>
                  verified goals
                </Typography>
                <Typography color={grey[800]} gutterBottom>
                  goal marathons
                </Typography>
                <Typography color={grey[700]} gutterBottom>
                  journal
                </Typography>
                <Typography color={grey[600]}>
                  active motivational watchers
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Version three */}
            <TimelineItem>
              <TimelineOppositeContent sx={{ m: "auto 0" }} align="right">
                <Typography variant="h6" fontWeight={700}>
                  Third version
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
                <Typography color={grey[900]} gutterBottom>
                  private goals with friends
                </Typography>
                <Typography color={grey[800]} gutterBottom>
                  goals verified by others with high reputation
                </Typography>
                <Typography color={grey[700]} gutterBottom>
                  dashboard for analyzing own progress
                </Typography>
                <Typography color={grey[600]} gutterBottom>
                  AI that helps to set SMART goal and achieve it
                </Typography>
                <Typography color={grey[500]} gutterBottom>
                  stake for charity
                </Typography>
                <Typography color={grey[400]}>and a lot more...</Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
          <XxlLoadingButton variant="outlined" href="/feedback" sx={{ mt: 2 }}>
            Suggest Improvement
          </XxlLoadingButton>
        </Container>
      </CentralizedBox>
    </Layout>
  );
}
