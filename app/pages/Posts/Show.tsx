import type { PageProps } from '../../pages.gen'

export default function Show({ id }: PageProps<'Posts/Show'>) {
  return <article>{id}</article>
}
