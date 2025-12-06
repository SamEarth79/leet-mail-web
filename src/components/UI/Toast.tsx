import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

interface ToastProps {
    open: boolean;
    handleClose: (
        event: React.SyntheticEvent<any> | Event,
        reason: SnackbarCloseReason
    ) => void;
    message: string;
}

export const Toast = ({ open, handleClose, message }: ToastProps) => (
    <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
    />
);
