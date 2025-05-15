import Wireplumber from "gi://AstalWp"
import { bind, derive } from "ags/state"
import Brightness from "../../lib/brightness"
import Slider from "./slider"
import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import AstalHyprland from "gi://AstalHyprland"
import Popup from "./popup"

const brightness = Brightness.get_default()
const audio = Wireplumber.get_default()!.audio
const hyprland = AstalHyprland.get_default()

const popupList: Gtk.Revealer[] = [
  <Popup
    observable={bind(audio.defaultSpeaker, "volume")}
    widget={Slider({
      iconName: bind(audio.defaultSpeaker, "volumeIcon"),
      binding: bind(audio.defaultSpeaker,"volume"),
    })} /> as Gtk.Revealer,

  <Popup
    observable={bind(brightness, "screen")}
    widget={Slider({
      iconName: "display-brightness-symbolic",
      binding: bind(brightness, "screen"),
    })} /> as Gtk.Revealer
];

export default () =>
  <window
    name={`osd`}
    widthRequest={250}
    application={app}
    margin={24}
    layer={Astal.Layer.OVERLAY}
    monitor={bind(hyprland.focusedMonitor,"id")}
    cssClasses={["osd-popup"]}
    anchor={Astal.WindowAnchor.BOTTOM}
    visible={bind(derive(
      popupList.map(p =>
        bind(p, "revealChild")),
      (...r) => r.reduce(
        (a, b) => a || b)
    ))}>
    <box
      orientation={Gtk.Orientation.VERTICAL}
      valign={Gtk.Align.END}>
      {popupList}
    </box>
  </window>
