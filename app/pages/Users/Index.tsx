import { Head, Link, router } from '@inertiajs/react'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { omitBy } from 'es-toolkit'
import { useState } from 'react'
import { useUpdateDeepCompareEffect, visitHelperOptions } from '@/lib/utils'
import type { PageProps } from '@/pages.gen'

export default function UserIndex({ users, filters }: PageProps<'Users/Index'>) {
  const [inputs, setInputs] = useState(filters)
  const [debouncedQ] = useDebouncedValue(inputs.q, { wait: 500 })

  const searchParams = omitBy<typeof filters>({ ...inputs, q: debouncedQ }, (v) => !v)
  useUpdateDeepCompareEffect(() => {
    router.get('/users', searchParams, {
      ...visitHelperOptions, only: ['users', 'filters']
    })
  }, [searchParams])
  return (
    <>
      <Head title="Users" />
      <p>
        <Link href="/users/new">+ New user</Link>
      </p>
      <input
        value={inputs.q}
        onChange={(e) => setInputs((prev) => ({ ...prev, q: e.target.value }))}
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
