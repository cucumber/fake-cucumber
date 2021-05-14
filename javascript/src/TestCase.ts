import { EnvelopeListener, ITestCase, ITestStep, IWorld } from './types'
import * as messages from '@cucumber/messages'
import IClock from './IClock'
import { Query } from '@cucumber/query'

const { millisecondsSinceEpochToTimestamp } = messages.TimeConversion

export default class TestCase implements ITestCase {
  constructor(
    public readonly id: string,
    private readonly testSteps: ITestStep[],
    private readonly pickleId: string,
    private readonly clock: IClock
  ) {
    testSteps.forEach((testStep) => {
      if (!testStep) {
        throw new Error('undefined step')
      }
    })
  }

  public toMessage(): messages.Envelope {
    return {
      testCase: {
        id: this.id,
        pickleId: this.pickleId,
        testSteps: this.testSteps.map((step) => step.toMessage()),
      },
    }
  }

  public async execute(
    listener: EnvelopeListener,
    attempt: number,
    testCaseStartedId: string
  ): Promise<messages.TestStepResultStatus> {
    listener({
      testCaseStarted: {
        attempt,
        testCaseId: this.id,
        id: testCaseStartedId,
        timestamp: millisecondsSinceEpochToTimestamp(this.clock.clockNow()),
      },
    })

    const world: IWorld = {
      attach: () => {
        throw new Error('Attach is not ready')
      },
      log: () => {
        throw new Error('Log is not ready')
      },
    }

    let testStepResults: messages.TestStepResult[] = []
    let executeNext = true
    for (const testStep of this.testSteps) {
      let testStepResult: messages.TestStepResult
      // TODO: Also ask testStep if it should always execute (true for After steps)
      if (executeNext || testStep.alwaysExecute) {
        testStepResult = await testStep.execute(world, testCaseStartedId, listener)
        executeNext = testStepResult.status === messages.TestStepResultStatus.PASSED
      } else {
        testStepResult = testStep.skip(listener, testCaseStartedId)
      }
      testStepResults.push(testStepResult)
    }

    listener({
      testCaseFinished: {
        testCaseStartedId: testCaseStartedId,
        timestamp: millisecondsSinceEpochToTimestamp(this.clock.clockNow()),
      },
    })

    const finalStepResult = new Query().getWorstTestStepResult(testStepResults)
    return finalStepResult.status
  }
}
