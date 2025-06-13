import Hyprland from "gi://AstalHyprland";
import App from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { Astal, Gtk } from "ags/gtk4";
import { createBinding, State } from "ags";

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
    if (settings.bar.position > 8)
      settings.bar.position = 2
    else
      settings.bar.position *= 2
  }}
  cssClasses={["circular"]}
>
  <image iconName={"object-rotate-right-symbolic"} />
</button>
export default ([visible, setVisible]: State<{
  applauncher: boolean,
  quicksettings: boolean
}>) => {
  return <window
    $$visible={self => {
      setVisible({
        quicksettings: self.visible,
        applauncher: self.visible &&
          (settings.bar.position === LEFT ||
            settings.bar.position === RIGHT) ?
          false :
          visible.get().applauncher
      })
    }}
    valign={Gtk.Align.FILL}
    margin={12}
    visible={visible(v => v.quicksettings)}
    application={App}
    name={"quicksettings"}
    cssClasses={["quicksettings", "background"]}
    anchor={createBinding(settings.bar, "position")(p =>
      TOP | (p === LEFT ? LEFT : RIGHT) | BOTTOM
    )}
    monitor={createBinding(hyprland, "focusedMonitor")
      (m => m.id)}>
    <box
      cssClasses={["quicksettings-body"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <Gtk.Grid rowSpacing={4} columnSpacing={4} $={(self) => {
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
        value={createBinding(brightness, "screen")
          ((v) => v * 100)}
        setValue={(value) => (
          brightness.set({ screen: value / 100 }))}
      />
      <AudioConfig />
      <MicConfig />
      <Battery />
      <Media />
      <NotificationList />
    </box>
  </window>
}
