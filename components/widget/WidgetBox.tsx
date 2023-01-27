import { alpha, Box, SxProps, Typography } from "@mui/material";

/**
 * A component to place data or input into children.
 */
export default function WidgetBox(props: {
  title: string;
  titleSx?: SxProps;
  color?: string;
  colorAlpha?: number;
  sx?: SxProps;
  children: any;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        bgcolor: alpha(props.color || "#000000", props.colorAlpha || 1),
        py: 2,
        px: 4,
        borderRadius: 3,
        ...props.sx,
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
          minWidth: { xs: 0, md: 180 },
          mr: { xs: 0, md: 3 },
          mb: { xs: 1.5, md: 0 },
          ...props.titleSx,
        }}
      >
        {props.title}
      </Typography>
      {/* Children */}
      {props.children}
    </Box>
  );
}
