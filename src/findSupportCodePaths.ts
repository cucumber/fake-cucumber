import fs from 'fs'
import { glob } from 'glob'
import p from 'path'

const codeFileExts = ['.js', '.ts']

function globCode(dir: string) {
  return glob(`${dir}/**/*.{js,ts}`, { posix: true, dotRelative: true })
}

export default async function findSupportCodePaths(
  paths: readonly string[]
): Promise<string[]> {
  const files = new Set<string>()
  for (const path of paths) {
    const stats = fs.lstatSync(path)
    if (stats.isDirectory()) {
      const codePaths = await globCode(path)
      for (const codePath of codePaths) {
        files.add(p.resolve(codePath))
      }
    } else if (stats.isFile()) {
      const ext = p.extname(path)
      if (codeFileExts.indexOf(ext) > -1) {
        files.add(p.resolve(path))
      } else {
        const dir = p.dirname(path)
        const codePaths = await globCode(dir)
        for (const codePath of codePaths) {
          files.add(p.resolve(codePath))
        }
      }
    } else {
      throw new Error(
        `Can't load ${path} - it is not a regular file or directory`
      )
    }
  }
  return Array.from(files).sort()
}
