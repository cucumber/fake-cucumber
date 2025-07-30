import { AttachmentContentEncoding, Envelope } from '@cucumber/messages'
import { Readable } from 'stream'

import { AttachmentOptions, World } from './types'

const LOG_MEDIA_TYPE = 'text/x.cucumber.log+plain'
const LINK_MEDIA_TYPE = 'text/uri-list'

export class WorldImpl implements World {
  public testStepId: string

  constructor(
    private readonly onMessage: (envelope: Envelope) => void,
    private readonly testCaseStartedId: string
  ) {}

  async attach(
    data: Readable | Buffer | string,
    optionsOrMediaType: AttachmentOptions | string
  ): Promise<void> {
    const options =
      typeof optionsOrMediaType === 'string'
        ? { mediaType: optionsOrMediaType }
        : optionsOrMediaType
    let body = '',
      contentEncoding = AttachmentContentEncoding.IDENTITY

    if (typeof data === 'string') {
      body = data
    } else if (Buffer.isBuffer(data)) {
      body = data.toString('base64')
      contentEncoding = AttachmentContentEncoding.BASE64
    } else {
      const chunks = []
      for await (const chunk of data) {
        chunks.push(chunk)
      }
      body = Buffer.concat(chunks).toString('base64')
      contentEncoding = AttachmentContentEncoding.BASE64
    }

    this.onMessage({
      attachment: {
        testCaseStartedId: this.testCaseStartedId,
        testStepId: this.testStepId,
        body,
        contentEncoding,
        mediaType: options.mediaType,
        fileName: options.fileName,
      },
    })
  }

  async log(text: string): Promise<void> {
    await this.attach(text, { mediaType: LOG_MEDIA_TYPE })
  }

  async link(url: string, title?: string): Promise<void> {
    await this.attach(url, { mediaType: LINK_MEDIA_TYPE, fileName: title })
  }
}
