// this will output all the import/export function signatures of wasm file

import { readFile } from 'fs/promises'
import w from 'wabt'

const wabt = await w()

const [,,WASM_FILE] = process.argv

if (!WASM_FILE) {
    console.error(`show_signatures <WASM_FILE>
    Show the function-signatures of WASM exports
`)
    process.exit(1)
}

const wasmBytes = await readFile(WASM_FILE)

const mod = wabt.readWasm(wasmBytes, { readDebugNames: true })
mod.applyNames();

function printFunctionsFromWast (wast) {
  // first find all signatures
  let r = /  \(type \(;([0-9]+);\) \(func(.+)?\)\)/gm
  let m
  const signatures = {}
  while ((m = r.exec(wast)) !== null) {
      if (m.index === r.lastIndex) {
          r.lastIndex++;
      }

      if (m[2]) {
        let params = /\(param (((i32|i64|f32|f64) ?)+)\)/g.exec(m[2])
        let result = /\(result ((i32|i64|f32|f64))\)/g.exec(m[2])

        if (params) {
          params = params[1].split(' ')
        }else {
          params = []
        }

        if (result) {
          result = result[1]
        }

        signatures[ m[1] ] = [params, result]
      } else {
        signatures[ m[1] ] = [[], null]
      }
  }

  console.log('IMPORTS')
  r=/\(import "(.+)" "(.+)" \(func \$(.+) \(type ([0-9]+)\)\)\)/gm
  while ((m = r.exec(wast)) !== null) {
    if (m.index === r.lastIndex) {
      r.lastIndex++;
    }
    const s = signatures[ m[4] ]
    console.log(`  ${m[1]}.${m[2]}(${s[0].join(', ')}) => ${s[1]}`)
  }
  
  console.log('EXPORTS')
  r=/\(export "(.+)" \(func \$(.+)\)\)/gm
  while ((m = r.exec(wast)) !== null) {
    if (m.index === r.lastIndex) {
      r.lastIndex++;
    }
    const f = (new RegExp(`func \\$${m[2]} \\(type ([0-9]+)\\)`)).exec(wast)
    const s = signatures[ f[1] ]
    console.log(`  ${m[1]}(${s[0].join(', ')}) => ${s[1]}`)
  }
}

printFunctionsFromWast(mod.toText({}))
