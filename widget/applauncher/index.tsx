import Apps from "gi://AstalApps"
import { Astal, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"
import { createBinding, createState, For, State } from "ags";
import AppButton from "./appButton";
import Settings from "../../lib/settings";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default (
  [visible, SetVisible]: State<{
    applauncher: boolean,
    quicksettings: boolean
  }>) => {
  const barCfg = Settings().bar
  const hyprland = Hyprland.get_default()
  const apps = new Apps.Apps()

  const [list, setList] = createState(apps.list)

  let searchEntry = new Gtk.Entry()

  return <window
    onNotifyVisible={self => {
      if (self.visible) searchEntry.grab_focus()
      else searchEntry.set_text("")
      SetVisible({
        applauncher: self.visible,
        quicksettings: self.visible &&
          (barCfg.position.get() === LEFT ||
            barCfg.position.get() === RIGHT) ?
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
    anchor={barCfg.position.as(p =>
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
        <box
          orientation={Gtk.Orientation.VERTICAL}
          spacing={8}>
          <For each={list}>
            {app => <AppButton app={app} />}
          </For>
        </box>
      </Gtk.ScrolledWindow>
    </box >
  </window >
}