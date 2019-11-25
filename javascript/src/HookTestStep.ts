import { messages } from 'cucumber-messages'
import TestStep from './TestStep'

export default class HookTestStep extends TestStep {
  public toMessage(): messages.TestCase.ITestStep {
    return new messages.TestCase.TestStep({
      id: this.id,
      hookId: this.sourceId,
    })
  }
}
