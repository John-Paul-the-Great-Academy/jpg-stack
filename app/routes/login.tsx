import { useLoaderData, Outlet } from "@remix-run/react";
import { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import {
  AUTHENTICATE_STRATEGY_EMAIL_FORM,
  AUTHENTICATE_STRATEGY_EMAIL_LINK,
  AUTHENTICATE_STRATEGY_GOOGLE_FACULTY,
  AUTHENTICATE_STRATEGY_GOOGLE_STUDENT,
  authenticator,
} from "~/services/auth.server";
import * as Auth from "~/config/auth.server";
import { getSession } from "~/services/session.server";

export const action: ActionFunction = async ({ request, context }) => {
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

type LoaderData = { isEmailForm: boolean };
export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | undefined> => {
  const isEmailForm =
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_EMAIL_FORM ||
    Auth.config.auth_type === AUTHENTICATE_STRATEGY_EMAIL_LINK;

  return { isEmailForm };
};

export default function LoginRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col justify-center lg:w-[950px] lg:flex-row">
        <div className="text-center md:w-[650px] lg:text-left">
          <div className="flex flex-col place-items-center md:flex-row">
            <img src="/logo.png" className=" h-20 w-20 md:h-40 md:w-40" />
            <div className="flex flex-col">
              <h1 className="mb-5 text-4xl font-bold md:text-5xl">APP_NAME</h1>
              {data.isEmailForm ? (
                <p className="">
                  Welcome! Please login using the email we have on file. If you
                  have any difficulties, please contact Mr. Baker at{" "}
                  <a
                    className="link link-secondary"
                    href="mailto:cbaker@jpgacademy.org?subject=APP_NAME Help"
                  >
                    cbaker@jpgacademy.org
                  </a>
                  .
                </p>
              ) : (
                <p className="">
                  Welcome! Please login using the email we have on file. If you
                  have any difficulties, please contact Mr. Baker at{" "}
                  <a
                    className="link link-secondary"
                    href="mailto:cbaker@jpgacademy.org?subject=APP_NAME Help"
                  >
                    cbaker@jpgacademy.org
                  </a>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
