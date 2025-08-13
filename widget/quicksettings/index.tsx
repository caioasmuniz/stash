import Hyprland from "gi://AstalHyprland"
import App from "ags/gtk4/app";
import { execAsync } from "ags/process";
import { Astal, Gtk } from "ags/gtk4";
import { Accessor, createBinding, State } from "ags";

import { Slider } from "../common/slider";
import NotificationList from "./notificationList";
import PwrProf from "./powerprofiles";
import DarkMode from "./darkMode";
import Tray from "./tray";
import { AudioConfig, MicConfig } from "./audioConfig";
import Media from "./media";
import Battery from "./battery";
import Bluetooth from "./bluetooth";

import Brightness from "../../lib/brightness";
import { useSettings } from "../../lib/settings";

export default ([visible, setVisible]: State<{
  applauncher: boolean,
  quicksettings: boolean
}>) => {
  const brightness = Brightness.get_default();

  const barCfg = useSettings().bar
  const hyprland = Hyprland.get_default()
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const Lock = () => (
    <Gtk.Button
      cssClasses={["circular"]}
      onClicked={() => {
        execAsync(["bash", "-c", "hyprlock --immediate"]);
      }}
    >
      <image iconName={"system-lock-screen-symbolic"} />
    </Gtk.Button>
  );

  const Poweroff = () => (
    <button
      cssClasses={["circular", "destructive-action"]}
      onClicked={() => {
        execAsync(["bash", "-c", "systemctl poweroff"]);
      }}
    >
      <image iconName={"system-shutdown-symbolic"} />
    </button>
  );

  const RotateButton = () => <button
    onClicked={() => {
      if ((barCfg.position as Accessor<any>).get() > 8)
        barCfg.setPosition(2)
      else
        barCfg.setPosition(
          (barCfg.position as Accessor<any>).get() * 2)
    }}
    cssClasses={["circular"]}
  >
    <image iconName={"object-rotate-right-symbolic"} />
  </button>

  const SettingsButton = () => <button
    cssClasses={["circular"]}
    onClicked={() => {
      App.get_window("settings")!.visible = true;
      App.get_window("quicksettings")!.visible = false;
    }}>
    <image iconName={"preferences-system-symbolic"} />
  </button>

  return <window
    onNotifyVisible={self => {
      setVisible({
        quicksettings: self.visible,
        applauncher: self.visible &&
          (barCfg.position.get() === LEFT ||
            barCfg.position.get() === RIGHT) ?
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
    anchor={barCfg.position.as(p =>
      TOP | (p === LEFT ? LEFT : RIGHT) | BOTTOM
    )}
    monitor={createBinding(hyprland, "focusedMonitor")
      (m => m.id)}>
    <box
      cssClasses={["quicksettings-body"]}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <Gtk.Grid rowSpacing={4} columnSpacing={4}
        $={(self) => {
          self.attach(<PwrProf /> as Gtk.Widget, 0, 0, 1, 1)
          self.attach(<DarkMode /> as Gtk.Widget, 1, 0, 1, 1)
          self.attach(<Bluetooth /> as Gtk.Widget, 0, 1, 1, 1)
        }}>
      </Gtk.Grid>
      <box halign={Gtk.Align.CENTER} spacing={8}>
        <Tray />
        <Lock />
        <SettingsButton />
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
