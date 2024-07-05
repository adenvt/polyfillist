#!/usr/bin/env node

/* eslint-disable unicorn/prefer-top-level-await */

import meow from 'meow'
import { EOL } from 'node:os'
import { withQuery } from 'ufo'
import polyfillist from './index.js'

const cli = meow(`
Get list of required https://cdnjs.cloudflare.com/polyfill/ features based on browserslist.

Usage:
  npx polyfillist
  npx polyfillist "QUERIES"
  npx polyfillist --json "QUERIES"
  npx polyfillist --url "QUERIES"
  npx polyfillist --url --host="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.js"
  npx polyfillist --config="path/to/browserlist/file"
  npx polyfillist --env="environment name defined in config"
  npx polyfillist --stats="path/to/browserlist/stats/file"
  npx polyfillist --mobile-to-desktop
  npx polyfillist --ignore-unknown-versions
`,
{
  importMeta: import.meta,
  flags     : {
    json: {
      type      : 'boolean',
      isRequired: false,
    },
    url: {
      type      : 'boolean',
      isRequired: false,
    },
    host: {
      type      : 'string',
      isRequired: false,
      default   : 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js',
    },
    config: {
      type      : 'string',
      isRequired: false,
    },
    env: {
      type      : 'string',
      isRequired: false,
    },
    stats: {
      type      : 'string',
      isRequired: false,
    },
    mobileToDesktop: {
      type      : 'boolean',
      isRequired: false,
    },
    ignoreUnknownVersions: {
      type      : 'boolean',
      isRequired: false,
    },
  },
})

void (async () => {
  try {
    const result = await polyfillist(cli.input[0], cli.flags)

    let output: string

    if (cli.flags.json)
      output = JSON.stringify({ features: result }, undefined, 2)
    else if (cli.flags.url)
      output = withQuery(cli.flags.host, { features: result.join(',') })
    else
      output = result.join(EOL)

    process.stdout.write(output + EOL, 'utf8')
    process.exit(0)
  } catch (error) {
    console.error('polyfillist: %s', (error as Error).message)
    process.exit(1)
  }
})()
