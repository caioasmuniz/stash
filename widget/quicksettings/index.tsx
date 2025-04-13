import Hyprland from "gi://AstalHyprland"
import App from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { Astal, Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";

import { Slider, SliderType } from "../common/slider";
import NotificationList from "./notificationList";
import PwrProf from "./powerprofiles";
import DarkMode from "./darkMode";
import Tray from "./tray";
import AudioConfig from "./audioConfig";
import Media from "./media";

const hyprland = Hyprland.get_default()

const Lock = () => <button
  cssClasses={["circular"]}
  $clicked={() => {
    execAsync(["bash", "-c", "hyprlock --immediate"]);
  }}>
  <image iconName={"system-lock-screen-symbolic"} />
</button>

const Poweroff = () => <button
  cssClasses={["circular", "destructive-action"]}
  $clicked={() => {
    execAsync(["bash", "-c", "systemctl poweroff"]);
  }}>
  <image iconName={"system-shutdown-symbolic"} />
</button>

const RotateButton = ({ vertical }:
  { vertical: State<boolean> }) => <button
    $clicked={() => vertical.set(!vertical.get())}
    cssClasses={["circular"]}
  >
    <image iconName={"object-rotate-right-symbolic"} />
  </button>

export default (vertical: State<boolean>) => <window
  valign={Gtk.Align.FILL}
  margin={12}
  visible={false}
  application={App}
  name={"quicksettings"}
  cssClasses={["quicksettings", "background"]}
  // keymode={Astal.Keymode.EXCLUSIVE}
  anchor={bind(vertical).as(vertical =>
    Astal.WindowAnchor.BOTTOM |
    Astal.WindowAnchor.TOP |
    (vertical ?
      Astal.WindowAnchor.LEFT :
      Astal.WindowAnchor.RIGHT)
  )}
  monitor={bind(hyprland, "focusedMonitor")
    .as(m => m.id)}>
  <box
    cssClasses={["quicksettings-body"]}
    orientation={Gtk.Orientation.VERTICAL}
    spacing={8}>
    <box spacing={8}>
      <PwrProf />
      <DarkMode />
    </box>
    <box halign={Gtk.Align.CENTER} spacing={8}>
      <Tray />
      <Lock />
      <RotateButton vertical={vertical} />
      <Poweroff />
    </box>
    <Slider type={SliderType.BRIGHTNESS} />
    <AudioConfig />
    <Media />
    <NotificationList />
  </box>
</ window >

