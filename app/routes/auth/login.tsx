import type { Route } from "./+types/login";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { Form, Link, useActionData, useNavigation, useSubmit, redirect } from "react-router"
import { type LoginFormState, LoginFormSchema } from "~/lib/definitions"

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData()
  
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }
  
  try {
    const response = await fetch(`${import.meta.env.VITE_NETLY_HOST}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(validatedFields.data)
    })
    
    if (!response.ok) {
      const { message } = await response.json() as { message: string }
      return { message }
    }
  } catch (_error) {
    return {
      message: 'An error has occurred during login. Please try again later!'
    }
  }
  
  return redirect('/dashboard')
}

export default function Login({ actionData }: Route.ComponentProps & {actionData: LoginFormState}) {
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === "submitting"
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <Form method="post" onSubmit={(event) => {
          event.preventDefault()
          submit(event.currentTarget)
        }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isSubmitting ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name="email"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              )}
            </div>
            {actionData?.errors?.email && <div className="text-red-500 text-sm">{actionData.errors.email}</div>}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              {isSubmitting ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name="password"
                  id="password"
                  type="password"
                  required
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {actionData?.message && <div className="text-red-500 text-sm">{actionData.message}</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Form>
      </Card>
    </div>
  )
}

