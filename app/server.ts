import { Hono } from 'hono'
import { inertia } from '@hono/inertia'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { rootView } from '@/root-view'
import { createUser, findUser, listUsers } from '@/data'
import type { StandardSchemaV1 } from '@standard-schema/spec'

const userInput = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional().default('')
})

export type UserInput = z.infer<typeof userInput>

const app = new Hono()

app.use(inertia({ rootView }))

function toInertiaErrors(error: StandardSchemaV1.FailureResult) {
  return error.issues.reduce<Record<string, string>>((inertiaErrors, issue) => {
    const key = issue.path?.join(".")
    if (key && !inertiaErrors[key]) {
      inertiaErrors[key] = issue.message
    }
    return inertiaErrors
  }, {})
}

const routes = app
  .get('/', (c) => c.render('Home', { message: 'Hono x Inertia' }))
  .get('/users', (c) => c.render('Users/Index', { users: listUsers() }))
  .get('/users/new', (c) => c.render('Users/New'))
  .get('/users/:id{[0-9]+}', (c) => {
    const id = Number(c.req.param('id'))
    const user = findUser(id)
    if (!user) return c.notFound()
    return c.render('Users/Show', { user })
  })
  .post(
    '/users',
    zValidator('json', userInput, (result, c) => {
      if (!result.success) {
        return c.render('Users/New', { errors: toInertiaErrors(result.error) })
      }
    }),
    (c) => {
      const input = c.req.valid('json')
      const user = createUser(input)
      return c.redirect(`/users/${user.id}`, 303)
    }
  )

export default routes
