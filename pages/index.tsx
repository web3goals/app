import { Avatar, Link as MuiLink, SxProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Layout from "components/layout";
import {
  CentralizedBox,
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
            sx={{ mt: 4 }}
          >
            A social space that motivates to{" "}
            <Link href="/goals/set" legacyBehavior passHref>
              <MuiLink>achieve</MuiLink>
            </Link>
            !
          </Typography>
        </Box>
        <ThickDivider sx={{ width: 1 / 2, mt: 8 }} />
        {/* How does it work */}
        <Box sx={{ mt: 8, width: 1 }}>
          <Typography variant="h4" fontWeight={700} textAlign="center">
            How does it work?
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 4,
              gridTemplateColumns: "repeat(2, 1fr)",
              mt: 4,
            }}
          >
            <StepCard icon="🏔️" title="1. Set a goal" color="#2B6EFD" />
            <StepCard icon="💰" title="2. Stake a funds" color="#410C92" />
            <StepCard icon="🎯" title="3. Achieve the goal" color="#1DB954" />
            <StepCard
              icon="💸"
              title="4. Or your stake will be shared between watchers"
              color="#FF4400"
            />
          </Box>
        </Box>
        <XxlLoadingButton variant="contained" href="/goals/set" sx={{ mt: 4 }}>
          Set Goal
        </XxlLoadingButton>
      </CentralizedBox>
    </Layout>
  );
}

function StepCard(props: {
  icon: string;
  title: string;
  color?: string;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: props.color || "#000000",
        p: 4,
        borderRadius: 3,
        ...props.sx,
      }}
    >
      <Avatar
        sx={{
          width: 72,
          height: 72,
          borderRadius: 72,
          backgroundColor: "#FFFFFF",
          fontSize: 32,
          mb: 2,
        }}
      >
        {props.icon}
      </Avatar>
      <Typography
        variant="h6"
        fontWeight={700}
        textAlign="center"
        color="#FFFFFF"
        sx={{ maxWidth: 280 }}
      >
        {props.title}
      </Typography>
    </Box>
  );
}
