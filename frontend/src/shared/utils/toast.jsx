import { MaterialDesignContent, SnackbarProvider, useSnackbar } from "notistack";

let useSnackbarRef;
const SnackbarUtilsConfigurator = () => {
  useSnackbarRef = useSnackbar();
  return null;
};

export const ToastProvider = ({ children }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      preventDuplicate
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
      Components={{
        success: MaterialDesignContent,
        error: MaterialDesignContent,
        warning: MaterialDesignContent,
        info: MaterialDesignContent,
      }}
    >
      <SnackbarUtilsConfigurator />
      {children}
    </SnackbarProvider>
  );
};

const toast = {
  success: (msg) => {
    useSnackbarRef?.enqueueSnackbar(msg, { variant: "success" });
  },
  error: (msg) => {
    useSnackbarRef?.enqueueSnackbar(msg, { variant: "error" });
  },
  info: (msg) => {
    useSnackbarRef?.enqueueSnackbar(msg, { variant: "info" });
  },
  warning: (msg) => {
    useSnackbarRef?.enqueueSnackbar(msg, { variant: "warning" });
  },
};

export default toast;
