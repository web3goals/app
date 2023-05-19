import { Box, Fab, SxProps, Typography } from "@mui/material";
import { Container } from "@mui/system";
import Link from "next/link";
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
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container maxWidth="md" sx={{ my: 4, ...props.sx }}>
      <Typography color="text.secondary" variant="body2" textAlign="center">
        Web3 Goals — A social space that helps people and communities to achieve
        their goals! © 2023
      </Typography>
    </Container>
  );
}

function FloatingActionButton() {
  return (
    <Link href="/club">
      <Fab
        color="warning"
        variant="extended"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          textTransform: "initial",
        }}
      >
        🧑‍🚀 Early Adopters Club
      </Fab>
    </Link>
  );
}
