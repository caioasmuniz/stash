import Apps from "gi://AstalApps"
import Hyprland from "gi://AstalHyprland"
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding, createState, For, State } from "gnim";
import AppButton from "./appButton";
import Settings from "../../lib/settings";

import App from "ags/gtk4/app";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default (
  [visible, SetVisible]: State<{
    applauncher: boolean,
    quicksettings: boolean
  }>) => {
  const settings = Settings.get_default()
  const hyprland = Hyprland.get_default()
  const apps = new Apps.Apps()

  const [list, setList] = createState(apps.list)

  let searchEntry = new Gtk.Entry()

  return <Astal.Window
    onNotifyVisible={self => {
      if (self.visible) searchEntry.grab_focus()
      else searchEntry.set_text("")
      SetVisible({
        applauncher: self.visible,
        quicksettings: self.visible &&
          (settings.bar.position === LEFT ||
            settings.bar.position === RIGHT) ?
          false :
          visible.get().quicksettings
      })
    }}
    valign={Gtk.Align.CENTER}
    name={"applauncher"}
    margin={12}
    application={App}
    visible={visible(v => v.applauncher)}
    cssClasses={["applauncher", "background"]}
    keymode={Astal.Keymode.ON_DEMAND}
    monitor={createBinding(hyprland, "focusedMonitor")(m => m.id)}
    anchor={createBinding(settings.bar, "position")
      (p => TOP | (p === RIGHT ? RIGHT : LEFT) | BOTTOM)}
  >
    <Gtk.Box
      orientation={Gtk.Orientation.VERTICAL}
      cssClasses={["applauncher-body"]}
      spacing={8}>
      <Gtk.Entry
        $={self => self = searchEntry}
        hexpand
        placeholderText={"Search your apps"}
        onNotifyText={self => setList(
          apps.fuzzy_query(self.text)
        )}
        onActivate={self => {
          App.get_window("applauncher")!.hide()
          apps.fuzzy_query(self.text)[0].launch();
        }} />
      <Gtk.ScrolledWindow
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        propagateNaturalHeight>
        <Gtk.Box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={8}>
          <For each={list}>
            {app => <AppButton app={app} />}
          </For>
        </Gtk.Box>
      </Gtk.ScrolledWindow>
    </Gtk.Box >
  </Astal.Window >
}