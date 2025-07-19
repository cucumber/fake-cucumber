import StackUtils from 'stack-utils'

export type MakeErrorMessage = (
  error: Error,
  sourceFrames: readonly string[]
) => {
  message: string
  stackTrace: string
  concatenated: string
}

export function withFullStackTrace(): MakeErrorMessage {
  const stack = new StackUtils({
    cwd: process.cwd(),
    internals: [
      ...StackUtils.nodeInternals(),
      // Exclude ourself from stack traces in case we're npm link'ed
      /\s*at .*[/]fake-cucumber[/]/,
    ],
  })

  return (error: Error, sourceFrames: string[]) => {
    const trace = stack
      .clean(error.stack)
      .trim()
      .split('\n')
      .concat(sourceFrames)
      .map((frame) => `    at ${frame}`)
      .join('\n')

    return {
      message: error.message,
      stackTrace: trace,
      concatenated: [error.message, trace].join('\n'),
    }
  }
}

export function withSourceFramesOnlyStackTrace(): MakeErrorMessage {
  return (error: Error, sourceFrames: string[]) => {
    return {
      message: error.message,
      stackTrace: sourceFrames.join('\n'),
      concatenated: [error.message, ...sourceFrames].join('\n'),
    }
  }
}
