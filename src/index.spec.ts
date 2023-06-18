import polyfillist from '.'

describe('polyfillist', () => {
  it('should able to return feature list from browserlist config', async () => {
    const result = await polyfillist()

    expect(Array.isArray(result)).toBe(true)
  })

  it('should able to return feature list from query', async () => {
    const result = await polyfillist('defaults')

    expect(Array.isArray(result)).toBe(true)
  })
})
