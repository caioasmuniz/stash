import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";
import Bar from "./bar";

import app from "ags/gtk4/app";
import Network from "./network";

export default () => {
  const stack = new Adw.ViewStack()
  return <Adw.Window
    visible
    hideOnClose
    name={"settings"}
    application={app}
    cssClasses={["background"]}
    title={"Stash Settings"}>
    <Adw.ToolbarView>
      <Adw.HeaderBar $type="top"
        titleWidget={
          <Adw.ViewSwitcher
            stack={stack}
          /> as Gtk.Widget} />
      <Adw.ViewStack
        $={self => self = stack}>
        <Adw.PreferencesPage name={"bar"}>
          <Bar />
        </Adw.PreferencesPage>
        <Network />
      </Adw.ViewStack>
    </Adw.ToolbarView>
  </Adw.Window >
}