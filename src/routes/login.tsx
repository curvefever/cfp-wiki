import { createFileRoute } from '@tanstack/react-router'
import Login from '../app/login/page'

export const Route = createFileRoute('/login')({
  component: Login,
})