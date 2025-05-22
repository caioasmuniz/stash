import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Adw from "gi://Adw?version=1";
import general from "./general";
import General from "./general";

export default () => {
  const pages = [{
    title: "General",
    iconName: "preferences-desktop-appearance-symbolic",
    widget: general()
  }, {
    title: "Desktop",
    iconName: "preferences-desktop-display-symbolic",
    widget: <label label={"view 2"} /> as Gtk.Widget
  }];

  const stack = <Adw.ViewStack
    enableTransitions>
    <General />
    <Adw.ViewStackPage
      title={"Desktop"}
      iconName={"preferences-desktop-display-symbolic"}
      child={<label label={"view 2"} /> as Gtk.Widget} />
  </Adw.ViewStack>

  return <Adw.Window
    hideOnClose
    name={"settings"}
    application={app}
    cssClasses={["background"]}
    title={"Stash Settings"}>
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Adw.InlineViewSwitcher
        cssClasses={["round"]}
        displayMode={Adw.InlineViewSwitcherDisplayMode.BOTH}
        stack={stack as Adw.ViewStack} />
      {stack}
    </box>
  </Adw.Window >
}