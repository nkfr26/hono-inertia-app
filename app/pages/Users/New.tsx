import { Form, Head, Link } from '@inertiajs/react'
import type { UserInput } from '@/server'

export default function UserNew() {
  return (
    <>
      <Head title="New user" />
      <p>
        <Link href="/users">← Back to users</Link>
      </p>
      <h1>New user</h1>
      <Form<UserInput> action="/users" method="post">
        {({ errors, processing }) => (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" />
              {errors.name && <p>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
              {errors.email && <p>{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea id="bio" name="bio" />
              {errors.bio && <p>{errors.bio}</p>}
            </div>
            <button type="submit" disabled={processing}>
              Create
            </button>
          </>
        )}
      </Form>
    </>
  )
}
