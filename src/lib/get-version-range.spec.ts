import getVersionRange from "./get-version-range"

it('should return array of version', () => {
  const result = getVersionRange('16.0-16.5')

  expect(result).toStrictEqual([
    '16.0.0',
    '16.1.0',
    '16.2.0',
    '16.3.0',
    '16.4.0',
    '16.5.0',
  ])
})

it('should return version itself if version wasn\'t not a range', () => {
  const result = getVersionRange('16')

  expect(result).toStrictEqual([
    '16.0.0',
  ])
})
