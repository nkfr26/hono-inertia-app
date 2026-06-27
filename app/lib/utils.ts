import { VisitHelperOptions } from "@inertiajs/core"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import { useDeepCompareEffect, useFirstMountState } from "react-use"

function getKey(issue: StandardSchemaV1.Issue) {
  if (!issue.path?.length) {
    return undefined
  }
  return issue.path.map((p) => (typeof p === 'object' ? p.key : p)).join('.')
}

export function toInertiaAllErrors(
  issues: readonly StandardSchemaV1.Issue[]
): { errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {}
  for (const issue of issues) {
    const key = getKey(issue)
    if (key === undefined) {
      continue
    }
    errors[key] ??= []
    errors[key].push(issue.message)
  }
  return { errors }
}

export function toInertiaErrors(
  issues: readonly StandardSchemaV1.Issue[]
): { errors: Record<string, string> } {
  return {
    errors: Object.fromEntries(
      Object.entries(toInertiaAllErrors(issues).errors).map(([k, v]) => [k, v[0]])
    )
  }
}

export const useUpdateDeepCompareEffect: typeof useDeepCompareEffect = (
  effect, deps
) => {
  const isFirstMount = useFirstMountState()
  useDeepCompareEffect(() => {
    if (!isFirstMount) {
      return effect()
    }
  }, deps)
}

export const visitHelperOptions: VisitHelperOptions = {
  replace: true,
  preserveScroll: true,
  preserveState: true,
}
