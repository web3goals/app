import {
  Container,
  Link as MuiLink,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import AccountExplore from "components/account/AccountExplore";
import GoalExplore from "components/goal/GoalExplore";
import Layout from "components/layout";
import Quote from "components/layout/Quote";
import { ExtraLargeLoadingButton, ThickDivider } from "components/styled";
import Image from "next/image";

/**
 * Landing page.
 */
export default function Landing() {
  return (
    <Layout maxWidth={false} disableGutters={true}>
      <Header sx={{ mt: { md: 4 } }} />
      <Quote
        text="A year from now you may wish you had started today"
        author="Karen Lamb"
      />
      <Content sx={{ mt: { xs: 6, md: 12 } }} />
    </Layout>
  );
}

function Header(props: { sx?: SxProps }) {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Typography variant="h1" textAlign="center">
        A <strong>social space</strong> that helps people and communities to{" "}
        <strong>achieve their goals!</strong>
      </Typography>
      <ExtraLargeLoadingButton
        variant="contained"
        href="/goals/set"
        sx={{ mt: 4 }}
      >
        Start Achieve
      </ExtraLargeLoadingButton>
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
  );
}

function Content(props: { sx?: SxProps }) {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      <HowItWorks />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <GoalExplore
        title="💎 Space for ambitious goals"
        pageSize={3}
        displayExploreAllButton
      />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <AccountExplore
        title="🔆 Space for bright people"
        pageSize={3}
        displayExploreAllButton
      />
      <ThickDivider sx={{ mt: 8, mb: 8 }} />
      <Faq />
    </Container>
  );
}

function HowItWorks(props: { sx?: SxProps }) {
  return (
    <Box sx={{ ...props.sx }}>
      <Box
        id="how-it-works"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-98px",
          visibility: "hidden",
        }}
      />
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ⚡ How does the space work?
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        Or how successful achievers and inspiring people are born in this space
      </Typography>
      <HowItWorksStep
        title="Set a goal with a deadline and stake funds on achieving it"
        description="You can set any goal that is very important to you. It can be a task for the week, or a commitment for this year"
        image="/images/how-it-works-1.png"
        sx={{ mt: 6 }}
      />
      <HowItWorksStep
        title="Share with a link"
        description="That way your friends and followers will be able to know about your goal and inspire you with motivational messages"
        image="/images/how-it-works-2.png"
        reverse
        sx={{ mt: 6 }}
      />
      <HowItWorksStep
        title="Receive messages"
        description="And boost the reputation of motivating authors. Let everyone see who in this space inspires people to do great things"
        image="/images/how-it-works-3.png"
        sx={{ mt: 6 }}
      />
      <HowItWorksStep
        title="Achieve the goal, attach a proof, and earn a reputation"
        description="Or your staked funds will be sent to the treasury of space, and reputation will be lost"
        image="/images/how-it-works-4.png"
        reverse
        sx={{ mt: 6 }}
      />
      <HowItWorksStep
        title="Don't stand still"
        description="A space with a treasury replenished by failed goals and donations will seek to regularly reward achievers and motivators with a good reputation"
        image="/images/how-it-works-5.png"
        sx={{ mt: 6 }}
      />
      <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
        <ExtraLargeLoadingButton variant="contained" href="/goals/set">
          Set Goal
        </ExtraLargeLoadingButton>
      </Box>
    </Box>
  );
}

function HowItWorksStep(props: {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
  sx?: SxProps;
}) {
  return (
    <Stack
      width={1}
      direction={{ xs: "column", md: props.reverse ? "row-reverse" : "row" }}
      spacing={{ xs: 2, md: 8 }}
      alignItems="center"
      sx={{ ...props.sx }}
    >
      <Box width={1} flex={1}>
        <Image
          src={props.image}
          alt="How it works, step one"
          width="100"
          height="100"
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </Box>
      <Box flex={1}>
        <Typography
          variant="h6"
          textAlign={{ xs: "center", md: "start" }}
          fontWeight={700}
        >
          {props.title}
        </Typography>
        <Typography
          textAlign={{ xs: "center", md: "start" }}
          color="text.secondary"
          mt={0.5}
        >
          {props.description}
        </Typography>
      </Box>
    </Stack>
  );
}

function Faq(props: { sx?: SxProps }) {
  return (
    <Box sx={{ ...props.sx, maxWidth: 520 }}>
      <Box
        id="faq"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-98px",
          visibility: "hidden",
        }}
      />
      <Typography variant="h4" fontWeight={700} textAlign="center">
        ⁉️ Frequently asked questions
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        or what to do if I'm confused
      </Typography>
      {/* Question */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What do I need to set a goal?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        Crypto wallet and the desire to achieve something important. For the
        beta, you can use{" "}
        <MuiLink href="https://metamask.io/" target="_blank">
          MetaMask
        </MuiLink>{" "}
        wallet and get free tokens for Polygon Mumbai chain on{" "}
        <MuiLink href="https://mumbaifaucet.com/" target="_blank">
          this site
        </MuiLink>
      </Typography>
      {/* Question */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What if I achieved my goal?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        Then you need to post a proof (image, video or any other file), after
        that your stake will be returned and your reputation will be increased
      </Typography>
      {/* Question */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What if I didn't achieve my goal?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        Then your reputation will be decreased and all staked funds will be sent
        to the treasury of space
      </Typography>
      {/* Question */}
      <Box
        id="faq-what-is-reputation"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-62px",
          visibility: "hidden",
        }}
      />
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What is reputation?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={1}>
        It's an indicator of how successful an achiever or inspirational
        motivator you are. Every achieved or failed goal, every motivational
        message will affect your reputation
      </Typography>
      {/* Question */}
      <Box
        id="faq-what-is-treasury"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-62px",
          visibility: "hidden",
        }}
      />
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What is the treasury of space?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        This is a fund, replenished by failed goals and donations, which will be
        used regularly by the space to reward achievers and motivators with a
        good reputation
      </Typography>
      {/* Question */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        Which chains are supported?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        Polygon Mumbai while the application is in beta
      </Typography>
      {/* Question */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        When is the release?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        When all your <MuiLink href="/feedback">feedback</MuiLink> is heard and
        this application becomes the perfect space for our goals
      </Typography>
      {/* Question */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What if I have another question?
      </Typography>
      <Typography textAlign="center" color="text.secondary" mt={0.5}>
        <MuiLink href="/feedback">Ask us</MuiLink>, we'll be glad to help you ❤️
      </Typography>
    </Box>
  );
}
