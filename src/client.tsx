import { createInertiaApp, type ResolvedComponent } from '@nkfr26/inertia-hono-jsx'
import { hydrateRoot } from 'hono/jsx/dom/client'

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob<{ default: ResolvedComponent }>('../app/pages/**/*.tsx')
    const page = await pages[`../app/pages/${name}.tsx`]()
    return page.default
  },
  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
