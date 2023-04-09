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
import Image from "next/image";

/**
 * Landing page.
 */
export default function Landing() {
  return (
    <Layout maxWidth={false} disableGutters={true} sx={{ pt: 0 }}>
      <CentralizedBox>
        {/* Header */}
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: { xs: 4, md: 8 },
          }}
        >
          <Typography variant="h1" textAlign="center">
            A <strong>social space</strong> that helps any person or community
            to <strong>achieve their goals!</strong>
          </Typography>
          <XxlLoadingButton
            variant="contained"
            href="/goals/set"
            sx={{ mt: 4 }}
          >
            Start Achieve
          </XxlLoadingButton>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width={{ xs: "100%", md: "65%" }}
            mt={{ xs: 4, md: 8 }}
          >
            <Image
              src="/images/thoughts.png"
              alt="Thoughts"
              width="100"
              height="100"
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </Box>
        </Container>
        {/* Quote */}
        <Box
          width={1}
          py={{ xs: 6, md: 8 }}
          sx={{ backgroundColor: "purpleDark" }}
        >
          <Container maxWidth="md" sx={{ color: "white", textAlign: "center" }}>
            <Typography variant="h4">💬</Typography>
            <Typography variant="h4" fontWeight={700} mt={4}>
              “A year from now you may wish you had started today“
            </Typography>
            <Typography fontWeight={700} mt={4}>
              — Karen Lamb
            </Typography>
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
                Share the link
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "purpleLight" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>🔗</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography color={grey[600]} gutterBottom>
                  friends, who wants to be my motivator?
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
                Accept motivators who inspire
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "yellow" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>✨</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography color={grey[600]} gutterBottom>
                  alice, your goal is great, hope you can do it!
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
                Achieve the goal, attach a proof, earn a reputation
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
                <Typography color={grey[600]}>photo</Typography>
                <Typography color={grey[500]}>document</Typography>
                <Typography color={grey[400]}>video</Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step six */}
            <TimelineItem>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="h6"
                fontWeight={700}
              >
                Or your stake will be shared between motivators and reputation
                will be lost
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
        </Container>
      </CentralizedBox>
    </Layout>
  );
}
