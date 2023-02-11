import { Dialog, DialogContent, Typography } from "@mui/material";
import { XlLoadingButton } from "components/styled";
import { useState } from "react";

/**
 * Dialog to control notifications.
 */
export default function AccountNotificationsDialog(props: {
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
          my: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center">
          🔔 Notifications
        </Typography>
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ px: { xs: 0, md: 12 }, mt: 3 }}
        >
          you can enable or disable the notifications about new watchers of your
          goals on our channel
        </Typography>
        <XlLoadingButton
          href="https://staging.push.org/#/channels?channel=0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1"
          target="_blank"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Open Channel
        </XlLoadingButton>
        <Typography
          fontWeight={700}
          textAlign="center"
          sx={{ px: { xs: 0, md: 12 }, mt: 6 }}
        >
          to receive notifications your should install an browser extension
        </Typography>
        <XlLoadingButton
          href="https://chrome.google.com/webstore/detail/push-staging-protocol-alp/bjiennpmhdcandkpigcploafccldlakj"
          target="_blank"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Install
        </XlLoadingButton>
      </DialogContent>
    </Dialog>
  );
}
