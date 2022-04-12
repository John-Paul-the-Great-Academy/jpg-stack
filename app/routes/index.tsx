import { Link } from "@remix-run/react";
import { Button, Hero, Navbar } from "react-daisyui";
import { useOptionalUser } from "~/utils";
const { Start, Center, End } = Navbar;

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <Navbar className="">
        <Start className="mx-2 px-2">
          <span className="text-lg font-bold">daisyUI</span>
        </Start>

        <Center className="mx-2 px-2">
          <div className="flex items-stretch">
            <a className="btn btn-ghost btn-sm rounded-btn">Home</a>
            <a className="btn btn-ghost btn-sm rounded-btn">Portfolio</a>
            <a className="btn btn-ghost btn-sm rounded-btn">About</a>
            <a className="btn btn-ghost btn-sm rounded-btn">Contact</a>
          </div>
        </Center>

        <End className="mx-2 px-2">
          <Button shape="square" color="ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </Button>
          <Button shape="square" color="ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </Button>
        </End>
      </Navbar>

      <main className="relative min-h-screen  sm:flex sm:items-center sm:justify-center">
        {/* <Hero className="">
        <Hero.Overlay className="bg-opacity-60" />
        <Hero.Content className="rounded bg-base-200 p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>{" "}
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.{" "}
            </p>
            <button className="btn btn-primary">Get Started</button>{" "}
          </div>{" "}
        </Hero.Content>{" "}
      </Hero> */}
      </main>
    </>
  );
}
