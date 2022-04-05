import { IdGenerator } from '@cucumber/messages'

import DateClock from './DateClock'
import * as dsl from './dsl'
import {
  MakeErrorMessage,
  withFullStackTrace,
  withSourceFramesOnlyStackTrace,
} from './ErrorMessageGenerator'
import findSupportCodePaths from './findSupportCodePaths'
import IClock from './IClock'
import IncrementClock from './IncrementClock'
import IncrementStopwatch from './IncrementStopwatch'
import IStopwatch from './IStopwatch'
import PerfHooksStopwatch from './PerfHooksStopwatch'
import SupportCode from './SupportCode'

export default async function loadSupportCode(
  predictableIds: boolean,
  requirePaths: readonly string[]
): Promise<SupportCode> {
  const supportCode = makeSupportCode(predictableIds)

  dsl.setSupportCode(supportCode)
  const supportCodePaths = await findSupportCodePaths(requirePaths)
  let tsNodeRegistered = false
  for (const supportCodePath of supportCodePaths) {
    if (supportCodePath.endsWith('.ts') && !tsNodeRegistered) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tsnode = require('ts-node')
      tsnode.register({
        transpileOnly: true,
      })
      tsNodeRegistered = true
    }
    require(supportCodePath)
  }
  return supportCode
}

function makeSupportCode(predictableIds: boolean) {
  let newId: IdGenerator.NewId
  let clock: IClock
  let stopwatch: IStopwatch
  let makeErrorMessage: MakeErrorMessage
  if (predictableIds) {
    newId = IdGenerator.incrementing()
    clock = new IncrementClock()
    stopwatch = new IncrementStopwatch()
    makeErrorMessage = withSourceFramesOnlyStackTrace()
  } else {
    newId = IdGenerator.uuid()
    clock = new DateClock()
    stopwatch = new PerfHooksStopwatch()
    makeErrorMessage = withFullStackTrace()
  }
  return new SupportCode(newId, clock, stopwatch, makeErrorMessage)
}
