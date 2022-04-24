import { LoaderFunction } from "@remix-run/server-runtime";
import * as React from "react";
import * as Auth from "~/config/auth.server";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  return await authenticator.authenticate(Auth.config.auth_type, request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
  // console.log(user);
  // return json({ user });
};

// export default function Route() {
//   const data = useLoaderData();
//   console.log(data);
//   // React.useEffect(() => {
//   //   // get the URL parameters which will include the auth token
//   //   if (window.opener) {
//   //     if (data) {
//   //       window.opener.postMessage(JSON.stringify(data));
//   //     } else {
//   //       window.opener.postMessage(
//   //         JSON.stringify({ message: "Error logging in. Please try again." })
//   //       );
//   //     }

//   //     window.close();
//   //   }
//   // });

//   return <p className="p-6">Please wait...Logging in.</p>;
// }
