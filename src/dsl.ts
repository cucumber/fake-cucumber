import * as messages from '@cucumber/messages'
import StackUtils from 'stack-utils'
import { deprecate } from 'util'

import IParameterTypeDefinition from './IParameterTypeDefinition'
import SupportCode from './SupportCode'
import { AnyBody, HookOptions } from './types'

function setSupportCode(supportCode: SupportCode) {
  //@ts-ignore
  global.supportCode = supportCode
}

function defineStepDefinition(expression: string | RegExp, body: AnyBody) {
  //@ts-ignore
  global.supportCode.defineStepDefinition(
    getSourceReference(new Error().stack),
    expression,
    body
  )
}

function defineBeforeHook(
  tagExpressionOrBody: string | HookOptions | AnyBody,
  body?: AnyBody
) {
  //@ts-ignore
  global.supportCode.defineBeforeHook(
    getSourceReference(new Error().stack),
    tagExpressionOrBody,
    body
  )
}

function defineAfterHook(
  tagExpressionOrBody: string | HookOptions | AnyBody,
  body?: AnyBody
) {
  //@ts-ignore
  global.supportCode.defineAfterHook(
    getSourceReference(new Error().stack),
    tagExpressionOrBody,
    body
  )
}

function defineParameterType0(
  parameterTypeDefinition: IParameterTypeDefinition
) {
  //@ts-ignore
  global.supportCode.defineParameterType(parameterTypeDefinition)
}

function getSourceReference(stackTrace: string): messages.SourceReference {
  const stack = new StackUtils({
    cwd: process.cwd(),
    internals: StackUtils.nodeInternals(),
  })
  const trace = stack.clean(stackTrace)
  const callSite = stack.parseLine(trace.split('\n')[1])
  const { file: uri, line } = callSite
  return {
    uri,
    location: {
      line,
    },
  }
}

const Given = defineStepDefinition
const When = defineStepDefinition
const Then = defineStepDefinition

const Before = defineBeforeHook
const After = defineAfterHook
const ParameterType = defineParameterType0
const defineParameterType = deprecate(
  defineParameterType0,
  'Please use ParameterType instead'
)

export {
  After,
  Before,
  defineParameterType,
  Given,
  ParameterType,
  setSupportCode,
  Then,
  When,
}
