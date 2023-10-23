# pntr_app_web

This will allow you to make your [pntr_app](https://github.com/RobLoach/pntr_app) games in javascript, on the web. This way, you can try out & share ideas quickly, and you can easily port your game to C later, if you want (for native + web.)

[Here](https://codepen.io/konsumer/pen/WNPNVYg?editors=1100) is a codepen-template you can use.


## usage

```html
<script type="module" src="https://konsumer.js.org/pntr_app_web/pntr_app.js" ></script>
<pntr-app>
<script type="pntr">
  let font

  // called when it first starts
  async function init (app) {
    font = pntr_load_font_default()
  }

  // called on each frame
  function update (app, screen) {
    pntr_clear_background(screen, PNTR_BLACK)
    pntr_draw_text(screen, font, "Congrats! You created your first pntr_app!", 35, 100, PNTR_DARKGRAY)
  }

  // called on input/file-drop events
  function event(app, event) {
    console.log('event', event)
  }

  // called on exit (which never really happens in a practical sense)
  function close (app) {
    pntr_unload_font(font)
  }

  return {
    init,
    update,
    close,
    event,
    width: 400,
    height: 225
  }
</script>
</pntr-app>
```

All of these callbacks are optional.

### development

You don't need to do this yourself in general (output is in docs/) but here is what I do to compile it from scratch:


```
npm run build
```

If you want to just run it locally, you can do this instead:

```
npm start
```


## License

Web-code & bindings made by David Konsumer (@konsumer).

Unless stated otherwise, all works are:

- Copyright (c) 2023 [Rob Loach](https://robloach.net)

... and licensed under:

- [zlib License](LICENSE)
