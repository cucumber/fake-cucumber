import {
  CucumberExpression,
  ParameterTypeRegistry,
  RegularExpression,
} from 'cucumber-expressions'
import { IdGenerator } from 'cucumber-messages'
import { AnyBody } from './types'
import ExpressionStepDefinition from './ExpressionStepDefinition'
import IStepDefinition from './IStepDefinition'
import IHook, { HookType } from './IHook'
import Hook from './Hook'

type RegisterStepDefinition = (
  expression: string | RegExp,
  body: AnyBody
) => void

type RegisterHook = (tagExpression: string, body: AnyBody) => void

/**
 * This class provides an API for defining step definitions and hooks.
 */
export default class SupportCode {
  private readonly parameterTypeRegistry = new ParameterTypeRegistry()
  public readonly stepDefinitions: IStepDefinition[] = []
  public readonly hooks: IHook[] = []

  constructor(public newId: IdGenerator.NewId) {}

  private registerStepDefinition(
    expression: string | RegExp,
    body: AnyBody
  ): void {
    const expr =
      typeof expression === 'string'
        ? new CucumberExpression(expression, this.parameterTypeRegistry)
        : new RegularExpression(expression, this.parameterTypeRegistry)
    const stepDefinition = new ExpressionStepDefinition(
      this.newId(),
      expr,
      body
    )
    this.stepDefinitions.push(stepDefinition)
  }

  private registerBeforeHook(tagExpression: string, body: AnyBody) {
    this.hooks.push(
      new Hook(this.newId(), HookType.Before, tagExpression, body)
    )
  }

  private registerAfterHook(tagExpression: string, body: AnyBody) {
    this.hooks.push(new Hook(this.newId(), HookType.After, tagExpression, body))
  }

  public readonly Given = this.registerStepDefinition.bind(
    this
  ) as RegisterStepDefinition
  public readonly When = this.registerStepDefinition.bind(
    this
  ) as RegisterStepDefinition
  public readonly Then = this.registerStepDefinition.bind(
    this
  ) as RegisterStepDefinition
  public readonly Before = this.registerBeforeHook.bind(this) as RegisterHook
  public readonly After = this.registerAfterHook.bind(this) as RegisterHook
}
