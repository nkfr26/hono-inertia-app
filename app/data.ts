import * as z from 'zod'

const user = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  bio: z.string().max(200, 'Bio must be 200 characters or less').optional().default('')
})
export type User = z.infer<typeof user>

const users: User[] = [
  { id: 1, name: 'Yusuke Wada', email: 'yusuke@example.com', bio: 'Hono author.' },
  { id: 2, name: 'Alice', email: 'alice@example.com', bio: 'Frontend engineer.' },
  { id: 3, name: 'Bob', email: 'bob@example.com', bio: 'Backend engineer.' }
]

let nextId = users.length + 1

export const usersFilters = z.object({
  q: z.string().optional().default(''),
})
type UserFilters = z.infer<typeof usersFilters>

export const listUsers = (filters: UserFilters): User[] => {
  const q = filters.q.trim().toLowerCase()
  if (q === '') {
    return users
  }
  return users.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
}

export const findUser = (id: number): User | undefined => users.find((u) => u.id === id)

export const userInput = user.omit({ id: true })
export type UserInput = z.infer<typeof userInput>

export const createUser = (input: UserInput): User => {
  const user: User = { id: nextId++, ...input }
  users.push(user)
  return user
}
