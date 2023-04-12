import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogContent,
  Fab,
  Link as MuiLink,
  Snackbar,
  SxProps,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { LargeLoadingButton } from "components/styled";
import { CONTACTS } from "constants/contacts";
import { DialogContext } from "context/dialog";
import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { Analytics } from "utils/analytics";
import Quote from "./Quote";

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
        ...props.sx,
      }}
    >
      <Quote />
      <Copyright />
      <FloatingActionButton />
      <Banner />
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container maxWidth="md" sx={{ my: 4, ...props.sx }}>
      <Typography color="text.secondary" variant="body2" textAlign="center">
        Web3 Goals — A social space that helps any person or community to
        achieve their goals! © 2023
      </Typography>
    </Container>
  );
}

function FloatingActionButton() {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <Fab
      color="warning"
      variant="extended"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        textTransform: "initial",
      }}
      onClick={() => {
        showDialog?.(<EarlyAdoptersClubDialog onClose={closeDialog} />);
        Analytics.openedEarlyAdoptersClub();
      }}
    >
      🧑‍🚀 Early Adopters Club
    </Fab>
  );
}

function Banner() {
  const [cookies, setCookie] = useCookies(["web3goals_hide_banner"]);
  const [open, setOpen] = useState(!cookies.web3goals_hide_banner);

  return (
    <Snackbar
      open={open}
      sx={{ bottom: { xs: 80 }, width: { md: 1 / 4 } }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        icon={false}
        severity="warning"
        onClose={() => {
          setOpen(false);
          setCookie("web3goals_hide_banner", true, {
            maxAge: 24 * 60 * 60,
            path: "/",
          });
        }}
      >
        <AlertTitle>The app is in beta</AlertTitle>
        Open the early adopters club to learn more 👇
      </Alert>
    </Snackbar>
  );
}

function EarlyAdoptersClubDialog(props: {
  isClose?: boolean;
  onClose?: Function;
}) {
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          my: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          🧑‍🚀 Dear early adopter,
        </Typography>
        <Typography fontWeight={700} mt={2}>
          welcome to the club!
        </Typography>
        <Typography mt={2}>
          Together with you, we will form a community of achievers and
          motivators who create a bright future for themselves and everyone
          around them ✨
        </Typography>
        <Typography mt={2}>
          The first step toward that mission is this app, which is in beta. This
          means you can do whatever you want: set and close goals, post
          messages, become motivators...
        </Typography>
        <Typography mt={2}>
          Just share with us, your opinion on the idea and features of the
          application. Maybe you have questions or ideas for improvement?
        </Typography>
        <Typography mt={2}>
          Any feedback would be appreciated. This will help us make the perfect
          app for public release 🚀
        </Typography>
        <LargeLoadingButton href="/feedback" variant="contained" sx={{ mt: 4 }}>
          Post Feedback
        </LargeLoadingButton>
        <Typography mt={4}>
          Also, so that we do not lose each other in this big world, please
          leave your <MuiLink href="/connection">contacts</MuiLink>. Or follow
          us on{" "}
          <MuiLink href={CONTACTS.twitter} target="_blank">
            Twitter
          </MuiLink>
          .
        </Typography>
        <Typography fontWeight={700} mt={2}>
          Shhh... 🤫 Every person who creates a profile will receive an Early
          Adopter NFT, which will provide some benefits after release.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
