import { Link } from 'react-router'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuItem, 
  DropdownMenuContent, 
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { UserIcon, LogOut as LogOutIcon } from "lucide-react"
import type { User } from "~/lib/definitions"
import LogoutRoute from '~/routes/auth/logout'

interface NavbarProps {
  user: User | null
}

export default function Navbar({ user }: NavbarProps) {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-lg font-bold tracking-tight text-primary hover:text-primary-dark transition-colors">
            DashNet
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* User Profile or Auth Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-muted-foreground/20 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.first_name} />
                    <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center space-x-2 hover:bg-muted-foreground/10 rounded-md px-3 py-2 transition-colors">
                    <UserIcon className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center space-x-2 hover:bg-muted-foreground/10 rounded-md px-3 py-2 transition-colors">
                    <LogoutRoute/>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Log in
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register" className="text-sm text-primary hover:text-primary-dark transition-colors">
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
