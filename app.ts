import { State } from "ags/state";
import App from "ags/gtk4/app"

import style from "./style.scss";

import bar from "./widget/bar";
import osd from "./widget/osd";
import applauncher from "./widget/applauncher";
import quicksettings from "./widget/quicksettings";
import notificationPopup from "./widget/notifications";
import screenshare, { updateResponse } from "./widget/screenshare";

const verticalBar = new State<boolean>(true)
const visible = new State<{ applauncher: boolean, quicksettings: boolean }>(
  { applauncher: false, quicksettings: false })

App.start({
  css: style,
  instanceName: "stash",
  main() {
    screenshare();
    notificationPopup();
    quicksettings(verticalBar, visible);
    applauncher(verticalBar, visible);
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
    } else if (args[0] === "screenshare") {
      const res = message(JSON.stringify({
        action: "screenshare"
      }))
      print(res)
    }
  },
  requestHandler(request: string, res: (response: any) => void) {
    const req = JSON.parse(request)
    if (req.action === "toggle") {
      App.toggle_window(req.window)
      res(req)
    } else if (req.action === "screenshare") {
      App.get_window("screenshare")!.set_visible(true)
      updateResponse(res)
      res("screenshare")
    }
  }
});
