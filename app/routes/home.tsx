import type { Route } from "./+types/home";
import { ensureAuthenticated } from "~/lib/data-access";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: { request: Request }) {

  const isAuthenticated = await ensureAuthenticated(request)
  
  if (!isAuthenticated) {
    return null
  }
  
  return redirect('/dashboard')
}

export default function Home() {
  return (
    <div className="flex-11">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to DashNet
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Track your financial progress and make informed decisions
          </p>
        </div>
      </section>
    </div>
  )
}
