import * as messages from '@cucumber/messages'
import { HookType } from '@cucumber/messages'

import { AnyBody, IGlobalHook } from './types'

export default class GlobalHook implements IGlobalHook {
  constructor(
    public readonly id: string,
    private readonly type: HookType,
    private readonly sourceReference: messages.SourceReference,
    public readonly body: AnyBody,
    private readonly name?: string
  ) {}

  public toMessage(): messages.Envelope {
    const hook: messages.Hook = {
      id: this.id,
      type: this.type,
      sourceReference: this.sourceReference,
    }

    if (this.name) {
      hook.name = this.name
    }

    return {
      hook,
    }
  }
}
