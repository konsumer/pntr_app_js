import pntr_wasm from './pntr_app_web.mjs'

const AsyncFunction = async function () {}.constructor

// run a JS pntr game, defined in a string
// iface is an object of things you want to be globals in your function
export async function run(code, canvas, iface={}) {
  const m = await pntr_wasm({ canvas })

  // helper-class that looks like pntr_color, in JS
  class pntr_color {
    constructor(value={}, address){
      this._size = 4
      this._address = address || m._malloc(this._size)
      for (const k of Object.keys(value)) {
        this[k] = value[k]
      }
    }

    get r(){
      return m.HEAPU8[this._address]
    }
    set r(v){
      m.HEAPU8[this._address] = v
    }

    get g(){
      return m.HEAPU8[this._address + 1]
    }
    set g(v){
      m.HEAPU8[this._address + 1] = v
    }

    get b(){
      return m.HEAPU8[this._address + 2]
    }
    set b(v){
      m.HEAPU8[this._address + 2] = v
    }

    get a(){
      return m.HEAPU8[this._address + 3]
    }
    set a(v){
      m.HEAPU8[this._address + 3] = v
    }

    get data(){
      return m.HEAPU32[this._address / 4]
    }
    set data(v){
      m.HEAPU32[this._address / 4] = v
    }
  }

  // read-only helper class for event-callback
  class pntr_app_event {
    constructor(value={}, address){
      this._size = 44
      this._address = address || m._malloc(this._size)
      for (const k of Object.keys(value)) {
        this[k] = value[k]
      }
    }

    get type() {
      return m.HEAPU32[this._address / 4]
    }

    get key() {
      return m.HEAPU32[(this._address + 4) / 4]
    }

    get mouseButton() {
      return m.HEAPU32[(this._address + 4 + 4)/ 4]
    }

    get mouseX() {
      return m.HEAP32[(this._address + 4 + 4 + 4)/ 4]
    }

    get mouseY() {
      return m.HEAP32[(this._address + 4 + 4 + 4 + 4)/ 4]
    }

    get mouseDeltaX() {
      return m.HEAP32[(this._address + 4 + 4 + 4 + 4 + 4)/ 4]
    }

    get mouseDeltaY() {
      return m.HEAP32[(this._address + 4 + 4 + 4 + 4 + 4 + 4)/ 4]
    }

    get mouseWheel() {
      return m.HEAP32[(this._address + 4 + 4 + 4 + 4 + 4 + 4 + 4)/ 4]
    }

    get gamepadButton() {
      return m.HEAP32[(this._address + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4)/ 4]
    }

    get gamepad() {
      return m.HEAP32[(this._address + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4)/ 4]
    }

    get fileDropped() {
      return m.UTF8ToString(this._address + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 4)
    }
  }

  // these are opaque-pointers:
  // pntr_app
  // pntr_image
  // pntr_font
  // pntr_sound


  // this will be auto-generated, later
  const pntr = {
    pntr_color,

    pntr_new_color: (r, g, b, a) => new pntr_color({r, g, b, a}),

    pntr_load_font_default: () => {
      const ret = m._malloc(20)
      m.ccall('pntr_load_font_default', 'void', ['number'], [ret])
      return ret
    },

    pntr_clear_background: (dst, color) => m.ccall(
      'pntr_clear_background',
      'void',
      ['number', 'number'],
      [dst,      color._address]
    ),

    pntr_unload_font: (font) => m.ccall(
      'pntr_unload_font',
      'void',
      ['number'],
      [font]
    ),

    pntr_draw_text: (dst, font, text, posX, posY, color) => m.ccall(
      'pntr_draw_text',
      'void',
      ['number', 'number', 'string', 'number', 'number', 'number'],
      [dst,      font,     text,     posX,     posY,     color._address]
    ),

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

  const api = {...pntr, ...iface, m}

  // this makes scoped handles to pntr + iface
  const userCode = `
    const {
      ${Object.keys(api).join(',')}
    } = vars

    ${code}
`
  const f = new AsyncFunction(['vars'], userCode)

  // TODO: fix pntr to not need global
  window.canvas = canvas

  // this is kind of a lot of rigamarole to set things up.
  // maybe just allocate a screen and use that in JS, instead of trying to do it all in c/js/c/js
  m.pntr_app_event = pntr_app_event
  m.user = (await f(api)) || {}
  m._user_set_size(m.user.width, m.user.height)
  m.callMain()
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
