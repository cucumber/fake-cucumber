import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { makeTestHarness } from '../utils.js'

describe('Acceptance', () => {
  const samples = readdirSync(path.join('test', 'acceptance'), {
    withFileTypes: true,
  })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)

  for (const sample of samples) {
    it(sample, async function () {
      const harness = await makeTestHarness()
      await harness.copyDir(
        path.join(process.cwd(), 'test', 'acceptance', sample),
        'features'
      )
      const extension = sample.includes('markdown') ? '.feature.md' : '.feature'

      const args = [`features/${sample}${extension}`]
      if (
        existsSync(
          path.join(
            path.join(
              process.cwd(),
              'test',
              'acceptance',
              sample,
              sample + '.arguments.txt'
            )
          )
        )
      ) {
        const extraArgs = (
          await readFile(
            path.join(
              process.cwd(),
              'test',
              'acceptance',
              sample,
              sample + '.arguments.txt'
            ),
            { encoding: 'utf-8' }
          )
        )
          .trim()
          .split(' ')
        args.push(...extraArgs)
      }

      const [actualOutput, errorOutput] = await harness.run(args)
      console.error(errorOutput)

      await expect(actualOutput).toMatchFileSnapshot(
        path.join(
          process.cwd(),
          'test',
          'acceptance',
          sample,
          sample + extension + '.ndjson'
        )
      )
    })
  }
})
