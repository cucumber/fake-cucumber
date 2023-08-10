import { strict as assert } from 'assert'
import { exec } from 'child_process'
import { glob } from 'glob'
import path from 'path'
import util from 'util'

describe('fake-cucumber CLI', () => {
  const run = util.promisify(exec)

  for (const featureFile of glob.sync(`./features/*.feature`)) {
    const featureName = path.basename(featureFile, '.feature')

    it(`can process ${featureName}.feature without error`, async () => {
      try {
        await run(`node dist/src/cli.js features/${featureName}.feature`)
      } catch (error) {
        assert.ifError(error)
      }
    })

    it(`renders ${featureName}.feature execution report to stdout`, async () => {
      const { stdout } = await run(
        `node dist/src/cli.js features/${featureName}.feature`
      )

      assert.ok(stdout)
    })
  }
})
