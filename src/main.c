#define PNTR_APP_IMPLEMENTATION
#define PNTR_ENABLE_DEFAULT_FONT
#define PNTR_DISABLE_MATH
#include "pntr_app.h"

int width = 500;
int height = 500;

EM_ASYNC_JS(bool, Init, (pntr_app* app), {
    console.log('init called');
    if (Module?.user?.init) {
        return await Module.user.init(app);
    }
    return true;
});

EM_JS(bool, Update, (pntr_app* app, pntr_image* screen), {
    console.log('update called');
    if (Module?.user?.update) {
        return Module.user.update(app, screen);
    }
    return true;
});

EM_JS(void, Event, (pntr_app* app, pntr_app_event* event), {
    console.log('event called');
    if (Module?.user?.event) {
        Module.user.event(app, event);
    }
});

EM_JS(void, Close, (pntr_app* app), {
    console.log('close called');
    if (Module?.user?.close) {
        Module.user.close(app);
    }
});


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
