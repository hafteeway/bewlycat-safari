import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const extension = resolve(root, 'extension-safari')
const project = resolve(process.argv[2] || resolve(root, 'safari-native-macos'))

if (process.platform !== 'darwin')
  throw new Error('Safari packaging requires macOS and Xcode.')
if (!existsSync(resolve(extension, 'manifest.json')))
  throw new Error('Run pnpm build-safari before packaging.')
if (existsSync(project))
  throw new Error('The output directory already exists. Choose a new directory to preserve the existing project.')

const tool = ['safari-web-extension-packager', 'safari-web-extension-converter'].find(name =>
  spawnSync('xcrun', ['--find', name], { stdio: 'ignore' }).status === 0,
)
if (!tool)
  throw new Error('Install Xcode and select it with xcode-select before packaging.')

const result = spawnSync('xcrun', [
  tool,
  extension,
  '--project-location',
  project,
  '--app-name',
  'BewlyCat Safari',
  '--bundle-identifier',
  'local.bewlycat.safari',
  '--macos-only',
  '--swift',
  '--copy-resources',
  '--no-open',
  '--no-prompt',
], { cwd: root, stdio: 'inherit' })
if (result.error)
  throw result.error
process.exitCode = result.status ?? 1
if (result.status === 0) {
  const manifestVersion = JSON.parse(readFileSync(resolve(extension, 'manifest.json'), 'utf8')).version
  // Some Xcode packager versions generate an app identifier inconsistent with
  // --bundle-identifier. Embedded extension IDs must start with the app ID.
  const projectFile = resolve(project, 'BewlyCat Safari/BewlyCat Safari.xcodeproj/project.pbxproj')
  const source = readFileSync(projectFile, 'utf8')
    .replace(/PRODUCT_BUNDLE_IDENTIFIER = [^;\n]+;/g, value =>
      value.includes('.Extension')
        ? 'PRODUCT_BUNDLE_IDENTIFIER = local.bewlycat.safari.Extension;'
        : 'PRODUCT_BUNDLE_IDENTIFIER = local.bewlycat.safari;')
    .replace(/MACOSX_DEPLOYMENT_TARGET = [^;\n]+;/g, 'MACOSX_DEPLOYMENT_TARGET = 13.0;')
    .replace(/CURRENT_PROJECT_VERSION = [^;\n]+;/g, `CURRENT_PROJECT_VERSION = ${manifestVersion};`)
    .replace(/MARKETING_VERSION = [^;\n]+;/g, `MARKETING_VERSION = ${manifestVersion};`)
  writeFileSync(projectFile, source)
}
