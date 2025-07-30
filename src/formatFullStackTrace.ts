import StackUtils from 'stack-utils'

export function formatFullStackTrace(
  error: Error,
  sourceFrame: string
): string {
  const stackUtils = new StackUtils({
    cwd: process.cwd(),
    internals: [...StackUtils.nodeInternals(), /\s*at .*\/fake-cucumber\//],
  })
  return stackUtils
    .clean(error.stack)
    .trim()
    .split('\n')
    .concat(...sourceFrame)
    .map((frame) => `    at ${frame}`)
    .join('\n')
}
