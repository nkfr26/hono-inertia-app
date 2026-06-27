import { Hono } from 'hono'
import { inertia } from '@hono/inertia'
import { sValidator } from '@hono/standard-validator'
import * as z from 'zod'
import { rootView } from '@/root-view'
import { createUser, findUser, listUsers, usersFilters } from '@/data'
import { toInertiaErrors } from '@/lib/utils'

const userInput = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional().default('')
})
export type UserInput = z.infer<typeof userInput>

const app = new Hono()
app.use(inertia({ rootView }))

const routes = app
  .get('/', (c) => c.render('Home', { message: 'Hono x Inertia' }))
  .get(
    '/users',
    sValidator('query', usersFilters, (result, c) => {
      if (!result.success) {
        return c.redirect('/users')
      }
    }),
    (c) => {
      const filters = c.req.valid('query')
      return c.render('Users/Index', { users: listUsers(filters), filters })
    }
  )
  .get('/users/new', (c) => c.render('Users/New'))
  .get('/users/:id{[0-9]+}', (c) => {
    const id = Number(c.req.param('id'))
    const user = findUser(id)
    if (!user) return c.notFound()
    return c.render('Users/Show', { user })
  })
  .post(
    '/users',
    sValidator('json', userInput, (result, c) => {
      if (!result.success) {
        return c.render('Users/New', toInertiaErrors(result.error))
      }
    }),
    (c) => {
      const input = c.req.valid('json')
      const user = createUser(input)
      return c.redirect(`/users/${user.id}`, 303)
    }
  )

export default routes
