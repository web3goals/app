import {
  Container,
  Stack,
  SxProps,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Box } from "@mui/system";
import GoalList from "components/goal/GoalList";
import Layout from "components/layout";
import Quote from "components/layout/Quote";
import { ThickDivider, XxlLoadingButton } from "components/styled";
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
      <HowItWorks sx={{ mt: { xs: 6, md: 12 } }} />
      <Goals sx={{ mt: 8 }} />
      <Faq sx={{ mt: 8, mb: 6 }} />
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
        A <strong>social space</strong> that helps any person or community to{" "}
        <strong>achieve their goals!</strong>
      </Typography>
      <XxlLoadingButton variant="contained" href="/goals/set" sx={{ mt: 4 }}>
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
  );
}

function HowItWorks(props: { sx?: SxProps }) {
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
        Or what to do to become a more successful achiever.
      </Typography>
      <HowItWorksStep
        title="Set a goal with a deadline and stake funds"
        description="You can choose any goal that is very important to you. It can be a task for the week, or a commitment for this year."
        image="/images/how-it-works-1.png"
        sx={{ mt: 6 }}
      />
      <HowItWorksStep
        title="Share with a link"
        description="Tell your friends and followers about the goal. That way, they can become your motivators and send you inspiring messages."
        image="/images/how-it-works-2.png"
        reverse
        sx={{ mt: 6 }}
      />
      <HowItWorksStep
        title="Achieve the goal, attach a proof, and earn a reputation"
        description="Or your staked funds will be shared between motivators, and reputation will be lost."
        image="/images/how-it-works-3.png"
        sx={{ mt: 6 }}
      />
      <XxlLoadingButton variant="contained" href="/goals/set" sx={{ mt: 6 }}>
        Set Goal
      </XxlLoadingButton>
    </Container>
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

function Goals(props: { sx?: SxProps }) {
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
      <ThickDivider />
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        sx={{ mt: 8 }}
      >
        ✨ Space for ambitious goals
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        that inspire us and everyone around us.
      </Typography>
      <GoalList pageSize={3} hideLoadMoreButton sx={{ mt: 4 }} />
      <XxlLoadingButton variant="outlined" href="/goals" sx={{ mt: 4 }}>
        Explore All
      </XxlLoadingButton>
    </Container>
  );
}

function Faq(props: { sx?: SxProps }) {
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
      <Box
        id="faq"
        component="a"
        sx={{
          display: "block",
          position: "relative",
          top: "-32px",
          visibility: "hidden",
        }}
      />
      <ThickDivider />
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        sx={{ mt: 8 }}
      >
        👌 Frequently asked questions
      </Typography>
      <Typography color="text.secondary" textAlign="center" mt={1}>
        or what to do if I'm confused.
      </Typography>
      {/* Question 1 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What do I need to set a goal?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        Crypto wallet and the desire to achieve something important. For the
        beta, you can use{" "}
        <MuiLink href="https://metamask.io/" target="_blank">
          MetaMask
        </MuiLink>{" "}
        wallet and get free tokens for Polygon Mumbai chain on{" "}
        <MuiLink href="https://mumbaifaucet.com/" target="_blank">
          this site
        </MuiLink>
        .
      </Typography>
      {/* Question 2 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What if I achieved my goal?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        Then you need to post a proof (image, video or any other file), after
        that your stake will be returned and your reputation will be increased.
      </Typography>
      {/* Question 3 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What if I didn't achieve my goal?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        Then your reputation will be decreased and all staked tokens will be
        shared between accepted motivators and this application.
      </Typography>
      {/* Question 4 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        Who is an accepted motivator?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        This is a person who sent an inspiring message for you on the goal page,
        and you accepted it.
      </Typography>
      {/* Question 5 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        Which chains are supported?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        Polygon Mumbai while the application is in beta.
      </Typography>
      {/* Question 6 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        When is the release?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        When all your <MuiLink href="/feedback">feedback</MuiLink> is heard and
        this application becomes the perfect space for our goals.
      </Typography>
      {/* Question 7 */}
      <Typography variant="h6" textAlign="center" fontWeight={700} mt={4}>
        What if I have another question?
      </Typography>
      <Typography
        textAlign="center"
        color="text.secondary"
        maxWidth={580}
        mt={0.5}
      >
        <MuiLink href="/feedback">Ask us</MuiLink>, we'll be glad to help you ❤️
      </Typography>
    </Container>
  );
}
