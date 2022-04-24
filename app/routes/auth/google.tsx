import {
  LoaderFunction,
  ActionFunction,
  json,
} from "@remix-run/server-runtime";
import * as React from "react";
import * as Auth from "~/config/auth.server";
import {
  AUTHENTICATE_STRATEGY_GOOGLE_FACULTY,
  AUTHENTICATE_STRATEGY_GOOGLE_STUDENT,
  AUTHENTICATE_STRATEGY_GOOGLE_ADMIN,
  authenticator,
} from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  if (
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_GOOGLE_FACULTY ||
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_GOOGLE_STUDENT ||
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_GOOGLE_ADMIN
  ) {
    return authenticator.authenticate(Auth.config.auth_type, request);
  } else {
    return badRequest({ message: "Incorrect authentication strategy." });
  }
};

type ActionData = { message: string };

const badRequest = (data: ActionData) => json(data, { status: 400 });
export let action: ActionFunction = async ({ request }) => {
  if (
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_GOOGLE_FACULTY ||
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_GOOGLE_STUDENT
  ) {
    const user = authenticator.authenticate(Auth.config.auth_type, request);

    return user;
  } else {
    return badRequest({ message: "Incorrect authentication strategy." });
  }
};

// export default function Route() {
//   return (
//     <div>
//       <Outlet />
//     </div>
//   );
// }

// export function CatchBoundary() {
//   let caught = useCatch();

//   switch (caught.status) {
//     case 401:
//     case 404:
//       React.useEffect(() => {
//         // get the URL parameters which will include the auth token
//         if (window.opener) {
//           window.opener.postMessage(
//             JSON.stringify({
//               message:
//                 "User is not authorized. Please try again with a different account.",
//             })
//           );

//           window.close();
//         }
//       });
//       return <p className="p-6">Please wait...Logging in.</p>;

//     default:
//       throw new Error(
//         `Unexpected caught response with status: ${caught.status}`
//       );
//   }
// }
