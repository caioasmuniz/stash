import Apps from "gi://AstalApps"
import Hyprland from "gi://AstalHyprland"
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding, createState, For } from "gnim";
import AppButton from "./appButton";
import { useSettings } from "../../lib/settings";
import { App } from "App";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default ({ app, $ }:
  { app: App, $: (self: Astal.Window) => void }
) => {
  const barCfg = useSettings().bar
  const hyprland = Hyprland.get_default()
  const apps = new Apps.Apps()

  const [list, setList] = createState(apps.get_list())

  return <Astal.Window
    $={$}
    valign={Gtk.Align.CENTER}
    name={"applauncher"}
    margin={12}
    application={app}
    cssClasses={["osd", "toolbar"]}
    keymode={Astal.Keymode.ON_DEMAND}
    monitor={createBinding(hyprland, "focusedMonitor")
      .as(m => m.id)}
    anchor={barCfg.position.as(p =>
      TOP | (p === RIGHT ? RIGHT : LEFT) | BOTTOM)}
  >
    <Gtk.Box
      orientation={Gtk.Orientation.VERTICAL}
      cssClasses={["applauncher-body"]}
      spacing={8}>
      <Gtk.Entry
        hexpand
        placeholderText={"Search your apps"}
        onNotifyText={self => setList(
          apps.fuzzy_query(self.text)
        )}
        onActivate={self => {
          app.applauncher.visible = false;
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