import Hyprland from "gi://AstalHyprland"
import { App, Astal, Gtk } from "astal/gtk4";
import { bind, Variable } from "astal";

const hyprland = Hyprland.get_default()
import Media from "./media";
import Battery from "./battery"

const Title = () =>
  <box halign={Gtk.Align.CENTER}>
    <label label={"Info Pannel"} />
  </box>

export default (vertical: Variable<boolean>) => <window
  name="infopannel"
  // cssClasses={["infopannel"]}
  application={App}
  keymode={Astal.Keymode.ON_DEMAND}
  margin={12} visible={false}
  anchor={bind(vertical).as(vertical => vertical ?
    Astal.WindowAnchor.LEFT :
    Astal.WindowAnchor.TOP)}
  monitor={bind(hyprland, "focusedMonitor")
    .as(m => m.id)}>
  <box vertical spacing={8}>
    <box spacing={8}>
      <Gtk.Calendar />
      <box vertical spacing={8}>
        <Title />
        <Battery />
      </box>
    </box>
    <Media />
  </box>
</ window >

