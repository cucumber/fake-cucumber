import TestCase from './TestCase'
import { MessageNotifier } from './types'
import { IdGenerator, messages } from 'cucumber-messages'
import makeTestCase from './makeTestCase'
import IStepDefinition from './IStepDefinition'
import IHook from './IHook'
import { GherkinQuery } from 'gherkin'
import IClock from './IClock'
import { millisecondsSinceEpochToTimestamp } from 'cucumber-messages/dist/src/TimeConversion'

export default class TestPlan {
  private readonly testCases: TestCase[]

  constructor(
    pickles: messages.IPickle[],
    stepDefinitions: IStepDefinition[],
    beforeHooks: IHook[],
    afterHooks: IHook[],
    gherkinQuery: GherkinQuery,
    private readonly newId: IdGenerator.NewId,
    private readonly clock: IClock
  ) {
    this.testCases = pickles.map(pickle =>
      makeTestCase(
        pickle,
        stepDefinitions,
        beforeHooks,
        afterHooks,
        gherkinQuery,
        newId,
        clock
      )
    )
  }

  public async execute(notifier: MessageNotifier): Promise<void> {
    notifier(
      new messages.Envelope({
        testRunStarted: new messages.TestRunStarted({
          timestamp: millisecondsSinceEpochToTimestamp(this.clock.now()),
        }),
      })
    )
    for (const testCase of this.testCases) {
      notifier(testCase.toMessage())
    }
    for (const testCase of this.testCases) {
      await testCase.execute(notifier, 0, this.newId())
    }
    notifier(
      new messages.Envelope({
        testRunFinished: new messages.TestRunFinished({
          timestamp: millisecondsSinceEpochToTimestamp(this.clock.now()),
        }),
      })
    )
  }
}