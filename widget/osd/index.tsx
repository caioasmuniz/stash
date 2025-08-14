import Wireplumber from "gi://AstalWp"
import AstalHyprland from "gi://AstalHyprland"
import Gtk from "gi://Gtk?version=4.0"
import Astal from "gi://Astal?version=4.0"
import { createBinding, createComputed } from "gnim"
import Brightness from "../../lib/brightness"
import Slider from "./slider"
import Popup from "./popup"

import app from "ags/gtk4/app"

export default () => {
  const brightness = Brightness.get_default()
  const audio = Wireplumber.get_default()!.audio
  const hyprland = AstalHyprland.get_default()

  const popupList: Gtk.Revealer[] = [
    <Popup
      connectable={audio.defaultSpeaker}
      signal={"notify::volume"}
      widget={Slider({
        iconName: createBinding(audio.defaultSpeaker, "volumeIcon"),
        value: createBinding(audio.defaultSpeaker, "volume")
      })} /> as Gtk.Revealer,

    <Popup
      connectable={brightness}
      signal={"notify::screen"}
      widget={Slider({
        iconName: "display-brightness-symbolic",
        value: createBinding(brightness, "screen"),
      })} /> as Gtk.Revealer,
  ];

  return <Astal.Window
    name={"osd"}
    widthRequest={250}
    application={app}
    margin={24}
    layer={Astal.Layer.OVERLAY}
    monitor={createBinding(hyprland, "focusedMonitor")(m => m.id)}
    cssClasses={["osd-popup"]}
    anchor={Astal.WindowAnchor.BOTTOM}
    visible={createComputed(
      popupList.map(p =>
        createBinding(p, "revealChild")),
      (...r: boolean[]) => r.reduce(
        (a, b) => a || b)
    )}
  >
    <Gtk.Box
      cssClasses={["linked", "background", "osd-container"]}
      orientation={Gtk.Orientation.VERTICAL}
      valign={Gtk.Align.END}
      spacing={12}
    >
      {popupList}
    </Gtk.Box>
  </Astal.Window>
}
