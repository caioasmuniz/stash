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
import Battery from "./battery";
import Settings from "../../lib/settings";

const settings = Settings.get_default()
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

const RotateButton = () => <button
  $clicked={() =>
    settings.barOrientation === Gtk.Orientation.VERTICAL ?
      settings.barOrientation = Gtk.Orientation.HORIZONTAL :
      settings.barOrientation = Gtk.Orientation.VERTICAL
  }
  cssClasses={["circular"]}
>
  <image iconName={"object-rotate-right-symbolic"} />
</button>

const SettingsButton = () => <button
  cssClasses={["circular"]}
  $clicked={() => {
    App.get_window("settings")!.visible = true;
  }}>
  <image iconName={"preferences-system-symbolic"} />
</button>

export default (visible: State<{
  applauncher: boolean,
  quicksettings: boolean
}>) => <window
  $={self =>
    bind(self, "visible").subscribe(v => {
      visible.set({
        applauncher: v ? false : visible.get().applauncher,
        quicksettings: v
      })
    })
  }
  valign={Gtk.Align.FILL}
  margin={12}
  visible={bind(visible).as(v => v.quicksettings)}
  application={App}
  name={"quicksettings"}
  cssClasses={["quicksettings", "background"]}
  anchor={bind(settings, "barOrientation")
    .as(orientation =>
      Astal.WindowAnchor.BOTTOM |
      Astal.WindowAnchor.TOP |
      (orientation === Gtk.Orientation.VERTICAL ?
        Astal.WindowAnchor.LEFT :
        Astal.WindowAnchor.RIGHT)
    )
  }
  monitor={
    bind(hyprland, "focusedMonitor")
      .as(m => m.id)
  } >
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
        <SettingsButton />
        <RotateButton />
        <Poweroff />
      </box>
      <Slider type={SliderType.BRIGHTNESS} />
      <AudioConfig />
      <Battery />
      <Media />
      <NotificationList />
    </box>
  </ window >

