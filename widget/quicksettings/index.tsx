import Hyprland from "gi://AstalHyprland";
import App from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { Astal, Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";

import { Slider } from "../common/slider";
import NotificationList from "./notificationList";
import PwrProf from "./powerprofiles";
import DarkMode from "./darkMode";
import Tray from "./tray";
import { AudioConfig, MicConfig } from "./audioConfig";
import Media from "./media";
import Battery from "./battery";
import Bluetooth from "./bluetooth";

import Settings from "../../lib/settings";


import Brightness from "../../lib/brightness";

const brightness = Brightness.get_default();

const settings = Settings.get_default()
const hyprland = Hyprland.get_default()
const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

const Lock = () => (
  <button
    cssClasses={["circular"]}
    $clicked={() => {
      execAsync(["bash", "-c", "hyprlock --immediate"]);
    }}
  >
    <image iconName={"system-lock-screen-symbolic"} />
  </button>
);

const Poweroff = () => (
  <button
    cssClasses={["circular", "destructive-action"]}
    $clicked={() => {
      execAsync(["bash", "-c", "systemctl poweroff"]);
    }}
  >
    <image iconName={"system-shutdown-symbolic"} />
  </button>
);

const RotateButton = () => <button
  $clicked={() => {
    if (settings.barPosition > 8)
      settings.barPosition = 2
    else
      settings.barPosition *= 2
  }}
  cssClasses={["circular"]}
>
  <image iconName={"object-rotate-right-symbolic"} />
</button>
export default (visible: State<{
  applauncher: boolean,
  quicksettings: boolean
}>) => <window
  $$visible={self => {
    visible.set({
      quicksettings: self.visible,
      applauncher: self.visible &&
        (settings.barPosition === LEFT ||
          settings.barPosition === RIGHT) ?
        false :
        visible.get().applauncher
    })
  }}
  valign={Gtk.Align.FILL}
  margin={12}
  visible={bind(visible).as(v => v.quicksettings)}
  application={App}
  name={"quicksettings"}
  cssClasses={["quicksettings", "background"]}
  anchor={bind(settings, "barPosition").as(p =>
    TOP | (p === LEFT ? LEFT : RIGHT) | BOTTOM
  )}
  monitor={bind(hyprland, "focusedMonitor")
    .as(m => m.id)}>
    <box
      cssClasses={["quicksettings-body"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <Gtk.Grid rowSpacing={2} columnSpacing={2} $={(self) => {
        self.attach(<PwrProf /> as Gtk.Widget, 0, 0, 1, 1)
        self.attach(<DarkMode /> as Gtk.Widget, 1, 0, 1, 1)
        self.attach(<Bluetooth /> as Gtk.Widget, 0, 1, 1, 1)
      }}>
      </Gtk.Grid>
      <box halign={Gtk.Align.CENTER} spacing={8}>
        <Tray />
        <Lock />
        <RotateButton />
        <Poweroff />
      </box>
      <Slider
        icon={"display-brightness-symbolic"}
        min={0}
        max={100}
        value={bind(brightness, "screen").as((v) => v * 100)}
        setValue={(value) => (brightness.set({ screen: value / 100 }))}
      />
      <AudioConfig />
      <MicConfig />
      <Battery />
      <Media />
      <NotificationList />
    </box>
  </window>
