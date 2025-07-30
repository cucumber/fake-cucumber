import { SourceReference } from '@cucumber/messages'
import StackUtils from 'stack-utils'

export function makeSourceReference(stack: string): SourceReference {
  const stackUtils = new StackUtils({
    cwd: process.cwd(),
    internals: StackUtils.nodeInternals(),
  })
  const trace = stackUtils.clean(stack)
  const { file: uri, line } = stackUtils.parseLine(trace.split('\n')[1])
  return {
    uri,
    location: {
      line,
    },
  }
}
