import {
  LoadingButton,
  LoadingButtonProps,
  TimelineDot,
  TimelineDotProps,
} from "@mui/lab";
import {
  Box,
  BoxProps,
  Divider,
  DividerProps,
  Link,
  LinkProps,
  Select,
  SelectProps,
  Skeleton,
  SkeletonProps,
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const ThickDivider = styled(Divider)<DividerProps>(({ theme }) => ({
  width: "100%",
  borderBottomWidth: 5,
}));

export const FullWidthSkeleton = styled(Skeleton)<SkeletonProps>(
  ({ theme }) => ({
    width: "100%",
    height: "64px",
  })
);

export const XxlLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  ({ theme, variant }) => ({
    fontSize: "24px",
    fontWeight: 700,
    borderRadius: "78px",
    padding: "24px 78px",
    ...(variant === "outlined" && {
      border: "5px solid",
      "&:hover": {
        border: "5px solid",
      },
    }),
  })
) as typeof LoadingButton;

export const XlLoadingButton = styled(LoadingButton)<LoadingButtonProps>(
  ({ theme, variant }) => ({
    fontSize: "18px",
    fontWeight: 700,
    borderRadius: "78px",
    padding: "14px 48px",
    ...(variant === "outlined" && {
      border: "4px solid",
      "&:hover": {
        border: "4px solid",
      },
    }),
  })
) as typeof LoadingButton;

export const CentralizedBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "24px",
  marginBottom: "24px",
}));

export const CardBox = styled(Box)<BoxProps>(({ theme }) => ({
  border: "solid",
  borderColor: theme.palette.divider,
  borderWidth: "5px",
  borderRadius: "10px",
  padding: "18px 24px",
}));

export const WidgetBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 32px",
  borderRadius: "12px",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

export const WidgetTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: "#FFFFFF",
  fontSize: "1.8rem",
  fontWeight: 700,
  minWidth: "0px",
  marginRight: "0px",
  marginBottom: "8px",
  [theme.breakpoints.up("md")]: {
    fontSize: "2.125rem",
    minWidth: "180px",
    marginRight: "24px",
    marginBottom: "0px",
  },
}));

export const WidgetLink = styled(Link)<LinkProps>(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "14px 20px",
}));

export const WidgetText = styled(Typography)<TypographyProps>(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "14px 20px",
}));

export const WidgetInputTextField = styled(TextField)<TextFieldProps>(
  ({ theme }) => ({
    width: "120px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "0px",
        borderRadius: "12px",
      },
      "&:hover fieldset": {
        border: "4px solid #000000",
      },
      "&.Mui-focused fieldset": {
        border: "4px solid #000000",
      },
    },
  })
);

export const WidgetInputSelect = styled(Select)<SelectProps>(({ theme }) => ({
  width: "120px",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "4px solid #000000",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "4px solid #000000",
  },
}));

export const WidgetSeparatorText = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontWeight: 700,
    textAlign: "center",
  })
);

export const LandingTimelineDot = styled(TimelineDot)<TimelineDotProps>(
  ({ theme }) => ({
    width: "72px",
    height: "72px",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: "4px",
  })
);
