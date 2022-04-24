import { useNavigate } from "@remix-run/react";
import * as React from "react";
import AlertError from "~/components/alert/error";

declare global {
  interface Window {
    ENV: any;
  }
}

export default function GoogleLogin() {
  // TODO: implmeent as popup: https://dev.to/dinkydani21/how-we-use-a-popup-for-google-and-outlook-oauth-oci
  let windowObjectReference: Window | null = null;
  let previousUrl: string | null = null;
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const navigate = useNavigate();

  const receiveMessage = (event: any) => {
    // Do we trust the sender of this message? (might be
    // different from what we originally opened, for example).
    if (
      event.origin !== window.ENV.BASE_URL ||
      event.origin !== window.ENV.BASE_URL2 ||
      !event.data
    ) {
      return;
    }

    const data =
      typeof event.data === "string"
        ? JSON.parse(event?.data || {})
        : event.data;
    if (data.user) {
      location.reload();
    }
    if (data.message) {
      setErrorMessage(data.message);
    }
  };

  const openSignInWindow = (url: string, name: string) => {
    // remove any existing event listeners
    setErrorMessage("");
    window.removeEventListener("message", receiveMessage);

    // window features
    const width = 420;
    const height = 600;
    const left = screen.width / 2 - width;
    const top = screen.height / 4 - height / 4;
    const strWindowFeatures = `menubar=no, status=no, location=no, toolbar=no, scrollbars=no, resizable=no, width=${width}, height=${height}, top=${top}, left=${left}`;

    if (windowObjectReference === null || windowObjectReference.closed) {
      /* if the pointer to the window object in memory does not exist
      or if such pointer exists but the window was closed */
      windowObjectReference = window.open(url, name, strWindowFeatures);
    } else if (previousUrl !== url) {
      /* if the resource to load is different,
      then we load it in the already opened secondary window and then
      we bring such window back on top/in front of its parent window. */
      windowObjectReference = window.open(url, name, strWindowFeatures);
      windowObjectReference?.focus();
    } else {
      /* else the window reference must exist and the window
      is not closed; therefore, we can bring it back on top of any other
      window with the focus() method. There would be no need to re-create
      the window or to reload the referenced resource. */
      windowObjectReference.focus();
    }

    // add the listener for receiving a message from the popup
    window.addEventListener("message", (event) => receiveMessage(event), false);
    // assign the previous URL
    previousUrl = url;
  };

  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="card flex-shrink-0 bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex flex-col space-y-4">
            <div className="form-control">
              <button
                value="login"
                onClick={
                  () => navigate("/auth/google")
                  // openSignInWindow(
                  //   "/auth/google",
                  //   "Login with School Google Account"
                  // )
                }
                className="btn btn-primary"
              >
                <img
                  src="google.svg"
                  className="mr-2 inline-block h-6 w-6 stroke-current"
                />{" "}
                Login with Google
              </button>
            </div>
          </div>
        </div>
      </div>
      {errorMessage && <AlertError msg={errorMessage} />}
    </div>
  );
}
