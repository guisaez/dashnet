import type { Route } from "./+types/signup";
import { SignupFormSchema, type SignupFormState } from "~/lib/definitions"
import { redirect, useSubmit, useNavigation, Form, Link} from "react-router"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData()
  
  const validatedFields = SignupFormSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    password: formData.get('password')
  })
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    }
  }
  
  try {
    const response = await fetch(`${import.meta.env.VITE_NETLY_HOST}/auth/register`, {
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

export default function Signup({ actionData }: Route.ComponentProps & { actionData: SignupFormState}) {
  const navigation = useNavigation()
  const submit = useSubmit()
  const isSubmitting = navigation.state === "submitting"
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <Form method="post" onSubmit={(event) => {
          event.preventDefault()
          submit(event.currentTarget)
        }}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              {isSubmitting? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name="first_name"
                  id="first_name"
                  type="text"
                  placeholder="John"
                  required
                />
              )}
            </div>
            {actionData?.errors?.first_name && <div className="text-red-500 text-sm">{actionData.errors.first_name}</div>}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              {isSubmitting? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name="last_name"
                  id="last_name"
                  type="text"
                  placeholder="Doe"
                  required
                />
              )}
            </div>
            {actionData?.errors?.last_name && <div className="text-red-500 text-sm">{actionData.errors.last_name}</div>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isSubmitting? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name="email"
                  id="email"
                  type="text"
                  placeholder="you@example.com"
                  required
                />
              )}
            </div>
            {actionData?.errors?.email && <div className="text-red-500 text-sm">{actionData.errors.email}</div>}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              {isSubmitting? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  name="password"
                  id="password"
                  type="text"
                  required
                />
              )}
            </div>
            {actionData?.errors?.password && (
              <div>
                <p>Password must:</p>
                <ul>
                  {actionData.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {actionData?.message && <div className="text-red-500 text-sm">{actionData.message}</div>}
            <Button type="submit" className="w-full">Register</Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Form>
      </Card>
    </div>
  )
}