// this will generate the host (only functions) JS from api.json

import api from '../api.json' assert { type: 'json' }

const bloclist = [
  'pntr_app_set_userdata',
  'pntr_app_userdata',
  ''
]

const retMap = t => {
  if (t=== 'const char*' || t === 'char*') {
    return 'string'
  }

  if (t.includes('*')) {
    return 'number'
  }

  if (t === 'int' || t === 'float' || t === 'unsigned int' || t ==='size_t' || t === 'unsigned char' || t ==='const char') {
    return 'number'
  }

  if (t === 'bool') {
    return 'boolean'
  }

  if (t === 'pntr_error' || t==='pntr_vector'||t==='pntr_rectangle' || t==='pntr_app_log_type' || t==='pntr_pixelformat' || t == 'pntr_color' || t ==='pntr_filter' || t === 'pntr_app_gamepad_button' || t === 'pntr_app_mouse_button' || t === 'pntr_app_key' || t === 'pntr_image_type' || t === 'pntr_app_sound_type') {
    return 'number'
  }
  return 'void'
}

const paramMap = retMap

const outputArgVals = args => {
  return '[' + args.map(([name, type]) => {
    if (type === 'pntr_color' || type === 'pntr_vector' || type ==='pntr_rectangle') {
      return `${name}._address`
    }
    return name
  }).join(', ') + ']'
}

const out = []
const emscripten_export_names = ['_user_set_size','_malloc','_free','_main']

for (const { name, returns, args } of api.filter(i => !bloclist.includes(i.name) && !i.name.includes('unsafe'))) {
  emscripten_export_names.push(`_${name}`)
  const arg_names = args.map(a => a[0])

  if (arg_names.includes('...')) {
    // TODO: handle vargs
    console.log(`// VARGS: ${name}(${arg_names.join(', ')})`)
  } else {
    out.push(`${name}: (${arg_names.join(', ')}) => m.ccall('${name}', '${retMap(returns)}', ${JSON.stringify(args.map(a => paramMap(a[1])))}, ${outputArgVals(args)})`)
  }
}

// use this to get EXPORTED_FUNCTIONS
//console.log(emscripten_export_names.join(','))

console.log(out.join(',\n'))
