import pntr_wasm from './pntr_app_js_wasm.mjs'

const AsyncFunction = async function () {}.constructor

// run a JS pntr game, defined in a string
// iface is an object of things you want to be globals in your function
export async function run(code, canvas, iface={}) {
  const m = await pntr_wasm({ canvas })
  const userCode = `
    const {
      pntr_load_font_default,
      pntr_clear_background,
      pntr_unload_font,
      PNTR_RAYWHITE,
      ${Object.keys(iface).join(',')}
    } = vars

    ${code}
`
  const f = new AsyncFunction(['vars'], userCode)

  const user = (await f({
    pntr_load_font_default() {},
    pntr_clear_background() {},
    pntr_unload_font() {},
    PNTR_RAYWHITE: 0
  })) || {}

  console.log(user)

  if (user.width) {
    canvas.width = user.width
  }

  if (user.height) {
    canvas.height = user.height
  }

  if (user.init) {
    await user.init()
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
