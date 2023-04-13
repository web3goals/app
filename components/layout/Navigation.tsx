import { GitHub, MenuRounded, Twitter } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  SxProps,
  Link as MuiLink,
} from "@mui/material";
import { Box } from "@mui/system";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTACTS } from "constants/contacts";
import { Logo } from "graphics";
import Link from "next/link";
import packageJson from "package.json";
import { useState } from "react";
import { chainToSupportedChainConfig } from "utils/chains";
import isDev from "utils/environment";
import { useAccount, useNetwork } from "wagmi";

/**
 * Component with navigation.
 */
export default function Navigation() {
  return (
    <AppBar
      color="inherit"
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <LogoDesktop sx={{ flexGrow: 1 }} />
          <LogoMobile sx={{ flexGrow: 1 }} />
          <NavigationDesktop />
          <NavigationMobile />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function LogoDesktop(props: { sx?: SxProps }) {
  const { chain } = useNetwork();

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Link href="/" passHref legacyBehavior>
        <Box component="a" display="flex">
          <Logo width="153" height="25" />
        </Box>
      </Link>
      <Box display="flex" flexDirection="column" mx={1}>
        <Typography color="text.secondary" variant="caption">
          {packageJson.version}-{isDev() ? "dev" : "beta"}
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {chainToSupportedChainConfig(chain).chain.name}
        </Typography>
      </Box>
    </Box>
  );
}

function LogoMobile(props: { sx?: SxProps }) {
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        flexDirection: "column",
        ...props.sx,
      }}
    >
      <Link href="/" passHref legacyBehavior>
        <Box component="a" display="flex">
          <Logo width="122" height="20" />
        </Box>
      </Link>
      <Typography color="text.secondary" variant="caption">
        {packageJson.version}-{isDev() ? "dev" : "beta"}
      </Typography>
    </Box>
  );
}

function NavigationDesktop(props: { sx?: SxProps }) {
  const { isConnected, address } = useAccount();

  return (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
        alignItems: "center",
        ...props.sx,
      }}
    >
      <Link href="/goals/set" legacyBehavior>
        <Button variant="contained">Achieve Goal</Button>
      </Link>
      {isConnected && (
        <Link href={`/accounts/${address}`} passHref legacyBehavior>
          <MuiLink fontWeight={700} color="inherit" ml={3.5}>
            Account
          </MuiLink>
        </Link>
      )}
      <Link href="/goals" passHref legacyBehavior>
        <MuiLink fontWeight={700} color="inherit" ml={3.5}>
          Explore
        </MuiLink>
      </Link>
      <Link href="/#how-it-works" passHref legacyBehavior>
        <MuiLink fontWeight={700} color="inherit" ml={3.5}>
          How it works
        </MuiLink>
      </Link>
      <Link href="/#faq" passHref legacyBehavior>
        <MuiLink fontWeight={700} color="inherit" ml={3.5}>
          FAQ
        </MuiLink>
      </Link>
      <Link href="/feedback" passHref legacyBehavior>
        <MuiLink fontWeight={700} color="inherit" ml={3.5}>
          Feedback
        </MuiLink>
      </Link>
      <Box ml={3.5}>
        <ConnectButton showBalance={false} accountStatus="full" />
      </Box>
      <IconButton
        component="a"
        target="_blank"
        href={CONTACTS.github}
        sx={{ color: "black", ml: 1.5 }}
      >
        <GitHub />
      </IconButton>
      <IconButton
        component="a"
        target="_blank"
        href={CONTACTS.twitter}
        sx={{ color: "black" }}
      >
        <Twitter />
      </IconButton>
    </Box>
  );
}

function NavigationMobile(props: { sx?: SxProps }) {
  const { isConnected, address } = useAccount();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <Box
      sx={{
        display: { xs: "flex", lg: "none" },
        alignItems: "center",
        ...props.sx,
      }}
    >
      <ConnectButton showBalance={false} accountStatus="address" />
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 1.5 }}
        aria-controls={open ? "mobile-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MenuRounded />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="mobile-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link href="/goals/set" legacyBehavior>
          <MenuItem>
            <Button variant="contained">Achieve Goal</Button>
          </MenuItem>
        </Link>
        {isConnected && (
          <Link href={`/accounts/${address}`} passHref legacyBehavior>
            <MenuItem>Account</MenuItem>
          </Link>
        )}
        <Link href="/goals" passHref legacyBehavior>
          <MenuItem>Explore</MenuItem>
        </Link>
        <Link href="/#how-it-works" passHref legacyBehavior>
          <MenuItem>How it works</MenuItem>
        </Link>
        <Link href="/#faq" passHref legacyBehavior>
          <MenuItem>FAQ</MenuItem>
        </Link>
        <Link href="/feedback" passHref legacyBehavior>
          <MenuItem>Feedback</MenuItem>
        </Link>
        <Divider />
        <MenuItem component="a" target="_blank" href={CONTACTS.github}>
          <ListItemIcon>
            <GitHub fontSize="small" />
          </ListItemIcon>
          GitHub
        </MenuItem>
        <MenuItem component="a" target="_blank" href={CONTACTS.twitter}>
          <ListItemIcon>
            <Twitter fontSize="small" />
          </ListItemIcon>
          Twitter
        </MenuItem>
      </Menu>
    </Box>
  );
}
