import Wireplumber from "gi://AstalWp"
import { bind } from "ags/state"
import Brightness from "../../lib/brightness"
import Slider from "./slider"
import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import AstalHyprland from "gi://AstalHyprland"
import Popup from "./popup"

const brightness = Brightness.get_default()
const audio = Wireplumber.get_default()!.audio
const hyprland = AstalHyprland.get_default()

export default () =>
  <window
    name={`osd`}
    widthRequest={250}
    application={app}
    margin={24}
    layer={Astal.Layer.OVERLAY}
    monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
    cssClasses={["osd-popup"]}
    anchor={Astal.WindowAnchor.BOTTOM}
    visible>
    <box
      orientation={Gtk.Orientation.VERTICAL}
      valign={Gtk.Align.END}>
      <Popup
        observable={bind(audio.defaultSpeaker, "volume")}
        widget={Slider({
          iconName: bind(audio.defaultSpeaker, "volumeIcon"),
          binding: bind(brightness, "screen"),
        })} />
      <Popup
        observable={bind(brightness, "screen")}
        widget={Slider({
          iconName: "display-brightness-symbolic",
          binding: bind(brightness, "screen"),
        })} />
    </box>
  </window>
