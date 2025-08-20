import Wireplumber from "gi://AstalWp"
import { createBinding, createComputed } from "gnim"
import Brightness from "../../lib/brightness"
import Slider from "./slider"
import AstalHyprland from "gi://AstalHyprland"
import Popup from "./popup"
import GObject from "gnim/gobject"
import Astal from "gi://Astal?version=4.0"
import Gtk from "gi://Gtk?version=4.0"

export default ({ app, $ }: {
  app: Gtk.Application
  $: (self: Astal.Window) => void
}) => {
  const brightness = Brightness.get_default()
  const audio = Wireplumber.get_default()!.audio
  const hyprland = AstalHyprland.get_default()

  const popupList: GObject.Object[] = [
    <Popup
      connectable={audio.defaultSpeaker}
      signal={"notify::volume"}
      widget={Slider({
        iconName: createBinding(audio.defaultSpeaker, "volumeIcon"),
        value: createBinding(audio.defaultSpeaker, "volume")
      })} />,

    <Popup
      connectable={brightness}
      signal={"notify::screen"}
      widget={Slider({
        iconName: "display-brightness-symbolic",
        value: createBinding(brightness, "screen"),
      })} />,
  ];

  return <Astal.Window
    $={$}
    name={"osd"}
    widthRequest={250}
    application={app}
    margin={24}
    layer={Astal.Layer.OVERLAY}
    monitor={createBinding(hyprland, "focusedMonitor")(m => m.id && 1)}
    cssClasses={[]}
    anchor={Astal.WindowAnchor.BOTTOM}
    visible={createComputed(
      (popupList as Gtk.Revealer[])
        .map(p =>
          createBinding(p, "revealChild")),
      (...r: boolean[]) => r.reduce(
        (a, b) => a || b)
    )}>
    <Gtk.Box
      cssClasses={["linked", "toolbar", "osd"]}
      orientation={Gtk.Orientation.VERTICAL}
      valign={Gtk.Align.END}
      spacing={12}
    >
      {popupList}
    </Gtk.Box>
  </Astal.Window> as Astal.Window
}
