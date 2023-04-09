import { Box, Container, SxProps, Typography } from "@mui/material";
import { random } from "lodash";

/**
 * Component with a specified or random quote.
 */
export default function Quote(props: {
  text?: string;
  author?: string;
  sx?: SxProps;
}) {
  const quotes = [
    {
      text: "Stay focused, go after your dreams and keep moving toward your goals",
      author: "LL Cool J",
    },
    {
      text: "If you're bored with life – you don't get up every morning with a burning desire to do things – you don't have enough goals",
      author: "Lou Holtz",
    },
    {
      text: "If you don't know where you are going, you will probably end up somewhere else",
      author: "Lawrence J. Peter",
    },
    {
      text: "Reach high, for stars lie hidden in you. Dream deep, for every dream precedes the goal",
      author: "Rabindranath Tagore",
    },
    {
      text: "If a man knows not to which port he sails, no wind is favorable",
      author: "Seneca the Younger",
    },
  ];
  const randomQuote = quotes[random(quotes.length - 1)];

  return (
    <Box
      width={1}
      py={{ xs: 6, md: 8 }}
      sx={{ backgroundColor: "purpleDark", ...props.sx }}
    >
      <Container maxWidth="md" sx={{ color: "white", textAlign: "center" }}>
        <Typography variant="h4">💬</Typography>
        <Typography variant="h4" fontWeight={700} mt={4}>
          “{props.text || randomQuote.text}“
        </Typography>
        <Typography fontWeight={700} mt={4}>
          — {props.author || randomQuote.author}
        </Typography>
      </Container>
    </Box>
  );
}
