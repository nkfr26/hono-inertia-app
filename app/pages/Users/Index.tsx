import { Head, Link, router } from '@inertiajs/react'
import type { VisitHelperOptions } from '@inertiajs/core'
import { useDebouncedValue } from '@tanstack/react-pacer'
import { omitBy } from 'es-toolkit'
import { useState } from 'react'
import { useUpdateDeepCompareEffect } from '@/lib/utils'
import type { PageProps } from '@/pages.gen'

const visitHelperOptions: VisitHelperOptions = {
  replace: true,
  preserveScroll: true,
  preserveState: true,
}

export default function UserIndex({ users, filters }: PageProps<'Users/Index'>) {
  const [inputs, setInputs] = useState(filters)
  const [debouncedQ] = useDebouncedValue(inputs.q, { wait: 500 })

  const searchParams = omitBy({ ...inputs, q: debouncedQ }, (v) => !v)
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
