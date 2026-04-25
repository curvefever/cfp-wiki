import { createFileRoute, redirect } from '@tanstack/react-router'
import { logout } from '../app/logout/Logout'

export const Route = createFileRoute('/logout')({
  preload: false,
  loader: async () => {
    await logout()
    throw redirect({ to: '/' })
  },
})