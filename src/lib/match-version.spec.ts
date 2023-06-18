import matchVersion from "./match-version";

interface ITestCase {
    browserVersion: string,
    featureVersion: string,
    matches: boolean
}

describe('matchVersion', () => {
    const cases: ITestCase[] = [
        { browserVersion: '14.1', featureVersion: '<15.0', matches: true },
        { browserVersion: '14.1', featureVersion: '>14.1', matches: false },
        { browserVersion: '1.0.1', featureVersion: '1 - 14.1', matches: true }
    ]

    test.concurrent.each(cases)(
        'should match $browserVersion with $featureVersion as $matches',
        ({ browserVersion, featureVersion, matches }) => {
            expect(matchVersion(browserVersion, featureVersion)).toBe(matches)
        }
    )
})
