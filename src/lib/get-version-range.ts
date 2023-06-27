import { coerce, satisfies } from "semver";

/**
 * Return array of version range
 * @param range version range
 * @example
 * getVersionRange('14.5-14.7') // ['14.5.0', '14.6.0', '14.7.0']
 */
export default function getVersionRange(range: string): string[] {
    if (!range.includes('-')) {
        const version = coerce(range, {loose: true})

        return version
            ? [version.version]
            : []
    }

    const [start, end] = range.split('-')
    const result: string[] = []

    let pointer = coerce(start, {loose: true})

    while (pointer && satisfies(pointer, `<=${end}`, {loose: true})) {
        result.push(pointer.version)

        pointer = pointer.inc('minor')
    }

    return result
}
