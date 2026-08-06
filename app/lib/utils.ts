import { VisitHelperOptions } from "@inertiajs/core"
import type { StandardSchemaV1 } from "@standard-schema/spec"
import { omitBy } from "es-toolkit"
import { useEffect, useRef, useState } from "hono/jsx"

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

export function useDebouncedValue<T>(latestValue: T, options: { intervalMs: number }): T {
  const [debouncedValue, setDebouncedValue] = useState(latestValue)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(latestValue)
    }, options.intervalMs)

    return () => clearTimeout(timeoutId)
  }, [latestValue, options.intervalMs])

  return debouncedValue
}

export function omitDefaults<T extends Record<string, unknown>>(obj: T, defaults: Partial<T>) {
  return omitBy(obj, (v, k) => v === defaults[k])
}

export function useFirstMountState() {
  const isFirstMount = useRef(true)

  useEffect(() => {
    isFirstMount.current = false
  }, [])

  return isFirstMount.current
}

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState()

  useEffect(() => {
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
