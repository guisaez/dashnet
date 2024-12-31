import { z } from 'zod'

export const SignupFormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long.' })
    .trim(),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email' })
})

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email' }),
  password: z
    .string()
    .trim()
})

export type SignupFormState = {
  errors?: {
    first_name?: string[]
    last_name?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string
} | undefined

export type LoginFormState = {
  errors?: {
    email?: string[]
  },
  message?: string
} | undefined

export type Item = {
  item_id: string
  institution_id: string
  institution_name: string
  accounts: Account[]
}

export type Account = {
  account_id: string
  account_name: string
  account_type: string
  account_subtype: string | null
  mask?: string | null
  balance: Balance
}

export type Balance = {
  current_balance: number | null
  available_balance: number | string
  iso_currency_code: string | null
  balance_limit: number | null
}

export type User = {
  user_id: string,
  first_name: string,
  last_name: string,
  email: string
}

export interface UserItem {
  item_id: string
  institution_id: string
  institution_name: string
  accounts: Account[]
}