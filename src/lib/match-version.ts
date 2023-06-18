import { satisfies } from "semver";

/**
 * Check version is match
 * @param browserVersion browser version from browserlist
 * @param featureVersion browser version from feature polyfill.io
 */
export default function isMatchVersion(browserVersion: string, featureVersion: string): boolean {
    if (featureVersion === '*')
        return true

    if (browserVersion === 'all')
        return true

    return satisfies(browserVersion, featureVersion, {loose: true})
}
