import { Box, Fab } from "@mui/material";
import Link from "next/link";

/**
 * Component with a footer.
 */
export default function Footer() {
  return (
    <Box>
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
    </Box>
  );
}
