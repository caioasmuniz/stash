import Hyprland from "gi://AstalHyprland"
import { App, Astal, Gtk } from "astal/gtk4";
import { bind, execAsync, Variable } from "astal";

const hyprland = Hyprland.get_default()
import { Slider, SliderType } from "../common/slider";
import NotificationList from "./notificationList";
import PwrProf from "./powerprofiles";
import DarkMode from "./darkMode";
import Tray from "./tray";
import AudioConfig from "./audioConfig";

const Lock = () => <button
  cssClasses={["circular"]}
  onClicked={() => {
    execAsync(["bash", "-c", "hyprlock --immediate"]);
  }}>
  <image iconName={"system-lock-screen-symbolic"} />
</button>

const Poweroff = () => <button
  cssClasses={["circular","destructive-action"]}
  onClicked={() => {
    execAsync(["bash", "-c", "systemctl poweroff"]);
  }}>
  <image iconName={"system-shutdown-symbolic"} />
</button>

const RotateButton = ({ vertical }:
  { vertical: Variable<boolean> }) => <button
    onClicked={() => vertical.set(!vertical.get())}
    cssClasses={["circular"]}
  >
    <image iconName={"object-rotate-right-symbolic"} />
  </button>

export default (vertical: Variable<boolean>) => <window
  valign={Gtk.Align.CENTER}
  margin={12}
  visible={false}
  application={App}
  name={"quicksettings"}
  cssClasses={["quicksettings", "background"]}
  keymode={Astal.Keymode.EXCLUSIVE}
  anchor={bind(vertical).as(vertical => vertical ?
    Astal.WindowAnchor.LEFT |
    Astal.WindowAnchor.BOTTOM :
    Astal.WindowAnchor.RIGHT |
    Astal.WindowAnchor.TOP
  )}
  monitor={bind(hyprland, "focusedMonitor")
    .as(m => m.id)}>
  <box
    cssClasses={["quicksettings-body"]}
    vertical
    spacing={8}>
    <box spacing={4}>
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
    <NotificationList />
  </box>
</ window >

