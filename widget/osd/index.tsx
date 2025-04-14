import Wireplumber from "gi://AstalWp"
import Hyprland from "gi://AstalHyprland"
import App from "ags/gtk4/app"
import GObject from "ags/gobject"
import { timeout } from "ags/time"
import { Astal, Gtk } from "ags/gtk4"
import { bind, Binding } from "ags/state"
import Brightness from "../../lib/brightness"
import { Slider, SliderType } from "../common/slider"

const brightness = Brightness.get_default()
const audio = Wireplumber.get_default()!.audio
const hyprland = Hyprland.get_default()

const Popup = ({ widget, observable }: {
  widget: GObject.Object,
  observable: Binding<number>,
}) =>
  <revealer
    transitionDuration={200}
    revealChild={false}
    transitionType={Gtk.RevealerTransitionType.SWING_DOWN}
    $={self =>
      observable.subscribe(() => {
        if (!self.revealChild) {
          self.revealChild = true
          timeout(1500, () =>
            self.revealChild = false)
        }
      })}>
    {widget}
  </revealer>

export default () => <window
  name={"osd"}
  visible
  widthRequest={250}
  application={App}
  monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
  cssClasses={["osd-popup"]}
  anchor={Astal.WindowAnchor.BOTTOM}>
  <box orientation={Gtk.Orientation.VERTICAL}>
    <Popup
      widget={<Slider type={SliderType.AUDIO} />}
      observable={bind(audio.defaultSpeaker, "volume")} />
    <Popup widget={<Slider type={SliderType.BRIGHTNESS} />}
      observable={bind(brightness, "screen")} />
  </box>
</window>
