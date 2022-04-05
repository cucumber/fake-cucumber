import * as messages from '@cucumber/messages'

import IStopwatch from '../src/IStopwatch'
import { MakeErrorMessage } from './ErrorMessageGenerator'
import IClock from './IClock'
import PickleTestStep from './PickleTestStep'
import { IStepDefinition, ITestStep } from './types'

export default function makePickleTestStep(
  testStepId: string,
  pickleStep: messages.PickleStep,
  stepDefinitions: readonly IStepDefinition[],
  sourceFrames: readonly string[],
  clock: IClock,
  stopwatch: IStopwatch,
  makeErrorMessage: MakeErrorMessage
): ITestStep {
  const supportCodeExecutors = stepDefinitions
    .map((stepDefinition) => stepDefinition.match(pickleStep))
    .filter((supportCodeExecutor) => supportCodeExecutor !== null)
  return new PickleTestStep(
    testStepId,
    pickleStep.id,
    false,
    supportCodeExecutors,
    sourceFrames,
    clock,
    stopwatch,
    makeErrorMessage
  )
}
