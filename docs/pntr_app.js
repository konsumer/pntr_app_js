import pntr_wasm from './pntr_app_web.mjs'

const AsyncFunction = async function () {}.constructor

// run a JS pntr game, defined in a string
// iface is an object of things you want to be globals in your function
export async function run(code, canvas, iface={}) {
  const m = await pntr_wasm({ canvas })

  class pntr_color {
    constructor(value={}, address){
      this._size = 4
      this._address = this.address || m._malloc(this._size)
      for (const k of Object.keys(value)) {
        this[k] = value[k]
      }
    }

    get r(){
      return m.HEAPU8[this._address]
    }

    get g(){
      return m.HEAPU8[this._address + 1]
    }

    get b(){
      return m.HEAPU8[this._address + 2]
    }

    get a(){
      return m.HEAPU8[this._address + 3]
    }

    get data(){
      return m.HEAPU32[this._address / 4]
    }

    set r(v){
      m.HEAPU8[this._address] = v
    }

    set g(v){
      m.HEAPU8[this._address + 1] = v
    }

    set b(v){
      m.HEAPU8[this._address + 2] = v
    }

    set a(v){
      m.HEAPU8[this._address + 3] = v
    }

    set data(v){
      m.HEAPU32[this._address / 4] = v
    }
  }

  // this will be auto-generated, later
  const pntr = {
    pntr_color,

    pntr_new_color: (r, g, b, a) => new pntr_color({r, g, b, a}),

    pntr_load_font_default: () => {
      const ret = m._malloc(20)
      m.ccall('pntr_load_font_default', 'void', ['number'], [ret])
      return ret
    },

    pntr_clear_background: (dst, color) => m.ccall('pntr_clear_background', 'void', ['number', 'number'], [dst, color._address]),

    pntr_unload_font: (font) => m.ccall('pntr_unload_font', 'void', ['number'], [font]),

    pntr_draw_text: (dst, font, text, posX, posY, color) => m.ccall('pntr_draw_text', 'void', ['number', 'number', 'string', 'number', 'number', 'number'], [dst, font, text, posX, posY, color._address]),

    PNTR_LIGHTGRAY :  new pntr_color({r: 200, g: 200, b: 200, a: 255}),
    PNTR_GRAY      :  new pntr_color({r: 130, g: 130, b: 130, a: 255}),
    PNTR_DARKGRAY  :  new pntr_color({r: 80, g: 80, b:  80, a: 255}),
    PNTR_YELLOW    :  new pntr_color({r: 253, g: 249, b: 0, a: 255}),
    PNTR_GOLD      :  new pntr_color({r: 255, g: 203, b: 0, a: 255}),
    PNTR_ORANGE    :  new pntr_color({r: 255, g: 161, b: 0, a: 255}),
    PNTR_PINK      :  new pntr_color({r: 255, g: 109, b: 194, a: 255}),
    PNTR_RED       :  new pntr_color({r: 230, g: 41, b: 55, a: 255}),
    PNTR_MAROON    :  new pntr_color({r: 190, g: 33, b: 55, a: 255}),
    PNTR_GREEN     :  new pntr_color({r: 0, g: 228, b: 48, a: 255}),
    PNTR_LIME      :  new pntr_color({r: 0, g: 158, b: 47, a: 255}),
    PNTR_DARKGREEN :  new pntr_color({r: 0, g: 117, b: 44, a: 255}),
    PNTR_SKYBLUE   :  new pntr_color({r: 102, g: 191, b: 255, a: 255}),
    PNTR_BLUE      :  new pntr_color({r: 0, g: 121, b: 241, a: 255}),
    PNTR_DARKBLUE  :  new pntr_color({r: 0, g: 82, b: 172, a: 255}),
    PNTR_PURPLE    :  new pntr_color({r: 200, g: 122, b: 255, a: 255}),
    PNTR_VIOLET    :  new pntr_color({r: 135, g: 60, b: 190, a: 255}),
    PNTR_DARKPURPLE:  new pntr_color({r: 112, g: 31, b: 126, a: 255}),
    PNTR_BEIGE     :  new pntr_color({r: 211, g: 176, b: 131, a: 255}),
    PNTR_BROWN     :  new pntr_color({r: 127, g: 106, b: 79, a: 255}),
    PNTR_DARKBROWN :  new pntr_color({r: 76, g: 63, b: 47, a: 255}),
    PNTR_WHITE     :  new pntr_color({r: 255, g: 255, b: 255, a: 255}),
    PNTR_BLACK     :  new pntr_color({r: 0, g: 0, b: 0, a: 255}),
    PNTR_BLANK     :  new pntr_color({r: 0, g: 0, b: 0, a: 0}),
    PNTR_MAGENTA   :  new pntr_color({r: 255, g: 0, b: 255, a: 255}),
    PNTR_RAYWHITE  :  new pntr_color({r: 245, g: 245, b: 245, a: 255})
  }

  const api = {...pntr, ...iface}

  // this makes scoped handles to pntr + iface
  const userCode = `
    const {
      ${Object.keys(api).join(',')}
    } = vars

    ${code}
`
  const f = new AsyncFunction(['vars'], userCode)
  const user = (await f(api)) || {}

  if (user.width) {
    canvas.width = user.width
  }

  if (user.height) {
    canvas.height = user.height
  }

  if (user.init) {
    const r = await user.init()
    if (r === false) {
      throw Error('init() returned false.')
    }
  }

  if (user.update) {
    function wrappedUpdate(t) {
      const r = user.update()
      if (r === false) {
        throw Error('init() returned false.')
      } else {
        requestAnimationFrame(wrappedUpdate)
      }
    }
    requestAnimationFrame(wrappedUpdate)
  }
}


export class PntrApp extends HTMLElement {
  constructor(){
    super()

    const s = this.querySelector('script')
    if (!s) {
      throw new Error('Add a <script type="pntr"> tag to the body of this <pntr-app>.')
    }

    this.userCode = s.innerHTML
    this.shadow = this.attachShadow({mode: 'open'})
    this.shadow.innerHTML = `
      <canvas></canvas>
    `;
  }

  connectedCallback(){
    run(this.userCode, this.shadow.querySelector('canvas'))
  }
}


customElements.define("pntr-app", PntrApp)
