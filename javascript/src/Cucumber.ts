import { messages } from 'cucumber-messages'
import ExpressionStepDefinition from './ExpressionStepDefinition'
import { MessageNotifier } from './types'
import TestPlan from './TestPlan'
import IStepDefinition from './IStepDefinition'
import { IHook } from './IHook'

export default class Cucumber {
  constructor(
    // * Source (sent through)
    // * GherkinDocument (sent through)
    // * Pickle (used)
    private readonly gherkinMessages: messages.IEnvelope[],
    private readonly stepDefinitions: IStepDefinition[],
    private readonly hooks: IHook[]
  ) {}

  public execute(notifier: MessageNotifier) {
    for (const gherkinMessage of this.gherkinMessages) {
      notifier(gherkinMessage)
    }
    for (const stepDefinition of this.stepDefinitions) {
      notifier(stepDefinition.toMessage())
    }
    for (const hook of this.hooks) {
      notifier(hook.toMessage())
    }
    const pickles = this.gherkinMessages
      .filter(m => m.pickle)
      .map(m => m.pickle)
    const testPlan = new TestPlan(pickles, this.stepDefinitions, this.hooks)
    testPlan.execute(notifier)
  }
}
