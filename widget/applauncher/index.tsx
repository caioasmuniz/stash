import Apps from "gi://AstalApps"
import { Astal, Gtk, For } from "ags/gtk4";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"
import { bind, State } from "ags/state";
import AppButton from "./appButton";
import Settings from "../../lib/settings";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default (
  visible: State<{
    applauncher: boolean,
    quicksettings: boolean
  }>) => {
  const settings = Settings.get_default()
  const hyprland = Hyprland.get_default()
  const apps = new Apps.Apps()

  const list = new State(apps.list)

  let searchEntry = new Gtk.Entry()

  return <window
    $$visible={self => {
      self.visible ?
        searchEntry.grab_focus() :
        searchEntry.set_text("")
      visible.set({
        applauncher: self.visible,
        quicksettings: self.visible &&
          (settings.barPosition === LEFT ||
            settings.barPosition === RIGHT) ?
          false :
          visible.get().quicksettings
      })
    }}
    valign={Gtk.Align.CENTER}
    name={"applauncher"}
    margin={12}
    application={App}
    visible={bind(visible).as(v => v.applauncher)}
    cssClasses={["applauncher", "background"]}
    keymode={Astal.Keymode.EXCLUSIVE}
    monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
    anchor={bind(settings, "barPosition").as(p =>
      TOP | (p === RIGHT ? RIGHT : LEFT) | BOTTOM)}
  >
    <box
      orientation={Gtk.Orientation.VERTICAL}
      cssClasses={["applauncher-body"]}
      spacing={8}>
      <entry
        $={self => self = searchEntry}
        hexpand
        placeholderText={"Search your apps"}
        $$text={self => list.set(
          apps.fuzzy_query(self.text)
        )}
        $activate={self => {
          App.get_window("applauncher")!.hide()
          apps.fuzzy_query(self.text)[0].launch();
        }} />
      <Gtk.ScrolledWindow
        hscrollbarPolicy={Gtk.PolicyType.NEVER}
        propagateNaturalHeight>
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={8}>
          <For each={bind(list)}>
            {app => <AppButton app={app} />}
          </For>
        </box>
      </Gtk.ScrolledWindow>
    </box >
  </window >
}