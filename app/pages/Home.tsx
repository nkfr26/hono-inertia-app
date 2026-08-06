import type { PageProps } from '@hono/inertia'

export default function Home({ message }: PageProps<'Home'>) {
  return <h1>{message}</h1>
}
