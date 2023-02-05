import browserslist from 'browserslist'
import polyfill from 'polyfill-library'
import { satisfies, coerce } from 'semver'

/**
 * Check version is match
 * @param browserVersion browser version from browserlist
 * @param featureVersion browser version from feature polyfill.io
 */
function isMatchVersion (browserVersion: string, featureVersion: string): boolean {
  if (featureVersion === '*')
    return true

  if (browserVersion === 'all')
    return true

  return satisfies(browserVersion, featureVersion, { loose: true })
}

/**
 * Map browser from browserlist to polyfill.io
 * @param browser - browser name
 * @returns
 */
function getBrowser (browser: string): string {
  if (browser === 'samsung')
    return 'samsung_mob'

  if (browser === 'and_chr')
    return 'chrome'

  if (browser === 'and_ff')
    return 'firefox'

  return browser
}

/**
 * Return array of version range
 * @param range version range
 * @example
 * getVersionRange('14.5-14.7') // ['14.5', '14.6', '14.7']
 */
function getVersionRange (range: string): string[] {
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

/**
 * Return array of features by selection queries
 * @param queries Browser queries
 * @param opts Options
 */
async function polyfillist (...args: Parameters<typeof browserslist>): Promise<string[]> {
  const browsers  = browserslist.apply(undefined, args)
  const result    = new Set<string>()
  const polyfills = await polyfill.listAllPolyfills()

  for (const featureName of polyfills) {
    // Skip internal polyfill
    if (featureName.includes('~') || featureName.startsWith('_'))
      continue

    const feature = await polyfill.describePolyfill(featureName)

    if (feature) {
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

            // Check if feature already in other bundle
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
  }

  return [...result].sort()
}

export default polyfillist
