import App from "ags/gtk4/app"
import style from "./style.scss";

import bar from "./widget/bar/index";
import osd from "./widget/osd";
import applauncher from "./widget/applauncher";
import quicksettings from "./widget/quicksettings";
import notificationPopup from "./widget/notifications";
import { State } from "ags/state";

const verticalBar = new State<boolean>(true)
const visible = new State<{ applauncher: boolean, quicksettings: boolean }>(
  { applauncher: false, quicksettings: false })

App.start({
  css: style,
  instanceName: "stash",
  main() {
    notificationPopup();
    quicksettings(verticalBar, visible);
    // infopannel(verticalBar);
    applauncher(verticalBar, visible);
    osd();
    bar(verticalBar);

    visible.subscribe(v => console.log(v))
  },
  client(message: (msg: string) => string, ...args: Array<string>) {
    if (args[0] === "toggle") {
      const res = message(JSON.stringify({
        action: "toggle",
        window: args[1]
      }))
      print(res)
    }
  },
  requestHandler(request: string, res: (response: any) => void) {
    const req = JSON.parse(request)
    if (req.action === "toggle") {
      App.toggle_window(req.window)
    }
    res(req)
  }
});
