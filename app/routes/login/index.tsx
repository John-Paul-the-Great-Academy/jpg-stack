import Login from "~/components/login";
import {
  AUTHENTICATE_STRATEGY_EMAIL_FORM,
  AUTHENTICATE_STRATEGY_EMAIL_LINK,
  AUTHENTICATE_STRATEGY_GOOGLE_FACULTY,
  AUTHENTICATE_STRATEGY_GOOGLE_STUDENT,
  authenticator,
} from "~/services/auth.server";
import * as Auth from "~/config/auth.server";
import GoogleLogin from "~/components/googleLogin";
import { getSession } from "~/services/session.server";
import { useLoaderData } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";

export const action: ActionFunction = async ({ request }) => {
  switch (Auth.config.auth_type) {
    case AUTHENTICATE_STRATEGY_EMAIL_FORM:
      const authenticated = await authenticator.authenticate(
        Auth.config.auth_type,
        request,
        {
          successRedirect: Auth.config.successRedirect,
          failureRedirect: Auth.config.failureRedirect,
        }
      );

      if (authenticated) {
        return authenticated;
      }

      return { msg: "nope" };

    case AUTHENTICATE_STRATEGY_EMAIL_LINK:
      return await authenticator.authenticate(
        AUTHENTICATE_STRATEGY_EMAIL_LINK,
        request,
        {
          successRedirect: "/login/link",
          // If this is not set, any error will be throw and the ErrorBoundary will be
          // rendered.
          failureRedirect: "/login",
        }
      );

    default:
      throw new Error("Invalid Authentication Type");
  }
};

type LoaderData = { isEmailForm: boolean; error: string };
export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | undefined> => {
  await authenticator.isAuthenticated(request, {
    successRedirect: Auth.config.successRedirect,
  });

  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);

  const isEmailForm =
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_EMAIL_FORM ||
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_EMAIL_LINK;

  return { error: error?.message ? error.message : error, isEmailForm };
};

export default function LoginRoute() {
  const data = useLoaderData<LoaderData>();

  return data.isEmailForm ? (
    <Login error={data.error || undefined} />
  ) : (
    <GoogleLogin />
  );
}
