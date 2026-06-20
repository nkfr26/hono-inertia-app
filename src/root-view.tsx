import { renderToString } from 'react-dom/server'
import { Link, Script, ViteClient } from 'vite-ssr-components/react'
import type { RootView } from '@hono/inertia'
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import type { Page } from '@inertiajs/core'

export const rootView: RootView = async (page) => {
  const head = renderToString(
    <>
      <ViteClient />
      <Script src='/src/client.tsx' />
      <Link href='/src/style.css' rel='stylesheet' />
    </>
  )
  const { body } = await createInertiaApp({
    page: page as Page,
    render: renderToString,
    resolve: async (name) => {
      const pages = import.meta.glob<{ default: ResolvedComponent }>('../app/pages/**/*.tsx')
      const page = await pages[`../app/pages/${name}.tsx`]()
      return page.default
    },
    setup: ({ App, props }) => <App {...props} />,
  })
  return `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`
}
