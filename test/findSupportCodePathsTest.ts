import assert from 'assert'
import path from 'path'

import findSupportCodePaths from '../src/findSupportCodePaths'

describe('#findSupportCodePaths', () => {
  it('finds files underneath feature directories', async () => {
    const paths = ['test/support/test.feature', 'test/support/nested']
    const supportCodePaths = await findSupportCodePaths(paths)
    assert.deepStrictEqual(supportCodePaths, [
      path.resolve(__dirname, 'support/nested/js.js'),
      path.resolve(__dirname, 'support/nested/ts.ts'),
    ])
  })

  it("finds files underneath feature file's parent directories using relative paths", async () => {
    const paths = ['test/support/test.feature']
    const supportCodePaths = await findSupportCodePaths(paths)
    assert.deepStrictEqual(supportCodePaths, [
      path.resolve(__dirname, 'support/nested/js.js'),
      path.resolve(__dirname, 'support/nested/ts.ts'),
    ])
  })

  it('finds a single file when specified directly', async () => {
    const paths = ['test/support/nested/js.js']
    const supportCodePaths = await findSupportCodePaths(paths)
    assert.deepStrictEqual(supportCodePaths, [
      path.resolve(__dirname, 'support/nested/js.js'),
    ])
  })
})
