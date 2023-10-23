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
  // this is mostly just so I don't have to set it up, may add them later
  // pntr_app
  // pntr_image
  // pntr_font
  // pntr_sound


  // this will be auto-generated, later
  const pntr = {
    pntr_color,

    pntr_new_color: (r, g, b, a) => new pntr_color({r, g, b, a}),

    // pntr_load_font_default() -> i32
    pntr_load_font_default: () => m.ccall('pntr_load_font_default', 'number', [], []),

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

    // pntr_draw_text(i32, i32, i32, i32, i32, i32) -> nil
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
    PNTR_RAYWHITE  :  new pntr_color({r: 245, g: 245, b: 245, a: 255}),

    PNTR_APP_KEY_INVALID:0,
    PNTR_APP_KEY_FIRST:32,
    PNTR_APP_KEY_SPACE:32,
    PNTR_APP_KEY_APOSTROPHE:39,
    PNTR_APP_KEY_COMMA:44,
    PNTR_APP_KEY_MINUS:45,
    PNTR_APP_KEY_PERIOD:46,
    PNTR_APP_KEY_SLASH:47,
    PNTR_APP_KEY_0:48,
    PNTR_APP_KEY_1:49,
    PNTR_APP_KEY_2:50,
    PNTR_APP_KEY_3:51,
    PNTR_APP_KEY_4:52,
    PNTR_APP_KEY_5:53,
    PNTR_APP_KEY_6:54,
    PNTR_APP_KEY_7:55,
    PNTR_APP_KEY_8:56,
    PNTR_APP_KEY_9:57,
    PNTR_APP_KEY_SEMICOLON:59,
    PNTR_APP_KEY_EQUAL:61,
    PNTR_APP_KEY_A:65,
    PNTR_APP_KEY_B:66,
    PNTR_APP_KEY_C:67,
    PNTR_APP_KEY_D:68,
    PNTR_APP_KEY_E:69,
    PNTR_APP_KEY_F:70,
    PNTR_APP_KEY_G:71,
    PNTR_APP_KEY_H:72,
    PNTR_APP_KEY_I:73,
    PNTR_APP_KEY_J:74,
    PNTR_APP_KEY_K:75,
    PNTR_APP_KEY_L:76,
    PNTR_APP_KEY_M:77,
    PNTR_APP_KEY_N:78,
    PNTR_APP_KEY_O:79,
    PNTR_APP_KEY_P:80,
    PNTR_APP_KEY_Q:81,
    PNTR_APP_KEY_R:82,
    PNTR_APP_KEY_S:83,
    PNTR_APP_KEY_T:84,
    PNTR_APP_KEY_U:85,
    PNTR_APP_KEY_V:86,
    PNTR_APP_KEY_W:87,
    PNTR_APP_KEY_X:88,
    PNTR_APP_KEY_Y:89,
    PNTR_APP_KEY_Z:90,
    PNTR_APP_KEY_LEFT_BRACKET:91,
    PNTR_APP_KEY_BACKSLASH:92,
    PNTR_APP_KEY_RIGHT_BRACKET:93,
    PNTR_APP_KEY_GRAVE_ACCENT:96,
    PNTR_APP_KEY_WORLD_1:161,
    PNTR_APP_KEY_WORLD_2:162,
    PNTR_APP_KEY_ESCAPE:256,
    PNTR_APP_KEY_ENTER:257,
    PNTR_APP_KEY_TAB:258,
    PNTR_APP_KEY_BACKSPACE:259,
    PNTR_APP_KEY_INSERT:260,
    PNTR_APP_KEY_DELETE:261,
    PNTR_APP_KEY_RIGHT:262,
    PNTR_APP_KEY_LEFT:263,
    PNTR_APP_KEY_DOWN:264,
    PNTR_APP_KEY_UP:265,
    PNTR_APP_KEY_PAGE_UP:266,
    PNTR_APP_KEY_PAGE_DOWN:267,
    PNTR_APP_KEY_HOME:268,
    PNTR_APP_KEY_END:269,
    PNTR_APP_KEY_CAPS_LOCK:280,
    PNTR_APP_KEY_SCROLL_LOCK:281,
    PNTR_APP_KEY_NUM_LOCK:282,
    PNTR_APP_KEY_PRINT_SCREEN:283,
    PNTR_APP_KEY_PAUSE:284,
    PNTR_APP_KEY_F1:290,
    PNTR_APP_KEY_F2:291,
    PNTR_APP_KEY_F3:292,
    PNTR_APP_KEY_F4:293,
    PNTR_APP_KEY_F5:294,
    PNTR_APP_KEY_F6:295,
    PNTR_APP_KEY_F7:296,
    PNTR_APP_KEY_F8:297,
    PNTR_APP_KEY_F9:298,
    PNTR_APP_KEY_F10:299,
    PNTR_APP_KEY_F11:300,
    PNTR_APP_KEY_F12:301,
    PNTR_APP_KEY_F13:302,
    PNTR_APP_KEY_F14:303,
    PNTR_APP_KEY_F15:304,
    PNTR_APP_KEY_F16:305,
    PNTR_APP_KEY_F17:306,
    PNTR_APP_KEY_F18:307,
    PNTR_APP_KEY_F19:308,
    PNTR_APP_KEY_F20:309,
    PNTR_APP_KEY_F21:310,
    PNTR_APP_KEY_F22:311,
    PNTR_APP_KEY_F23:312,
    PNTR_APP_KEY_F24:313,
    PNTR_APP_KEY_F25:314,
    PNTR_APP_KEY_KP_0:320,
    PNTR_APP_KEY_KP_1:321,
    PNTR_APP_KEY_KP_2:322,
    PNTR_APP_KEY_KP_3:323,
    PNTR_APP_KEY_KP_4:324,
    PNTR_APP_KEY_KP_5:325,
    PNTR_APP_KEY_KP_6:326,
    PNTR_APP_KEY_KP_7:327,
    PNTR_APP_KEY_KP_8:328,
    PNTR_APP_KEY_KP_9:329,
    PNTR_APP_KEY_KP_DECIMAL:330,
    PNTR_APP_KEY_KP_DIVIDE:331,
    PNTR_APP_KEY_KP_MULTIPLY:332,
    PNTR_APP_KEY_KP_SUBTRACT:333,
    PNTR_APP_KEY_KP_ADD:334,
    PNTR_APP_KEY_KP_ENTER:335,
    PNTR_APP_KEY_KP_EQUAL:336,
    PNTR_APP_KEY_LEFT_SHIFT:340,
    PNTR_APP_KEY_LEFT_CONTROL:341,
    PNTR_APP_KEY_LEFT_ALT:342,
    PNTR_APP_KEY_LEFT_SUPER:343,
    PNTR_APP_KEY_RIGHT_SHIFT:344,
    PNTR_APP_KEY_RIGHT_CONTROL:345,
    PNTR_APP_KEY_RIGHT_ALT:346,
    PNTR_APP_KEY_RIGHT_SUPER:347,
    PNTR_APP_KEY_MENU:348,
    PNTR_APP_KEY_LAST:349,

    PNTR_APP_MAX_GAMEPADS:4,

    PNTR_APP_GAMEPAD_BUTTON_UNKNOWN:0,
    PNTR_APP_GAMEPAD_BUTTON_FIRST:1,
    PNTR_APP_GAMEPAD_BUTTON_UP:1,
    PNTR_APP_GAMEPAD_BUTTON_RIGHT:2,
    PNTR_APP_GAMEPAD_BUTTON_DOWN:3,
    PNTR_APP_GAMEPAD_BUTTON_LEFT:4,
    PNTR_APP_GAMEPAD_BUTTON_Y:5,
    PNTR_APP_GAMEPAD_BUTTON_B:6,
    PNTR_APP_GAMEPAD_BUTTON_A:7,
    PNTR_APP_GAMEPAD_BUTTON_X:8,
    PNTR_APP_GAMEPAD_BUTTON_LEFT_SHOULDER:9,
    PNTR_APP_GAMEPAD_BUTTON_LEFT_TRIGGER:10,
    PNTR_APP_GAMEPAD_BUTTON_RIGHT_SHOULDER:11,
    PNTR_APP_GAMEPAD_BUTTON_RIGHT_TRIGGER:12,
    PNTR_APP_GAMEPAD_BUTTON_SELECT:13,
    PNTR_APP_GAMEPAD_BUTTON_MENU:14,
    PNTR_APP_GAMEPAD_BUTTON_START:15,
    PNTR_APP_GAMEPAD_BUTTON_LEFT_THUMB:16,
    PNTR_APP_GAMEPAD_BUTTON_RIGHT_THUMB:17,
    PNTR_APP_GAMEPAD_BUTTON_LAST:18,

    PNTR_APP_MOUSE_BUTTON_UNKNOWN:0,
    PNTR_APP_MOUSE_BUTTON_FIRST:1,
    PNTR_APP_MOUSE_BUTTON_LEFT:1,
    PNTR_APP_MOUSE_BUTTON_RIGHT:2,
    PNTR_APP_MOUSE_BUTTON_MIDDLE:3,
    PNTR_APP_MOUSE_BUTTON_LAST:4,

    PNTR_APP_EVENTTYPE_UNKNOWN:0,
    PNTR_APP_EVENTTYPE_KEY_DOWN:1,
    PNTR_APP_EVENTTYPE_KEY_UP:2,
    PNTR_APP_EVENTTYPE_MOUSE_BUTTON_DOWN:3,
    PNTR_APP_EVENTTYPE_MOUSE_BUTTON_UP:4,
    PNTR_APP_EVENTTYPE_MOUSE_MOVE:5,
    PNTR_APP_EVENTTYPE_MOUSE_WHEEL:6,
    PNTR_APP_EVENTTYPE_GAMEPAD_BUTTON_DOWN:7,
    PNTR_APP_EVENTTYPE_GAMEPAD_BUTTON_UP:8,
    PNTR_APP_EVENTTYPE_FILE_DROPPED:9,

    PNTR_APP_SOUND_TYPE_UNKNOWN:0,
    PNTR_APP_SOUND_TYPE_WAV:1,
    PNTR_APP_SOUND_TYPE_OGG:2,

    PNTR_APP_LOG_DEBUG:0,
    PNTR_APP_LOG_INFO:1,
    PNTR_APP_LOG_WARNING:2,
    PNTR_APP_LOG_ERROR:3
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
  // maybe just allocate a screen and use that in JS, instead of trying to do it all in c/js/c/js with Main()
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
      <style>
      canvas {
        object-fit: contain;
        image-rendering: pixelated;
      }
      </style>
      <canvas></canvas>
    `;
  }

  connectedCallback(){
    run(this.userCode, this.shadow.querySelector('canvas'))
  }
}


customElements.define("pntr-app", PntrApp)
