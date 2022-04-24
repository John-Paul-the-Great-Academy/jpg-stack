import { Form } from "@remix-run/react";
import AlertError from "~/components/alert/error";

export default function Login({ error }: { error: string | undefined }) {
  return (
    <div className="flex w-full max-w-sm flex-col space-y-4">
      <div className="card flex-shrink-0 bg-base-100 shadow-2xl">
        <div className="card-body">
          <Form method="post">
            <div className="flex flex-col space-y-4">
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="text"
                  placeholder="email"
                  className="input input-bordered"
                  name="email"
                  id="email"
                />
              </div>
              <div className="form-control">
                <button value="login" type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
      {error && <AlertError msg={error} />}
    </div>
  );
}
