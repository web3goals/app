import {
  Alert,
  AlertTitle,
  Box,
  Fab,
  Snackbar,
  SxProps,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Container } from "@mui/system";
import { ThickDivider } from "components/styled";
import { CONTACTS } from "constants/contacts";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";

/**
 * Component with a footer.
 */
export default function Footer(props: { sx?: SxProps }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Copyright sx={{ mt: 0, mb: 4 }} />
      <FeedbackPostFab />
      <UnderDevelopmentBanner />
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container sx={{ maxWidth: "md", ...props.sx }}>
      <ThickDivider sx={{ mb: 4 }} />
      <Typography color="text.secondary" variant="body2" textAlign="center">
        Web3 Goals — A social space that motivates to achieve your goals! © 2023
      </Typography>
    </Container>
  );
}

function FeedbackPostFab() {
  return (
    <Link href="/feedback" passHref>
      <Fab
        color="primary"
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          textTransform: "initial",
        }}
      >
        Post Feedback
      </Fab>
    </Link>
  );
}

function UnderDevelopmentBanner() {
  const [cookies, setCookie] = useCookies([
    "web3goals_hide_under_development_banner",
  ]);
  const [open, setOpen] = useState(
    !cookies.web3goals_hide_under_development_banner
  );

  return (
    <Snackbar
      open={open}
      sx={{ bottom: { xs: 90 }, width: { md: 1 / 3 } }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        severity="warning"
        onClose={() => {
          setOpen(false);
          setCookie("web3goals_hide_under_development_banner", true, {
            maxAge: 60 * 60,
            path: "/",
          });
        }}
      >
        <AlertTitle>The app is under development</AlertTitle>
        Follow us on{" "}
        <MuiLink href={CONTACTS.twitter} target="_blank">
          Twitter
        </MuiLink>{" "}
        to find out about the launch of public beta testing and other updates
      </Alert>
    </Snackbar>
  );
}
