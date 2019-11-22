import TestStep from './TestStep'
import { MessageNotifier } from './types'
import { messages } from 'cucumber-messages'
import uuidv4 from 'uuid/v4'
import TestResult from './TestResult'

export default class TestCase {
  public readonly id: string = uuidv4()

  constructor(
    private readonly testSteps: TestStep[],
    private readonly pickleId: string
  ) {}

  public toMessage(): messages.IEnvelope {
    return new messages.Envelope({
      testCase: new messages.TestCase({
        id: this.id,
        pickleId: this.pickleId,
        testSteps: this.testSteps.map(step => step.toMessage()),
      }),
    })
  }

  public execute(notifier: MessageNotifier, attempt: number) {
    let executeNext = true
    const testCaseStartedId = uuidv4()

    notifier(
      new messages.Envelope({
        testCaseStarted: new messages.TestCaseStarted({
          attempt,
          testCaseId: this.id,
          id: testCaseStartedId,
        }),
      })
    )

    const testStepResults = this.testSteps.map(testStep => {
      if (executeNext) {
        const result = testStep.execute(notifier, testCaseStartedId)
        executeNext = result.status === messages.TestResult.Status.PASSED
        return result
      } else {
        return testStep.skip(notifier, testCaseStartedId)
      }
    })

    notifier(
      new messages.Envelope({
        testCaseFinished: new messages.TestCaseFinished({
          testCaseStartedId,
          testResult: this.computeTestResult(testStepResults).toMessage(),
        }),
      })
    )
  }

  private computeTestResult(testStepResults: TestResult[]): TestResult {
    const testStepStatuses = testStepResults.map(result => result.status)
    const testStatus =
      testStepStatuses.sort()[testStepStatuses.length - 1] ||
      messages.TestResult.Status.UNKNOWN

    return new TestResult(
      testStatus,
      testStatus === messages.TestResult.Status.FAILED
        ? testStepResults.find(
            result => result.status === messages.TestResult.Status.FAILED
          ).message
        : null
    )
  }
}
