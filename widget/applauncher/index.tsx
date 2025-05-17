import Apps from "gi://AstalApps"
import { Astal, Gtk, For } from "ags/gtk4";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"
import { bind, State } from "ags/state";
import AppButton from "./appButton";
import { Config } from "../settings";

const hyprland = Hyprland.get_default()
const apps = new Apps.Apps()

const text = new State<string>("")
const list = bind(text)
  .as(text => apps
    .fuzzy_query(text))


export default (
  config: State<Config>,
  visible: State<{
    applauncher: boolean,
    quicksettings: boolean
  }>) =>
  <window
    $$visible={self => {
      visible.set({
        applauncher: self.visible,
        quicksettings: self.visible &&
          (config.get().barOrientation === Gtk.Orientation.VERTICAL) ?
          false : visible.get().quicksettings
      })
    }}
    valign={Gtk.Align.CENTER}
    name={"applauncher"}
    margin={12}
    application={App}
    visible={bind(visible).as(v => v.applauncher)}
    cssClasses={["applauncher", "background"]}
    keymode={Astal.Keymode.ON_DEMAND}
    monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
    anchor={
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.BOTTOM}
    $show={() => text.set("")}>
    <box
      orientation={Gtk.Orientation.VERTICAL}
      cssClasses={["applauncher-body"]}
      spacing={8}>
      <entry
        hexpand
        $changed={self => text.set(self.text)}
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
          <For each={list}>
            {app => <AppButton app={app} />}
          </For>
        </box>
      </Gtk.ScrolledWindow>
    </box >
  </window >
