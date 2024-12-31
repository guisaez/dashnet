import { ensureAuthenticated } from "~/lib/data-access"
import { redirect } from "react-router"

export async function loader({ request }: { request: Request }) {
  const isAuthenticateed = await ensureAuthenticated(request)
  if (isAuthenticateed) {
    return redirect('/dashboard')
  }
  return null
}