import { satisfies } from "semver";

/**
 * Checks whether the browser version matches the feature version
 * @param browserVersion browser version from browserlist
 * @param featureVersion browser version from feature polyfill.io
 */
export default function isVersionMatch(browserVersion: string, featureVersion: string): boolean {
    if (featureVersion === '*')
        return true

    if (browserVersion === 'all')
        return true

    return satisfies(browserVersion, featureVersion, {loose: true})
}
