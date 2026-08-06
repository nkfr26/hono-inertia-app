import { Head, Link, router } from '@nkfr26/inertia-hono-jsx'
import { useState } from 'hono/jsx'
import { omitDefaults, useDebouncedValue, useUpdateEffect, visitHelperOptions } from '@/lib/utils'
import type { PageProps } from '@/pages.gen'

export default function UserIndex({ users, filters }: PageProps<'Users/Index'>) {
  const [q, setQ] = useState(filters.q)
  const debouncedQ = useDebouncedValue(q, { intervalMs: 500 })

  const inputs = omitDefaults<typeof filters>({ q: debouncedQ }, { q: '' })
  useUpdateEffect(() => {
    router.get('/users', inputs, {
      ...visitHelperOptions, only: ['users', 'filters']
    })
  }, [inputs.q])
  return (
    <>
      <Head title="Users" />
      <p>
        <Link href="/users/new">+ New user</Link>
      </p>
      <input
        value={q}
        onChange={(e) => setQ((e.target as HTMLInputElement).value)}
      />
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.id}`}>{user.name}</Link> &lt;{user.email}&gt;
          </li>
        ))}
      </ul>
    </>
  )
}
