import type { StandardSchemaV1 } from "@standard-schema/spec"

function getKey(issue: StandardSchemaV1.Issue) {
  if (!issue.path?.length) {
    return undefined
  }
  return issue.path.map((p) => (typeof p === 'object' ? p.key : p)).join('.')
}

export function toInertiaAllErrors(issues: readonly StandardSchemaV1.Issue[]): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  for (const issue of issues) {
    const key = getKey(issue)
    if (key === undefined) {
      continue
    }
    errors[key] ??= []
    errors[key].push(issue.message)
  }
  return errors
}

export function toInertiaErrors(issues: readonly StandardSchemaV1.Issue[]): Record<string, string> {
  return Object.fromEntries(
    Object.entries(toInertiaAllErrors(issues)).map(([k, v]) => [k, v[0]])
  )
}
