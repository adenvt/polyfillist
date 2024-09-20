import browserslist from 'browserslist'
import polyfill from '@mrhenry/polyfill-library'
import getBrowser from './lib/get-browser.js'
import getVersionRange from './lib/get-version-range.js'
import isVersionMatch from './lib/version-match.js'

/**
 * Return array of features by selection queries
 * @param queries Browser queries
 * @param opts Options
 */
async function polyfillist (...args: Parameters<typeof browserslist>): Promise<string[]> {
  const browsers  = browserslist(...args)
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
          if (isVersionMatch(version, feature.browsers[name])) {
            const aliases = Array.isArray(feature.aliases)
              ? [...feature.aliases].sort((a, b) => a.length - b.length)
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
