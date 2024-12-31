import type { Route } from './+types/protected-layout'
import { ensureAuthenticated, getCurrentUser } from "~/lib/data-access"
import { Outlet, redirect } from "react-router"
import type { User } from '~/lib/definitions'
import Navbar from '~/components/navbar'

export async function loader({ request }: { request: Request }) {
  const isAuthenticateed = await ensureAuthenticated(request)

  if (!isAuthenticateed) {
    return redirect('/')
  }
  
  const user = await getCurrentUser(request)
  if(!user) {
    return redirect('/')
  }
  
  return { user: user }
}

export default function ProtectedLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData as { user: User }
  
  return (
    <div>
      <Navbar user={user}/>
      <Outlet />
    </div>
  )
}