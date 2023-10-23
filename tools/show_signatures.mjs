// this will output all the signatures of wasm file

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
const wast = mod.toText({})

const wm = await WebAssembly.compile(wasmBytes)

// build initial fake imports
const e = WebAssembly.Module.exports(wm)

const stub = {}
for (const i of WebAssembly.Module.imports(wm)) {
    if (i.kind === 'function'){
        stub[i.module] ||= {}
        stub[i.module][i.name] = () => {}
    }
}

const instance = await WebAssembly.instantiate(wm, stub)

for (const f of Object.keys(instance.exports)) {
    if (instance.exports[f].name) {
        const sig = (new RegExp(`  \\(func \\(;${instance.exports[f].name};\\) (.+)`)).exec(wast)
        const info = sig[1].split('(').filter(s => !!s.trim()).map(s => s.replace(')', '') ).reduce((a, c) => {
            let [n,...i] = c.trim().split(' ')
            if (n !== 'param') {
                i = i[0]
            }
            return {...a, [n]: i}
        }, {})
        console.log(`${f}(${(info.param||[]).join(', ')}) => ${info.result || 'void'}`)
    }
}
