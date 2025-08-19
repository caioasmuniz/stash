import Hyprland from "gi://AstalHyprland"
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import AstalIO from "gi://AstalIO?version=0.1";
import { Accessor, createBinding, State } from "gnim";
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

import App from "ags/gtk4/app";

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
        AstalIO.Process.exec_asyncv(["bash", "-c", "hyprlock --immediate"]);
      }}
    >
      <Gtk.Image iconName={"system-lock-screen-symbolic"} />
    </Gtk.Button>
  );

  const Poweroff = () => (
    <Gtk.Button
      cssClasses={["circular", "destructive-action"]}
      onClicked={() => {
        AstalIO.Process.exec_asyncv(["bash", "-c", "systemctl poweroff"]);
      }}
    >
      <Gtk.Image iconName={"system-shutdown-symbolic"} />
    </Gtk.Button>
  );

  const RotateButton = () => <Gtk.Button
    onClicked={() => {
      if ((barCfg.position as Accessor<any>).get() > 8)
        barCfg.setPosition(2)
      else
        barCfg.setPosition(
          (barCfg.position as Accessor<any>).get() * 2)
    }}
    cssClasses={["circular"]}
  >
    <Gtk.Image iconName={"object-rotate-right-symbolic"} />
  </Gtk.Button>

  const SettingsButton = () => <Gtk.Button
    cssClasses={["circular"]}
    onClicked={() => {
      // App.get_window("settings")!.visible = true;
      // App.get_window("quicksettings")!.visible = false;
    }}>
    <Gtk.Image iconName={"preferences-system-symbolic"} />
  </Gtk.Button>

  return <Astal.Window
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
    <Gtk.Box
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
      <Gtk.Box halign={Gtk.Align.CENTER} spacing={8}>
        <Tray />
        <Lock />
        <SettingsButton />
        <RotateButton />
        <Poweroff />
      </Gtk.Box>
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
    </Gtk.Box>
  </Astal.Window>
}
