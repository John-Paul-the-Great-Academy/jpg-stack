import { AUTHENTICATE_STRATEGY_EMAIL_LINK } from "~/services/auth.server";
import * as Auth from "~/config/auth.server";
import { LoaderFunction, redirect } from "@remix-run/server-runtime";
export const loader: LoaderFunction = () => {
  if (Auth.config.auth_type !== AUTHENTICATE_STRATEGY_EMAIL_LINK) {
    redirect("/login");
  }

  return null;
};

export default function LoginRoute() {
  return (
    <div className="flex w-full min-w-[384px] max-w-sm flex-col space-y-4">
      <div className="card flex-shrink-0 bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="w-80 min-w-[320px]">
            Please check your email for the login link.
          </div>
        </div>
      </div>
    </div>
  );
}
