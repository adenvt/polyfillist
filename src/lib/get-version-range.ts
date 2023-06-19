import { coerce, satisfies } from "semver";

/**
 * Return array of version range
 * @param range version range
 * @example
 * getVersionRange('14.5-14.7') // ['14.5', '14.6', '14.7']
 */
export default function getVersionRange(range: string): string[] {
    if (!range.includes('-'))
        return [range]

    const [start, end] = range.split('-')
    const result: string[] = []

    let pointer = coerce(start, {loose: true})

    while (pointer && satisfies(pointer, `<=${end}`, {loose: true})) {
        result.push(pointer.version)

        pointer = pointer.inc('minor')
    }

    return result
}
