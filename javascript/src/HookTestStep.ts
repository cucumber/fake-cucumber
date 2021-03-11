import * as messages from '@cucumber/messages'
import TestStep from './TestStep'

export default class HookTestStep extends TestStep {
  public toMessage(): messages.TestStep {
    const testStep = new messages.TestCase.TestStep({
      id: this.id,
      hookId: this.sourceId,
    })
    testStep.pickleStepId = undefined
    return testStep
  }
}
