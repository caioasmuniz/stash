import Apps from "gi://AstalApps"
import { Astal, Gtk, Gdk, For } from "ags/gtk4";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"
import { bind, State } from "ags/state";

const hyprland = Hyprland.get_default()
const apps = new Apps.Apps()

const text = new State<string>("")
const list = bind(text)
  .as(text => apps
    .fuzzy_query(text))

const AppButton = ({ app }: { app: Apps.Application }) =>
  <button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={["app-button"]}
    $clicked={(self) => {
      App.get_window("applauncher")!.hide()
      app.launch();
    }}>
    <box spacing={8}>
      <image
        iconName={app.iconName || ""}
        pixelSize={48} />
      <box vertical>
        <label
          wrap
          cssClasses={["title-2"]}
          label={app.name}
          xalign={0} />
        <label
          cssClasses={["body"]}
          label={app.description}
          xalign={0}
          maxWidthChars={25}
          wrap />
      </box>
    </box>
  </button>

export default () => <window
  valign={Gtk.Align.CENTER}
  name={"applauncher"}
  margin={12}
  application={App}
  visible={false}
  cssClasses={["applauncher", "background"]}
  keymode={Astal.Keymode.ON_DEMAND}
  monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
  anchor={
    Astal.WindowAnchor.LEFT |
    Astal.WindowAnchor.TOP |
    Astal.WindowAnchor.BOTTOM}
  $show={() => text.set("")}>
  <box
    vertical
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
        vertical
        spacing={8}>
        <For each={list}>
          {app => <AppButton app={app} />}
        </For>
      </box>
    </Gtk.ScrolledWindow>
  </box>
</window>
