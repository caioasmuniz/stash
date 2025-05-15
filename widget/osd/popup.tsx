import { Astal, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { bind, Binding, State } from "ags/state"
import { timeout } from "ags/time"
import AstalHyprland from "gi://AstalHyprland?version=0.1"

const hyprland = AstalHyprland.get_default()

export default ({ subscribable, widget }: {
  subscribable: State<any> | Binding<any>,
  widget: Gtk.Widget
}) =>
  <window
    name={`osd-${subscribable.toString()}`}
    widthRequest={250}
    application={app}
    margin={24}
    layer={Astal.Layer.OVERLAY}
    monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
    cssClasses={["osd-popup"]}
    anchor={Astal.WindowAnchor.BOTTOM}
    $={self => {
      subscribable.subscribe(() => {
        if (!self.visible) {
          self.visible = true
          timeout(1500, () =>
            self.visible = false)
        }
      })
    }}
  >
    {widget}
  </window>