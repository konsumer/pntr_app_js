#define PNTR_APP_IMPLEMENTATION
#define PNTR_ENABLE_DEFAULT_FONT
#define PNTR_DISABLE_MATH
#include "pntr_app.h"

int width = 500;
int height = 500;

EM_ASYNC_JS(bool, Init, (pntr_app* app), {
    if (Module?.user?.init) {
       const r = await Module.user.init(app);
       if (r === false) {
            return 0;
        } else {
            return 1;
        }
    }
    return 1;
});

EM_JS(bool, Update, (pntr_app* app, pntr_image* screen), {
    if (Module?.user?.update) {
        const r = Module.user.update(app, screen);
        if (r === false) {
            return 0;
        }else{
            return 1;
        }
    }
    return 0;
});

EM_JS(void, Event, (pntr_app* app, pntr_app_event* event), {
    if (Module?.user?.event) {
        Module.user.event(app, Module.user.pntr_app_event({}, event));
    }
});

EM_JS(void, Close, (pntr_app* app), {
    if (Module?.user?.close) {
        Module.user.close(app);
    }
});

void user_set_size(int w, int h) {
    width = w;
    height = h;
}


// TODO: call main() in host, which will call this
pntr_app Main(int argc, char* argv[]) {
    return (pntr_app) {
        .width = width,
        .height = height,
        .title = "pntr_app",
        .init = Init,
        .update = Update,
        .event = Event,
        .close = Close
    };
}
