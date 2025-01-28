import { App } from "astal/gtk4";
import { Variable } from "astal";

import style from "./style.scss";

import bar from "./widget/bar";
import osd from "./widget/osd";
import applauncher from "./widget/applauncher";
import quicksettings from "./widget/quicksettings";
import notificationPopup from "./widget/notifications";
import infopannel from "./widget/infopannel";

const verticalBar = Variable(true)

App.start({
  css: style,
  main() {
    // notificationPopup();
    quicksettings(verticalBar);
    infopannel(verticalBar);
    applauncher();
    osd();
    bar(verticalBar);
  }
});
