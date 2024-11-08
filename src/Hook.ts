import * as messages from '@cucumber/messages'
import { HookType } from '@cucumber/messages'
import parseTagExpression from '@cucumber/tag-expressions'

import SupportCodeExecutor from './SupportCodeExecutor'
import { AnyBody, IHook, ISupportCodeExecutor } from './types'

export default class Hook implements IHook {
  constructor(
    public readonly id: string,
    private readonly type: HookType,
    private readonly tagExpression: string | null,
    private readonly sourceReference: messages.SourceReference,
    private readonly body: AnyBody,
    private readonly name?: string
  ) {}

  public match(pickle: messages.Pickle): ISupportCodeExecutor | null {
    const matches = this.tagExpression === null || this.matchesPickle(pickle)

    return matches
      ? new SupportCodeExecutor(this.id, this.body, [], null, null)
      : null
  }

  public toMessage(): messages.Envelope {
    const hook: messages.Hook = {
      id: this.id,
      type: this.type,
      sourceReference: this.sourceReference,
    }

    if (this.name) {
      hook.name = this.name
    }

    if (this.tagExpression) {
      hook.tagExpression = this.tagExpression
    }

    return {
      hook,
    }
  }

  private matchesPickle(pickle: messages.Pickle): boolean {
    const expression = parseTagExpression(this.tagExpression)
    const tagNames = pickle.tags.map((tag) => tag.name)
    return expression.evaluate(tagNames)
  }
}
