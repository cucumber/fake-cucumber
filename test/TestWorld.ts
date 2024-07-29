import * as messages from '@cucumber/messages'

import { IWorld } from '../src'

export default class TestWorld implements IWorld {
  public testStepId: string
  public readonly attachments: messages.Attachment[] = []

  public attach(data: any, mediaType: string, fileName?: string): void {
    if (typeof data !== 'string') {
      throw new Error('Can only attach strings')
    }
    const attachment: messages.Attachment = {
      body: data,
      mediaType: mediaType ?? 'text/plain',
      contentEncoding: messages.AttachmentContentEncoding.IDENTITY,
      fileName,
    }
    this.attachments.push(attachment)
  }

  public log(text: string): void {
    this.attach(text, 'text/x.cucumber.log+plain')
  }

  public link(text: string): void {
    this.attach(text, 'text/uri-list')
  }
}
