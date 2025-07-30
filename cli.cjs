const { parseArgs } = require('node:util')
const { run } = require('./dist')

async function program() {
  const { positionals: paths, values } = parseArgs({
    options: {
      'predictable-ids': {
        type: 'boolean',
      },
      require: {
        type: 'string',
        short: 'r',
      },
      retry: {
        type: 'string',
      },
    },
    allowPositionals: true,
    strict: false,
  })
  const predictableIds = values['predictable-ids']
  const require = values['require']
  const retry = values['retry']

  const requirePaths = require ? require.split(':') : paths
  const allowedRetries = retry ? Number(retry) : 0

  await run({
    paths,
    requirePaths,
    allowedRetries,
    predictableIds,
  })
}

program().catch((err) => {
  console.error(err)
  process.exit(1)
})
