const typescript = require('@rollup/plugin-typescript')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const { default: dts } = require('rollup-plugin-dts')

module.exports = [
  // Bundle the main library
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      json(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.rollup.json'
      })
    ],
    external: [

    ]
  },
  // Generate TypeScript declarations
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts()
    ]
  }
]