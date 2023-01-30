import { Stack, SxProps, Typography, Link as MuiLink } from "@mui/material";
import { Box } from "@mui/system";
import { ThickDivider } from "components/styled";
import { addressToShortAddress } from "utils/converters";
import { useAccount } from "wagmi";

/**
 * A component with goal wathers.
 */
export default function GoalWatchers(props: {
  id: string;
  authorAddress: string;
  watchers: readonly any[];
  sx?: SxProps;
}) {
  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <ThickDivider sx={{ mb: 4 }} />
      <Typography fontWeight={700} textAlign="center" sx={{ mb: 2 }}>
        👀 watchers
      </Typography>
      {props.watchers.length > 0 ? (
        <Stack spacing={1}>
          {props.watchers.map((watcher, index) => (
            <GoalWatcherCard key={index} address={watcher.accountAddress} />
          ))}
        </Stack>
      ) : (
        <Typography textAlign="center">no one yet</Typography>
      )}
    </Box>
  );
}

function GoalWatcherCard(props: { address: string; sx?: SxProps }) {
  const { address } = useAccount();

  return (
    <Stack
      direction="row"
      justifyContent="center"
      spacing={1}
      sx={{
        border: "solid",
        borderColor: "divider",
        borderWidth: 6,
        borderRadius: 2,
        py: 2,
        px: 4,
        ...props.sx,
      }}
    >
      <MuiLink href={`/accounts/${props.address}`} fontWeight={700}>
        {addressToShortAddress(props.address)}
      </MuiLink>
      {props.address === address && (
        <Typography fontWeight={700}>(you)</Typography>
      )}
    </Stack>
  );
}
