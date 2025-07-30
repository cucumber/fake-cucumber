import { execFile } from 'node:child_process'
import { cp, mkdir, mkdtemp, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

class TestHarness {
  constructor(private readonly tempDir: string) {}

  async copyDir(source: string, target: string) {
    await cp(source, path.join(this.tempDir, target), {
      recursive: true,
    })
  }

  async run(extraArgs: string[]): Promise<readonly [string, string, unknown]> {
    return new Promise((resolve) => {
      execFile(
        'node',
        [
          'node_modules/@cucumber/fake-cucumber/bin/fake-cucumber',
          ...extraArgs,
          '--predictable-ids',
        ],
        {
          cwd: this.tempDir,
        },
        (error, stdout, stderr) => {
          resolve([stdout, stderr, error])
        }
      )
    })
  }
}

export async function makeTestHarness() {
  // create temporary directory
  const tempDir = await mkdtemp(
    path.join(tmpdir(), `fake-cucumber-integration-`)
  )

  // symlink @cucumber/fake-cucumber package into node_modules
  await mkdir(path.join(tempDir, 'features'))
  await mkdir(path.join(tempDir, 'node_modules'))
  await mkdir(path.join(tempDir, 'node_modules', '@cucumber'))
  await symlink(
    process.cwd(),
    path.join(tempDir, 'node_modules', '@cucumber', 'fake-cucumber')
  )

  return new TestHarness(tempDir)
}
