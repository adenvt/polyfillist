import browserslist from 'browserslist'
import polyfill from 'polyfill-library'
import { satisfies, coerce } from 'semver'

function isMatchVersion (browserVersion: string, featureVersion: string): boolean {
  if (browserVersion === featureVersion)
    return true

  if (featureVersion === '*')
    return true

  if (browserVersion === 'all')
    return true

  return satisfies(browserVersion, featureVersion, { loose: true })
}

function getBrowser (browser: string) {
  if (browser === 'samsung')
    return 'samsung_mob'

  if (browser === 'and_chr')
    return 'chrome'

  if (browser === 'and_ff')
    return 'firefox'

  return browser
}

function getVersionRange (range: string) {
  if (!range.includes('-'))
    return [range]

  const [start, end]     = range.split('-')
  const result: string[] = []

  let pointer = coerce(start, { loose: true })

  while (pointer && satisfies(pointer, `<=${end}`, { loose: true })) {
    result.push(pointer.version)

    pointer = pointer.inc('minor')
  }

  return result
}

export interface PolyfillistConfig {
  target?: string | string[],
  exclude?: string[],
}

export async function polyfillist (options: PolyfillistConfig = {}) {
  const browsers  = browserslist(options.target, { mobileToDesktop: true })
  const result    = new Set<string>()
  const polyfills = await polyfill.listAllPolyfills()

  for (const featureName of polyfills) {
    // Skip internal polyfill
    if (featureName.includes('~') || featureName.startsWith('_'))
      continue

    const feature = await polyfill.describePolyfill(featureName)

    if (!feature)
      continue

    for (const browser of browsers) {
      const [browserName, browserVersion] = browser.split(' ')
      const name                          = getBrowser(browserName)

      if (!feature.browsers?.[name])
        continue

      for (const version of getVersionRange(browserVersion)) {
        if (isMatchVersion(version, feature.browsers[name])) {
          const aliases = Array.isArray(feature.aliases)
            ? feature.aliases.slice().sort((a, b) => a.length - b.length)
            : []

          const alias = aliases.find((alias) => result.has(alias))
            ?? aliases.at(0)

          // Use alias if it's shorter
          if (alias && alias.length < featureName.length)
            result.add(alias)
          else
            result.add(featureName)
        }
      }
    }
  }

  return [...result].sort()
}
