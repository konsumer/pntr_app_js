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

  class pntr_vector {
    constructor(value={}, address){
      this._size = 8
      this._address = address || m._malloc(this._size)
      for (const k of Object.keys(value)) {
        this[k] = value[k]
      }
    }

    get x(){
      return m.HEAPU32[this._address / 4]
    }
    set x(v){
      m.HEAPU32[this._address / 4] = v
    }

    get y(){
      return m.HEAPU32[(this._address + 4) / 4]
    }
    set y(v){
      m.HEAPU32[(this._address + 4) / 4] = v
    }
  }

  class pntr_rectangle {
    constructor(value={}, address){
      this._size = 16
      this._address = address || m._malloc(this._size)
      for (const k of Object.keys(value)) {
        this[k] = value[k]
      }
    }

    get x(){
      return m.HEAPU32[this._address / 4]
    }
    set x(v){
      m.HEAPU32[this._address / 4] = v
    }

    get y(){
      return m.HEAPU32[(this._address + 4) / 4]
    }
    set y(v){
      m.HEAPU32[(this._address + 4) / 4] = v
    }

    get width(){
      return m.HEAPU32[(this._address + 4 + 4) / 4]
    }
    set width(v){
      m.HEAPU32[(this._address + 4 + 4) / 4] = v
    }

    get height(){
      return m.HEAPU32[(this._address + 4 + 4 + 4) / 4]
    }
    set height(v){
      m.HEAPU32[(this._address + 4 + 4 + 4) / 4] = v
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
    pntr_new_image: (width, height) => m.ccall('pntr_new_image', 'number', ["number","number"], [width, height]),
    pntr_gen_image_color: (width, height, color) => m.ccall('pntr_gen_image_color', 'number', ["number","number","number"], [width, height, color._address]),
    pntr_image_copy: (image) => m.ccall('pntr_image_copy', 'number', ["number"], [image]),
    pntr_image_from_image: (image, x, y, width, height) => m.ccall('pntr_image_from_image', 'number', ["number","number","number","number","number"], [image, x, y, width, height]),
    pntr_image_subimage: (image, x, y, width, height) => m.ccall('pntr_image_subimage', 'number', ["number","number","number","number","number"], [image, x, y, width, height]),
    pntr_unload_image: (image) => m.ccall('pntr_unload_image', 'void', ["number"], [image]),
    pntr_clear_background: (image, color) => m.ccall('pntr_clear_background', 'void', ["number","number"], [image, color._address]),
    pntr_draw_point: (dst, x, y, color) => m.ccall('pntr_draw_point', 'void', ["number","number","number","number"], [dst, x, y, color._address]),
    pntr_draw_point_vec: (dst, point, color) => m.ccall('pntr_draw_point_vec', 'void', ["number","number","number"], [dst, point, color._address]),
    pntr_draw_points: (dst, points, pointsCount, color) => m.ccall('pntr_draw_points', 'void', ["number","number","number","number"], [dst, points, pointsCount, color._address]),
    pntr_draw_line: (dst, startPosX, startPosY, endPosX, endPosY, color) => m.ccall('pntr_draw_line', 'void', ["number","number","number","number","number","number"], [dst, startPosX, startPosY, endPosX, endPosY, color._address]),
    pntr_draw_line_vec: (dst, start, end, color) => m.ccall('pntr_draw_line_vec', 'void', ["number","number","number","number"], [dst, start._address, end._address, color._address]),
    pntr_draw_line_vertical: (dst, posX, posY, height, color) => m.ccall('pntr_draw_line_vertical', 'void', ["number","number","number","number","number"], [dst, posX, posY, height, color._address]),
    pntr_draw_line_horizontal: (dst, posX, posY, width, color) => m.ccall('pntr_draw_line_horizontal', 'void', ["number","number","number","number","number"], [dst, posX, posY, width, color._address]),
    pntr_draw_rectangle: (dst, posX, posY, width, height, thickness, color) => m.ccall('pntr_draw_rectangle', 'void', ["number","number","number","number","number","number","number"], [dst, posX, posY, width, height, thickness, color._address]),
    pntr_draw_rectangle_rec: (dst, rec, thickness, color) => m.ccall('pntr_draw_rectangle_rec', 'void', ["number","number","number","number"], [dst, rec._address, thickness, color._address]),
    pntr_draw_rectangle_fill: (dst, posX, posY, width, height, color) => m.ccall('pntr_draw_rectangle_fill', 'void', ["number","number","number","number","number","number"], [dst, posX, posY, width, height, color._address]),
    pntr_draw_rectangle_fill_rec: (dst, rect, color) => m.ccall('pntr_draw_rectangle_fill_rec', 'void', ["number","number","number"], [dst, rect._address, color._address]),
    pntr_draw_rectangle_gradient: (dst, x, y, width, height, topLeft, topRight, bottomLeft, bottomRight) => m.ccall('pntr_draw_rectangle_gradient', 'void', ["number","number","number","number","number","number","number","number","number"], [dst, x, y, width, height, topLeft._address, topRight._address, bottomLeft._address, bottomRight._address]),
    pntr_draw_rectangle_gradient_rec: (dst, rect, topLeft, topRight, bottomLeft, bottomRight) => m.ccall('pntr_draw_rectangle_gradient_rec', 'void', ["number","number","number","number","number","number"], [dst, rect._address, topLeft._address, topRight._address, bottomLeft._address, bottomRight._address]),
    pntr_draw_triangle: (dst, x1, y1, x2, y2, x3, y3, color) => m.ccall('pntr_draw_triangle', 'void', ["number","number","number","number","number","number","number","number"], [dst, x1, y1, x2, y2, x3, y3, color._address]),
    pntr_draw_triangle_vec: (dst, point1, point2, point3, color) => m.ccall('pntr_draw_triangle_vec', 'void', ["number","number","number","number","number"], [dst, point1._address, point2._address, point3._address, color._address]),
    pntr_draw_triangle_fill: (dst, x1, y1, x2, y2, x3, y3, color) => m.ccall('pntr_draw_triangle_fill', 'void', ["number","number","number","number","number","number","number","number"], [dst, x1, y1, x2, y2, x3, y3, color._address]),
    pntr_draw_triangle_fill_vec: (dst, point1, point2, point3, color) => m.ccall('pntr_draw_triangle_fill_vec', 'void', ["number","number","number","number","number"], [dst, point1._address, point2._address, point3._address, color._address]),
    pntr_draw_ellipse: (dst, centerX, centerY, radiusX, radiusY, color) => m.ccall('pntr_draw_ellipse', 'void', ["number","number","number","number","number","number"], [dst, centerX, centerY, radiusX, radiusY, color._address]),
    pntr_draw_ellipse_fill: (dst, centerX, centerY, radiusX, radiusY, color) => m.ccall('pntr_draw_ellipse_fill', 'void', ["number","number","number","number","number","number"], [dst, centerX, centerY, radiusX, radiusY, color._address]),
    pntr_draw_circle: (dst, centerX, centerY, radius, color) => m.ccall('pntr_draw_circle', 'void', ["number","number","number","number","number"], [dst, centerX, centerY, radius, color._address]),
    pntr_draw_circle_fill: (dst, centerX, centerY, radius, color) => m.ccall('pntr_draw_circle_fill', 'void', ["number","number","number","number","number"], [dst, centerX, centerY, radius, color._address]),
    pntr_draw_polygon: (dst, points, numPoints, color) => m.ccall('pntr_draw_polygon', 'void', ["number","number","number","number"], [dst, points, numPoints, color._address]),
    pntr_draw_polygon_fill: (dst, points, numPoints, color) => m.ccall('pntr_draw_polygon_fill', 'void', ["number","number","number","number"], [dst, points, numPoints, color._address]),
    pntr_draw_polyline: (dst, points, numPoints, color) => m.ccall('pntr_draw_polyline', 'void', ["number","number","number","number"], [dst, points, numPoints, color._address]),
    pntr_draw_arc: (dst, centerX, centerY, radius, startAngle, endAngle, segments, color) => m.ccall('pntr_draw_arc', 'void', ["number","number","number","number","number","number","number","number"], [dst, centerX, centerY, radius, startAngle, endAngle, segments, color._address]),
    pntr_draw_arc_fill: (dst, centerX, centerY, radius, startAngle, endAngle, segments, color) => m.ccall('pntr_draw_arc_fill', 'void', ["number","number","number","number","number","number","number","number"], [dst, centerX, centerY, radius, startAngle, endAngle, segments, color._address]),
    pntr_draw_rectangle_rounded: (dst, x, y, width, height, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius, color) => m.ccall('pntr_draw_rectangle_rounded', 'void', ["number","number","number","number","number","number","number","number","number","number"], [dst, x, y, width, height, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius, color._address]),
    pntr_draw_rectangle_rounded_fill: (dst, x, y, width, height, cornerRadius, color) => m.ccall('pntr_draw_rectangle_rounded_fill', 'void', ["number","number","number","number","number","number","number"], [dst, x, y, width, height, cornerRadius, color._address]),
    pntr_draw_image: (dst, src, posX, posY) => m.ccall('pntr_draw_image', 'void', ["number","number","number","number"], [dst, src, posX, posY]),
    pntr_draw_image_rec: (dst, src, srcRect, posX, posY) => m.ccall('pntr_draw_image_rec', 'void', ["number","number","number","number","number"], [dst, src, srcRect._address, posX, posY]),
    pntr_draw_image_tint: (dst, src, posX, posY, tint) => m.ccall('pntr_draw_image_tint', 'void', ["number","number","number","number","number"], [dst, src, posX, posY, tint._address]),
    pntr_draw_image_tint_rec: (dst, src, srcRect, posX, posY, tint) => m.ccall('pntr_draw_image_tint_rec', 'void', ["number","number","number","number","number","number"], [dst, src, srcRect._address, posX, posY, tint._address]),
    pntr_draw_image_rotated: (dst, src, posX, posY, degrees, offsetX, offsetY, filter) => m.ccall('pntr_draw_image_rotated', 'void', ["number","number","number","number","number","number","number","number"], [dst, src, posX, posY, degrees, offsetX, offsetY, filter]),
    pntr_draw_image_rotated_rec: (dst, src, srcRect, posX, posY, degrees, offsetX, offsetY, filter) => m.ccall('pntr_draw_image_rotated_rec', 'void', ["number","number","number","number","number","number","number","number","number"], [dst, src, srcRect._address, posX, posY, degrees, offsetX, offsetY, filter]),
    pntr_draw_image_flipped: (dst, src, posX, posY, flipHorizontal, flipVertical, flipDiagonal) => m.ccall('pntr_draw_image_flipped', 'void', ["number","number","number","number","boolean","boolean","boolean"], [dst, src, posX, posY, flipHorizontal, flipVertical, flipDiagonal]),
    pntr_draw_image_flipped_rec: (dst, src, srcRec, posX, posY, flipHorizontal, flipVertical, flipDiagonal) => m.ccall('pntr_draw_image_flipped_rec', 'void', ["number","number","number","number","number","boolean","boolean","boolean"], [dst, src, srcRec._address, posX, posY, flipHorizontal, flipVertical, flipDiagonal]),
    pntr_draw_image_scaled: (dst, src, posX, posY, scaleX, scaleY, offsetX, offsetY, filter) => m.ccall('pntr_draw_image_scaled', 'void', ["number","number","number","number","number","number","number","number","number"], [dst, src, posX, posY, scaleX, scaleY, offsetX, offsetY, filter]),
    pntr_draw_image_scaled_rec: (dst, src, srcRect, posX, posY, scaleX, scaleY, offsetX, offsetY, filter) => m.ccall('pntr_draw_image_scaled_rec', 'void', ["number","number","number","number","number","number","number","number","number","number"], [dst, src, srcRect._address, posX, posY, scaleX, scaleY, offsetX, offsetY, filter]),
    pntr_draw_text: (dst, font, text, posX, posY, color) => m.ccall('pntr_draw_text', 'void', ["number","number","string","number","number","number"], [dst, font, text, posX, posY, color._address]),
    pntr_draw_text_wrapped: (dst, font, text, posX, posY, maxWidth, tint) => m.ccall('pntr_draw_text_wrapped', 'void', ["number","number","string","number","number","number","number"], [dst, font, text, posX, posY, maxWidth, tint._address]),
    pntr_new_color: (r, g, b, a) => m.ccall('pntr_new_color', 'number', ["number","number","number","number"], [r, g, b, a]),
    pntr_get_color: (hexValue) => m.ccall('pntr_get_color', 'number', ["number"], [hexValue]),
    pntr_color_get_r: (color) => m.ccall('pntr_color_get_r', 'number', ["number"], [color._address]),
    pntr_color_get_g: (color) => m.ccall('pntr_color_get_g', 'number', ["number"], [color._address]),
    pntr_color_get_b: (color) => m.ccall('pntr_color_get_b', 'number', ["number"], [color._address]),
    pntr_color_get_a: (color) => m.ccall('pntr_color_get_a', 'number', ["number"], [color._address]),
    pntr_color_set_r: (color, r) => m.ccall('pntr_color_set_r', 'void', ["number","number"], [color, r]),
    pntr_color_set_g: (color, g) => m.ccall('pntr_color_set_g', 'void', ["number","number"], [color, g]),
    pntr_color_set_b: (color, b) => m.ccall('pntr_color_set_b', 'void', ["number","number"], [color, b]),
    pntr_color_set_a: (color, a) => m.ccall('pntr_color_set_a', 'void', ["number","number"], [color, a]),
    pntr_image_get_color: (image, x, y) => m.ccall('pntr_image_get_color', 'number', ["number","number","number"], [image, x, y]),
    pntr_save_file: (fileName, data, bytesToWrite) => m.ccall('pntr_save_file', 'boolean', ["number","void","number"], [fileName, data, bytesToWrite]),
    pntr_image_to_pixelformat: (image, dataSize, pixelFormat) => m.ccall('pntr_image_to_pixelformat', 'number', ["number","number","number"], [image, dataSize, pixelFormat]),
    pntr_save_image: (image, fileName) => m.ccall('pntr_save_image', 'boolean', ["number","string"], [image, fileName]),
    pntr_save_image_to_memory: (image, type, dataSize) => m.ccall('pntr_save_image_to_memory', 'number', ["number","number","number"], [image, type, dataSize]),
    pntr_get_pixel_data_size: (width, height, pixelFormat) => m.ccall('pntr_get_pixel_data_size', 'number', ["number","number","number"], [width, height, pixelFormat]),
    pntr_load_image: (fileName) => m.ccall('pntr_load_image', 'number', ["string"], [fileName]),
    pntr_load_image_from_memory: (type, fileData, dataSize) => m.ccall('pntr_load_image_from_memory', 'number', ["number","number","number"], [type, fileData, dataSize]),
    pntr_image_from_pixelformat: (data, width, height, pixelFormat) => m.ccall('pntr_image_from_pixelformat', 'number', ["number","number","number","number"], [data, width, height, pixelFormat]),
    pntr_set_error: (error) => m.ccall('pntr_set_error', 'number', ["number"], [error]),
    pntr_get_error: () => m.ccall('pntr_get_error', 'string', [], []),
    pntr_get_error_code: () => m.ccall('pntr_get_error_code', 'number', [], []),
    pntr_image_resize: (image, newWidth, newHeight, filter) => m.ccall('pntr_image_resize', 'number', ["number","number","number","number"], [image, newWidth, newHeight, filter]),
    pntr_image_scale: (image, scaleX, scaleY, filter) => m.ccall('pntr_image_scale', 'number', ["number","number","number","number"], [image, scaleX, scaleY, filter]),
    pntr_image_color_replace: (image, color, replace) => m.ccall('pntr_image_color_replace', 'void', ["number","number","number"], [image, color._address, replace._address]),
    pntr_color_tint: (color, tint) => m.ccall('pntr_color_tint', 'number', ["number","number"], [color._address, tint._address]),
    pntr_image_color_tint: (image, color) => m.ccall('pntr_image_color_tint', 'void', ["number","number"], [image, color._address]),
    pntr_color_fade: (color, alpha) => m.ccall('pntr_color_fade', 'number', ["number","number"], [color._address, alpha]),
    pntr_image_color_fade: (image, alpha) => m.ccall('pntr_image_color_fade', 'void', ["number","number"], [image, alpha]),
    pntr_color_brightness: (color, factor) => m.ccall('pntr_color_brightness', 'number', ["number","number"], [color._address, factor]),
    pntr_get_pixel_color: (srcPtr, srcPixelFormat) => m.ccall('pntr_get_pixel_color', 'number', ["number","number"], [srcPtr, srcPixelFormat]),
    pntr_set_pixel_color: (dstPtr, dstPixelFormat, color) => m.ccall('pntr_set_pixel_color', 'void', ["number","number","number"], [dstPtr, dstPixelFormat, color._address]),
    pntr_load_font_default: () => m.ccall('pntr_load_font_default', 'number', [], []),
    pntr_unload_font: (font) => m.ccall('pntr_unload_font', 'void', ["number"], [font]),
    pntr_font_copy: (font) => m.ccall('pntr_font_copy', 'number', ["number"], [font]),
    pntr_font_scale: (font, scaleX, scaleY, filter) => m.ccall('pntr_font_scale', 'number', ["number","number","number","number"], [font, scaleX, scaleY, filter]),
    pntr_load_font_bmf: (fileName, characters) => m.ccall('pntr_load_font_bmf', 'number', ["string","string"], [fileName, characters]),
    pntr_load_font_bmf_from_image: (image, characters) => m.ccall('pntr_load_font_bmf_from_image', 'number', ["number","string"], [image, characters]),
    pntr_load_font_bmf_from_memory: (fileData, dataSize, characters) => m.ccall('pntr_load_font_bmf_from_memory', 'number', ["number","number","string"], [fileData, dataSize, characters]),
    pntr_measure_text: (font, text) => m.ccall('pntr_measure_text', 'number', ["number","string"], [font, text]),
    pntr_measure_text_ex: (font, text, textLength) => m.ccall('pntr_measure_text_ex', 'number', ["number","string","number"], [font, text, textLength]),
    pntr_gen_image_text: (font, text, tint) => m.ccall('pntr_gen_image_text', 'number', ["number","string","number"], [font, text, tint._address]),
    pntr_load_font_tty: (fileName, glyphWidth, glyphHeight, characters) => m.ccall('pntr_load_font_tty', 'number', ["string","number","number","string"], [fileName, glyphWidth, glyphHeight, characters]),
    pntr_load_font_tty_from_memory: (fileData, dataSize, glyphWidth, glyphHeight, characters) => m.ccall('pntr_load_font_tty_from_memory', 'number', ["number","number","number","number","string"], [fileData, dataSize, glyphWidth, glyphHeight, characters]),
    pntr_load_font_tty_from_image: (image, glyphWidth, glyphHeight, characters) => m.ccall('pntr_load_font_tty_from_image', 'number', ["number","number","number","string"], [image, glyphWidth, glyphHeight, characters]),
    pntr_load_file: (fileName, bytesRead) => m.ccall('pntr_load_file', 'number', ["number","number"], [fileName, bytesRead]),
    pntr_unload_file: (fileData) => m.ccall('pntr_unload_file', 'void', ["number"], [fileData]),
    pntr_load_file_text: (fileName) => m.ccall('pntr_load_file_text', 'string', ["number"], [fileName]),
    pntr_unload_file_text: (text) => m.ccall('pntr_unload_file_text', 'void', ["string"], [text]),
    pntr_load_font_ttf: (fileName, fontSize) => m.ccall('pntr_load_font_ttf', 'number', ["string","number"], [fileName, fontSize]),
    pntr_load_font_ttf_from_memory: (fileData, dataSize, fontSize) => m.ccall('pntr_load_font_ttf_from_memory', 'number', ["number","number","number"], [fileData, dataSize, fontSize]),
    pntr_color_invert: (color) => m.ccall('pntr_color_invert', 'number', ["number"], [color._address]),
    pntr_image_color_invert: (image) => m.ccall('pntr_image_color_invert', 'void', ["number"], [image]),
    pntr_color_alpha_blend: (dst, src) => m.ccall('pntr_color_alpha_blend', 'number', ["number","number"], [dst._address, src._address]),
    pntr_image_alpha_border: (image, threshold) => m.ccall('pntr_image_alpha_border', 'number', ["number","number"], [image, threshold]),
    pntr_image_crop: (image, x, y, width, height) => m.ccall('pntr_image_crop', 'boolean', ["number","number","number","number","number"], [image, x, y, width, height]),
    pntr_image_alpha_crop: (image, threshold) => m.ccall('pntr_image_alpha_crop', 'void', ["number","number"], [image, threshold]),
    pntr_image_color_brightness: (image, factor) => m.ccall('pntr_image_color_brightness', 'void', ["number","number"], [image, factor]),
    pntr_image_flip: (image, horizontal, vertical) => m.ccall('pntr_image_flip', 'void', ["number","boolean","boolean"], [image, horizontal, vertical]),
    pntr_color_contrast: (color, contrast) => m.ccall('pntr_color_contrast', 'number', ["number","number"], [color._address, contrast]),
    pntr_image_color_contrast: (image, contrast) => m.ccall('pntr_image_color_contrast', 'void', ["number","number"], [image, contrast]),
    pntr_image_alpha_mask: (image, alphaMask, posX, posY) => m.ccall('pntr_image_alpha_mask', 'void', ["number","number","number","number"], [image, alphaMask, posX, posY]),
    pntr_image_resize_canvas: (image, newWidth, newHeight, offsetX, offsetY, fill) => m.ccall('pntr_image_resize_canvas', 'boolean', ["number","number","number","number","number","number"], [image, newWidth, newHeight, offsetX, offsetY, fill._address]),
    pntr_image_rotate: (image, degrees, filter) => m.ccall('pntr_image_rotate', 'number', ["number","number","number"], [image, degrees, filter]),
    pntr_gen_image_gradient: (width, height, topLeft, topRight, bottomLeft, bottomRight) => m.ccall('pntr_gen_image_gradient', 'number', ["number","number","number","number","number","number"], [width, height, topLeft._address, topRight._address, bottomLeft._address, bottomRight._address]),
    pntr_color_bilinear_interpolate: (color00, color01, color10, color11, coordinateX, coordinateY) => m.ccall('pntr_color_bilinear_interpolate', 'number', ["number","number","number","number","number","number"], [color00._address, color01._address, color10._address, color11._address, coordinateX, coordinateY]),
    pntr_load_memory: (size) => m.ccall('pntr_load_memory', 'number', ["number"], [size]),
    pntr_unload_memory: (pointer) => m.ccall('pntr_unload_memory', 'void', ["number"], [pointer]),
    pntr_memory_copy: (destination, source, size) => m.ccall('pntr_memory_copy', 'number', ["number","number","number"], [destination, source, size]),
    pntr_get_file_image_type: (filePath) => m.ccall('pntr_get_file_image_type', 'number', ["string"], [filePath]),
    pntr_load_sound: (fileName) => m.ccall('pntr_load_sound', 'number', ["string"], [fileName]),
    pntr_load_sound_from_memory: (type, data, dataSize) => m.ccall('pntr_load_sound_from_memory', 'number', ["number","number","number"], [type, data, dataSize]),
    pntr_unload_sound: (sound) => m.ccall('pntr_unload_sound', 'void', ["number"], [sound]),
    pntr_play_sound: (sound, loop) => m.ccall('pntr_play_sound', 'void', ["number","boolean"], [sound, loop]),
    pntr_stop_sound: (sound) => m.ccall('pntr_stop_sound', 'void', ["number"], [sound]),
    pntr_app_get_file_sound_type: (fileName) => m.ccall('pntr_app_get_file_sound_type', 'number', ["string"], [fileName]),
    pntr_app_width: (app) => m.ccall('pntr_app_width', 'number', ["number"], [app]),
    pntr_app_height: (app) => m.ccall('pntr_app_height', 'number', ["number"], [app]),
    pntr_app_delta_time: (app) => m.ccall('pntr_app_delta_time', 'number', ["number"], [app]),
    pntr_app_random: (min, max) => m.ccall('pntr_app_random', 'number', ["number","number"], [min, max]),
    pntr_app_random_seed: (seed) => m.ccall('pntr_app_random_seed', 'void', ["number"], [seed]),
    pntr_app_log: (type, message) => m.ccall('pntr_app_log', 'void', ["number","string"], [type, message]),
    pntr_app_key_pressed: (app, key) => m.ccall('pntr_app_key_pressed', 'boolean', ["number","number"], [app, key]),
    pntr_app_key_down: (app, key) => m.ccall('pntr_app_key_down', 'boolean', ["number","number"], [app, key]),
    pntr_app_key_released: (app, key) => m.ccall('pntr_app_key_released', 'boolean', ["number","number"], [app, key]),
    pntr_app_key_up: (app, key) => m.ccall('pntr_app_key_up', 'boolean', ["number","number"], [app, key]),
    pntr_app_gamepad_button_pressed: (app, gamepad, key) => m.ccall('pntr_app_gamepad_button_pressed', 'boolean', ["number","number","number"], [app, gamepad, key]),
    pntr_app_gamepad_button_down: (app, gamepad, key) => m.ccall('pntr_app_gamepad_button_down', 'boolean', ["number","number","number"], [app, gamepad, key]),
    pntr_app_gamepad_button_released: (app, gamepad, key) => m.ccall('pntr_app_gamepad_button_released', 'boolean', ["number","number","number"], [app, gamepad, key]),
    pntr_app_gamepad_button_up: (app, gamepad, key) => m.ccall('pntr_app_gamepad_button_up', 'boolean', ["number","number","number"], [app, gamepad, key]),
    pntr_app_mouse_x: (app) => m.ccall('pntr_app_mouse_x', 'number', ["number"], [app]),
    pntr_app_mouse_y: (app) => m.ccall('pntr_app_mouse_y', 'number', ["number"], [app]),
    pntr_app_mouse_delta_x: (app) => m.ccall('pntr_app_mouse_delta_x', 'number', ["number"], [app]),
    pntr_app_mouse_delta_y: (app) => m.ccall('pntr_app_mouse_delta_y', 'number', ["number"], [app]),
    pntr_app_mouse_button_pressed: (app, button) => m.ccall('pntr_app_mouse_button_pressed', 'boolean', ["number","number"], [app, button]),
    pntr_app_mouse_button_down: (app, button) => m.ccall('pntr_app_mouse_button_down', 'boolean', ["number","number"], [app, button]),
    pntr_app_mouse_button_released: (app, button) => m.ccall('pntr_app_mouse_button_released', 'boolean', ["number","number"], [app, button]),
    pntr_app_mouse_button_up: (app, button) => m.ccall('pntr_app_mouse_button_up', 'boolean', ["number","number"], [app, button]),
    pntr_app_set_title: (app, title) => m.ccall('pntr_app_set_title', 'void', ["number","string"], [app, title]),
    pntr_app_title: (app) => m.ccall('pntr_app_title', 'string', ["number"], [app]),
    pntr_app_set_size: (app, width, height) => m.ccall('pntr_app_set_size', 'boolean', ["number","number","number"], [app, width, height]),
    pntr_app_set_icon: (app, icon) => m.ccall('pntr_app_set_icon', 'void', ["number","number"], [app, icon]),
    pntr_app_load_arg_file: (app, size) => m.ccall('pntr_app_load_arg_file', 'number', ["number","number"], [app, size]),

    pntr_vector,
    pntr_rectangle,
    pntr_color,

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
