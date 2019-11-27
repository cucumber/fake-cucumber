import { messages } from 'cucumber-messages'
import assert from 'assert'
import TestStep from '../src/TestStep'
import TestCase from '../src/TestCase'
import { MessageNotifier } from '../src/types'

class StubTestStep extends TestStep {
  public constructor(private readonly status: messages.TestResult.Status) {
    super('some-id', [])
  }

  public toMessage(): messages.TestCase.ITestStep {
    return new messages.TestCase.TestStep()
  }

  public execute(
    notifier: MessageNotifier,
    testCaseStartedId: string
  ): messages.TestResult.Status {
    return this.emitTestStepFinished(testCaseStartedId, this.status, notifier)
  }
}

describe('TestCase', () => {
  describe('#execute', () => {
    it('executes all passing steps', () => {
      const emitted: messages.IEnvelope[] = []
      const testSteps: TestStep[] = [
        new StubTestStep(messages.TestResult.Status.PASSED),
        new StubTestStep(messages.TestResult.Status.PASSED),
      ]
      const testCase = new TestCase(testSteps, 'some-pickle-id')
      testCase.execute(
        (message: messages.IEnvelope) => emitted.push(message),
        0
      )
      const testStepStatuses = emitted
        .filter(m => m.testStepFinished)
        .map(m => m.testStepFinished.testResult.status)
      assert.deepStrictEqual(testStepStatuses, [
        messages.TestResult.Status.PASSED,
        messages.TestResult.Status.PASSED,
      ])
    })

    it('skips steps after a failed step', () => {
      const emitted: messages.IEnvelope[] = []
      const testSteps: TestStep[] = [
        new StubTestStep(messages.TestResult.Status.FAILED),
        new StubTestStep(messages.TestResult.Status.PASSED),
      ]
      const testCase = new TestCase(testSteps, 'some-pickle-id')
      testCase.execute(
        (message: messages.IEnvelope) => emitted.push(message),
        0
      )
      const testStepStatuses = emitted
        .filter(m => m.testStepFinished)
        .map(m => m.testStepFinished.testResult.status)
      assert.deepStrictEqual(testStepStatuses, [
        messages.TestResult.Status.FAILED,
        messages.TestResult.Status.SKIPPED,
      ])
    })

    it('emits TestCaseStarted and TestCaseFinished messages', () => {
      const emitted: messages.IEnvelope[] = []
      const testSteps: TestStep[] = [
        new StubTestStep(messages.TestResult.Status.PASSED),
      ]
      const testCase = new TestCase(testSteps, 'some-pickle-id')
      testCase.execute(
        (message: messages.IEnvelope) => emitted.push(message),
        0
      )

      const testCaseStarted = emitted[0].testCaseStarted
      const testCaseFinished = emitted.find(m => m.testCaseFinished)
        .testCaseFinished

      assert.strictEqual(testCaseStarted.testCaseId, testCase.id)
      assert.strictEqual(testCaseFinished.testCaseStartedId, testCaseStarted.id)
    })

    context(
      'status of TestCaseFinished messages is computed from step statuses',
      () => {
        function getTestStatus(
          testSteps: TestStep[]
        ): messages.TestResult.Status {
          const emitted: messages.IEnvelope[] = []
          const testCase = new TestCase(testSteps, 'some-pickle-id')
          testCase.execute(
            (message: messages.IEnvelope) => emitted.push(message),
            0
          )

          return emitted.find(m => m.testCaseFinished).testCaseFinished
            .testResult.status
        }

        it('emits PASSED when at all steps pass', () => {
          const testStatus = getTestStatus([
            new StubTestStep(messages.TestResult.Status.PASSED),
            new StubTestStep(messages.TestResult.Status.PASSED),
          ])
          assert.strictEqual(testStatus, messages.TestResult.Status.PASSED)
        })

        it('emits FAILED when at least one step is failed', () => {
          const testStatus = getTestStatus([
            new StubTestStep(messages.TestResult.Status.PASSED),
            new StubTestStep(messages.TestResult.Status.FAILED),
            new StubTestStep(messages.TestResult.Status.PENDING),
          ])
          assert.strictEqual(testStatus, messages.TestResult.Status.FAILED)
        })

        it('emits PENDING when there is pending steps', () => {
          const testStatus = getTestStatus([
            new StubTestStep(messages.TestResult.Status.PASSED),
            new StubTestStep(messages.TestResult.Status.PENDING),
          ])
          assert.strictEqual(testStatus, messages.TestResult.Status.PENDING)
        })

        it('emits UNKNOWN when there is no steps', () => {
          const testStatus = getTestStatus([])
          assert.strictEqual(testStatus, messages.TestResult.Status.UNKNOWN)
        })
      }
    )
  })
})
