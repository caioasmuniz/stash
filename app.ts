import App from "ags/gtk4/app"
import style from "./style.scss";

import bar from "./widget/bar/index";
import osd from "./widget/osd";
import applauncher from "./widget/applauncher";
import quicksettings from "./widget/quicksettings";
import notificationPopup from "./widget/notifications";
import infopannel from "./widget/infopannel";
import { State } from "ags/state";

const verticalBar = new State<boolean>(true)

App.start({
  css: style,
  instanceName: "stash",
  main() {
    notificationPopup();
    quicksettings(verticalBar);
    // infopannel(verticalBar);
    applauncher();
    osd();
    bar(verticalBar);
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
