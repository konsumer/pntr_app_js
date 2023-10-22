# pntr_app_js

This will allow you to make your pntr games in javascript, on the web. It allows a quick way to try out ideas on the web.


## usage

```html
<script type="module" src="https://cd.url.goes/here/pntr_app.js"></script>
<pntr-app>
    <script type="pntr">
        let font

        async function init () {
          font = pntr_load_font_default()
          return true
        }

        function update (screen) {
          pntr_clear_background(screen, PNTR_RAYWHITE)
          pntr_draw_text(screen, font, "Congrats! You created your first pntr_app!", 35, 100, PNTR_DARKGRAY)
        }

        function close () {
          pntr_unload_font(font)
        }

        return {
          init,
          update,
          close,
          width: 400,
          height: 225
        }
    </script>
</pntr-app>
```

### development

You don't need to do this yourself in general (output is in docs/) but here is what I do to compile it from scratch:


```
emcmake cmake -B build
emmake make -C build
cp build/pntr_app_js_wasm* docs

emrun docs/index.html
```


## License

Web-code & bindings made by David Konsumer (@konsumer).

Unless stated otherwise, all works are:

- Copyright (c) 2023 [Rob Loach](https://robloach.net)

... and licensed under:

- [zlib License](LICENSE)
