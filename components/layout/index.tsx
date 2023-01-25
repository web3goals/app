import { Breakpoint, Container, SxProps, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import Footer from "./Footer";
import Navigation from "./Navigation";

/**
 * Component with layout.
 */
export default function Layout(props: {
  maxWidth?: Breakpoint;
  hideToolbar?: boolean;
  sx?: SxProps;
  children: any;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <Head>
        <title>Web3 Goals - A social space that motivates to achieve!</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navigation />
      <Container
        maxWidth={props.maxWidth || "md"}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100%",
        }}
      >
        {/* Box with content */}
        <Box sx={{ py: 4, ...props.sx }}>
          {!props.hideToolbar && <Toolbar />}
          {props.children}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
