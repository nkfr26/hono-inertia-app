import * as z from 'zod'

export type User = {
  id: number
  name: string
  email: string
  bio: string
}

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

export const createUser = (input: Omit<User, 'id'>): User => {
  const user: User = { id: nextId++, ...input }
  users.push(user)
  return user
}
