import { NewParameterType, SupportCodeFunction } from '@cucumber/core'

import { makeSourceReference } from './makeSourceReference'
import { state } from './state'

interface HookOptions {
  name?: string
  tagExpression?: string
}

export { DataTable } from '@cucumber/core'

export function ParameterType(
  options: Omit<NewParameterType, 'sourceReference'>
) {
  state.coreBuilder.parameterType({
    ...options,
    sourceReference: makeSourceReference(new Error().stack),
  })
}

export function Before(
  arg1: string | HookOptions | SupportCodeFunction,
  arg2: SupportCodeFunction
): void {
  let options: HookOptions = {}
  if (typeof arg1 === 'string') {
    options.tagExpression = arg1
  } else if (typeof arg1 === 'object') {
    options = arg1
  }
  const fn = arg2 ?? (arg1 as SupportCodeFunction)
  state.coreBuilder.beforeHook({
    name: options.name,
    tags: options.tagExpression,
    fn,
    sourceReference: makeSourceReference(new Error().stack),
  })
}

export function After(
  arg1: string | HookOptions | SupportCodeFunction,
  arg2: SupportCodeFunction
): void {
  let options: HookOptions = {}
  if (typeof arg1 === 'string') {
    options.tagExpression = arg1
  } else if (typeof arg1 === 'object') {
    options = arg1
  }
  const fn = arg2 ?? (arg1 as SupportCodeFunction)
  state.coreBuilder.afterHook({
    name: options.name,
    tags: options.tagExpression,
    fn,
    sourceReference: makeSourceReference(new Error().stack),
  })
}

export function Given(pattern: string | RegExp, fn: SupportCodeFunction) {
  state.coreBuilder.step({
    pattern,
    fn,
    sourceReference: makeSourceReference(new Error().stack),
  })
}

export function When(pattern: string | RegExp, fn: SupportCodeFunction) {
  state.coreBuilder.step({
    pattern,
    fn,
    sourceReference: makeSourceReference(new Error().stack),
  })
}

export function Then(pattern: string | RegExp, fn: SupportCodeFunction) {
  state.coreBuilder.step({
    pattern,
    fn,
    sourceReference: makeSourceReference(new Error().stack),
  })
}

export * from './run'
