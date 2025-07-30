import {
  AmbiguousError,
  AssembledTestCase,
  AssembledTestPlan,
  AssembledTestStep,
  UndefinedError,
} from '@cucumber/core'
import {
  Envelope,
  IdGenerator,
  SourceReference,
  TestStepResult,
  TestStepResultStatus,
  TimeConversion,
} from '@cucumber/messages'

import { Clock, FormatStackTrace, Stopwatch, TestRun } from './types'
import { WorldImpl } from './WorldImpl'

const NON_SUCCESS_STATUSES = new Set<TestStepResultStatus>([
  TestStepResultStatus.PENDING,
  TestStepResultStatus.UNDEFINED,
  TestStepResultStatus.AMBIGUOUS,
  TestStepResultStatus.FAILED,
])

export class TestRunImpl implements TestRun {
  private readonly statuses = new Set<TestStepResultStatus>()

  constructor(
    private readonly newId: IdGenerator.NewId,
    private readonly clock: Clock,
    private readonly stopwatch: Stopwatch,
    private readonly formatStackTrace: FormatStackTrace,
    private readonly onMessage: (envelope: Envelope) => void,
    private readonly allowedRetries: number,
    private readonly testRunStartedId: string,
    private readonly plans: ReadonlyArray<AssembledTestPlan>
  ) {}

  async execute() {
    this.onMessage({
      testRunStarted: {
        id: this.testRunStartedId,
        timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(
          this.clock.now()
        ),
      },
    })
    this.plans
      .flatMap((plan) => plan.toEnvelopes())
      .forEach((envelope) => this.onMessage(envelope))

    const testCases = this.plans.flatMap((plan) => plan.testCases)
    for (const testCase of testCases) {
      await this.executeTestCase(testCase)
    }

    this.onMessage({
      testRunFinished: {
        testRunStartedId: this.testRunStartedId,
        timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(
          this.clock.now()
        ),
        success: this.statuses.isDisjointFrom(NON_SUCCESS_STATUSES),
      },
    })
  }

  private async executeTestCase(testCase: AssembledTestCase) {
    const allowedAttempts = this.allowedRetries + 1
    let statuses = new Set<TestStepResultStatus>()

    for (let attempt = 1; attempt <= allowedAttempts; attempt++) {
      const testCaseStartedId = this.newId()
      this.onMessage({
        testCaseStarted: {
          id: testCaseStartedId,
          testCaseId: testCase.id,
          timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(
            this.clock.now()
          ),
          // attempt numbers are zero-indexed in messages
          attempt: attempt - 1,
        },
      })

      statuses = await this.executeTestCaseAttempt(testCase, testCaseStartedId)
      const willBeRetried =
        statuses.has(TestStepResultStatus.FAILED) && attempt < allowedAttempts

      this.onMessage({
        testCaseFinished: {
          testCaseStartedId,
          timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(
            this.clock.now()
          ),
          willBeRetried,
        },
      })

      if (!willBeRetried) {
        break
      }
    }

    statuses.forEach((status) => this.statuses.add(status))
  }

  private async executeTestCaseAttempt(
    testCase: AssembledTestCase,
    testCaseStartedId: string
  ) {
    const statuses = new Set<TestStepResultStatus>()
    const world = new WorldImpl(this.onMessage, testCaseStartedId)
    let outcomeKnown = false

    for (const testStep of testCase.testSteps) {
      this.onMessage({
        testStepStarted: {
          testCaseStartedId,
          testStepId: testStep.id,
          timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(
            this.clock.now()
          ),
        },
      })

      world.testStepId = testStep.id
      const testStepResult = await this.executeTestStep(
        testStep,
        world,
        outcomeKnown
      )
      statuses.add(testStepResult.status)
      if (testStepResult.status !== TestStepResultStatus.PASSED) {
        outcomeKnown = true
      }

      this.onMessage({
        testStepFinished: {
          testCaseStartedId,
          testStepId: testStep.id,
          testStepResult,
          timestamp: TimeConversion.millisecondsSinceEpochToTimestamp(
            this.clock.now()
          ),
        },
      })
    }

    return statuses
  }

  private async executeTestStep(
    testStep: AssembledTestStep,
    world: any,
    outcomeKnown: boolean
  ): Promise<TestStepResult> {
    if (outcomeKnown && !testStep.always) {
      return {
        status: TestStepResultStatus.SKIPPED,
        duration: TimeConversion.millisecondsToDuration(0),
      }
    }

    let mostOfResult: Omit<TestStepResult, 'duration'> = {
      status: TestStepResultStatus.PASSED,
    }
    const startTime = this.stopwatch.now()
    try {
      const { fn, args } = testStep.prepare(world)
      const result = await fn(...args)
      if (result === 'pending') {
        mostOfResult = {
          status: TestStepResultStatus.PENDING,
          message: 'TODO',
        }
      } else if (result === 'skipped') {
        mostOfResult = {
          status: TestStepResultStatus.SKIPPED,
        }
      }
    } catch (error: unknown) {
      if (error instanceof AmbiguousError) {
        return {
          status: TestStepResultStatus.AMBIGUOUS,
          duration: TimeConversion.millisecondsToDuration(0),
        }
      } else if (error instanceof UndefinedError) {
        return {
          status: TestStepResultStatus.UNDEFINED,
          duration: TimeConversion.millisecondsToDuration(0),
        }
      }
      mostOfResult = {
        ...this.formatError(error as Error, testStep.sourceReference),
        status: TestStepResultStatus.FAILED,
      }
    }
    const endTime = this.stopwatch.now()
    return {
      ...mostOfResult,
      duration: TimeConversion.millisecondsToDuration(endTime - startTime),
    }
  }

  private formatError(error: Error, sourceReference: SourceReference) {
    const sourceFrame = `${sourceReference.uri}:${sourceReference.location.line}`
    const type = error.name || 'Error'
    const message = error.message
    const stackTrace = this.formatStackTrace(error, sourceFrame)

    return {
      message: message + '\n' + stackTrace,
      exception: {
        type,
        message,
        stackTrace,
      },
    }
  }
}
