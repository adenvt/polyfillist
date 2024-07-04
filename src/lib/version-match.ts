import { coerce, satisfies } from "semver";

/**
 * Checks whether the browser version matches the feature version
 * @param browserVersion browser version from browserlist
 * @param featureVersion browser version from feature https://cdnjs.cloudflare.com/polyfill/
 */
export default function isVersionMatch(browserVersion: string, featureVersion: string): boolean {
    if (featureVersion === '*')
        return true

    if (browserVersion === 'all')
        return true

    const parsedBrowserVersion = coerce(browserVersion, { loose: true })

    if (!parsedBrowserVersion)
        return false

    return satisfies(parsedBrowserVersion, featureVersion, {loose: true})
}
