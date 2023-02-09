import { Box, Fab, SxProps, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { ThickDivider } from "components/styled";
import Link from "next/link";

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
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container sx={{ maxWidth: "md", ...props.sx }}>
      <ThickDivider sx={{ mb: 4 }} />
      <Typography color="text.secondary" variant="body2" textAlign="center">
        Web3 Goals — A social space that motivates to achieve! © 2023
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
