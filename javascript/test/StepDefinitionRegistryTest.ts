import assert from 'assert'
import { stubConstructor } from 'ts-sinon'
import { messages } from 'cucumber-messages'

import SupportCodeExecutor from '../src/SupportCodeExecutor'
import StepDefinition from '../src/StepDefinition'
import StepDefinitionRegistry from '../src/StepDefinitionRegistry'

describe('StepDefinitionRegistry', () => {
  context('execute', () => {
    function stubPassingSupportCodeExecutor(): SupportCodeExecutor {
      const supportCodeExecutorStub = stubConstructor<SupportCodeExecutor>(
        SupportCodeExecutor
      )
      supportCodeExecutorStub.execute.returns("ok")

      return supportCodeExecutorStub
    }

    function stubFailingSupportCodeExecutor(message: string): SupportCodeExecutor {
      const supportCodeExecutorStub = stubConstructor<SupportCodeExecutor>(
        SupportCodeExecutor
      )
      supportCodeExecutorStub.execute.throws(new Error(message))

      return supportCodeExecutorStub
    }

    function stubMatchingStepDefinition(
      executor: SupportCodeExecutor = new SupportCodeExecutor(() => null, [])
    ): StepDefinition {
      const stepDefinitionStub = stubConstructor<StepDefinition>(StepDefinition)
      stepDefinitionStub.match.returns(executor)

      return stepDefinitionStub
    }

    it('returns UNDEFINED when there are no matching step definitions', () => {
      const subject = new StepDefinitionRegistry([])
      const status = subject.execute('whatever ...')
      assert.strictEqual(status, messages.TestResult.Status.UNDEFINED)
    })

    it('returns AMBIGUOUS when there are multiple matching step definitions', () => {
      const subject = new StepDefinitionRegistry([
        stubMatchingStepDefinition(),
        stubMatchingStepDefinition(),
      ])
      const status = subject.execute('ambiguous step')
      assert.strictEqual(status, messages.TestResult.Status.AMBIGUOUS)
    })

    context('when there is a matching step definition', () => {
      it('returns PASSED when the match execution raises no exception', () => {
        const subject = new StepDefinitionRegistry([
          stubMatchingStepDefinition(
            stubPassingSupportCodeExecutor()
          ),
        ])
        const status = subject.execute('whatever ...')
        assert.strictEqual(status, messages.TestResult.Status.PASSED)
      })

      it('bubbles up the error when the match execution raises one', () => {
        const subject = new StepDefinitionRegistry([
          stubMatchingStepDefinition(
            stubFailingSupportCodeExecutor("This step has failed")
          ),
        ])
        assert.throws(
          () => subject.execute('whatever ...'),
          {
            message: "This step has failed"
          }
        )
      })
    })
  })
})
