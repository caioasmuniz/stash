import Apps from "gi://AstalApps"
import { App, Astal, Gtk } from "astal/gtk4";
import Hyprland from "gi://AstalHyprland"
import { bind, Variable } from "astal";
import Gdk from "gi://Gdk?version=4.0";
import { ScrolledWindow } from "../../lib/astalified";

const hyprland = Hyprland.get_default()
const apps = new Apps.Apps()

const text = Variable("")
const list = bind(text)
  .as(text => apps
    .fuzzy_query(text))

const AppButton = ({ app }: { app: Apps.Application }) =>
  <button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={["app-button"]}
    onClicked={(self) => {
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
    Astal.WindowAnchor.BOTTOM |
    Astal.WindowAnchor.TOP}
  onShow={() => text.set("")}>
  <box
    vertical
    cssClasses={["applauncher-body"]}
    spacing={8}>
    <entry
      hexpand
      onChanged={self => text.set(self.text)}
      onActivate={self => {
        App.get_window("applauncher")!.hide()
        apps.fuzzy_query(self.text)[0].launch();
      }} />
    <ScrolledWindow
      hscrollbarPolicy={Gtk.PolicyType.NEVER}
      propagateNaturalHeight>
      <box
        vertical
        spacing={8}>
        {list.as(list =>
          list.map(app =>
            <AppButton app={app} />
          ))}
      </box>
    </ScrolledWindow>
  </box>
</window>
