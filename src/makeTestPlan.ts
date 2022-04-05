import { Query as GherkinQuery } from '@cucumber/gherkin-utils'

import makeHookTestStep from './makeHookTestStep'
import makePickleTestStep from './makePickleTestStep'
import SupportCode from './SupportCode'
import TestPlan from './TestPlan'
import { ITestPlan, MakeTestCase, RunOptions } from './types'

export default function makeTestPlan(
  gherkinQuery: GherkinQuery,
  supportCode: SupportCode,
  runOptions: RunOptions,
  makeTestCase: MakeTestCase
): ITestPlan {
  const pickles = gherkinQuery.getPickles()
  const testCases = pickles.map((pickle) =>
    makeTestCase(
      pickle,
      supportCode.stepDefinitions,
      supportCode.beforeHooks,
      supportCode.afterHooks.slice().reverse(),
      gherkinQuery,
      supportCode.newId,
      supportCode.clock,
      supportCode.stopwatch,
      supportCode.makeErrorMessage,
      makePickleTestStep,
      makeHookTestStep
    )
  )

  return new TestPlan(testCases, supportCode, runOptions)
}
