import Hyprland from "gi://AstalHyprland"
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import AstalIO from "gi://AstalIO?version=0.1";
import { Accessor, createBinding } from "gnim";
import { Slider } from "../common/slider";
import NotificationList from "./notificationList";
import PwrProf from "./powerprofiles";
import DarkMode from "./darkMode";
import Tray from "./tray";
import { AudioConfig, MicConfig } from "./audioConfig";
import { Media, MediaIcon } from "./media";
import { Battery, BatteryIcon } from "./battery";
import Bluetooth from "./bluetooth";
import Brightness from "../../lib/brightness";
import { useSettings } from "../../lib/settings";
import { App } from "App";
import Adw from "@girs/adw-1";
import { Calendar, CalendarIcon } from "./calendar";

export default ({ app, $ }: {
  app: App
  $?: (self: Astal.Window) => void
}) => {
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
      app.settings.visible = true;
      app.quicksettings.visible = false;
    }}>
    <Gtk.Image iconName={"preferences-system-symbolic"} />
  </Gtk.Button>

  return <Astal.Window
    $={$}
    margin={12}
    application={app}
    name={"quicksettings"}
    cssClasses={["osd", "toolbar"]}
    anchor={barCfg.position.as(p =>
      TOP | (p === LEFT ? LEFT : RIGHT) | BOTTOM
    )}
    monitor={createBinding(hyprland, "focusedMonitor")
      .as(m => m.id)}>
    <Gtk.ScrolledWindow
      propagateNaturalHeight
      hscrollbarPolicy={Gtk.PolicyType.NEVER}
      vexpand>
      <Gtk.Box
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
            .as((v) => v * 100)}
          setValue={(value) => (
            brightness.set({ screen: value / 100 }))}
        />
        <AudioConfig />
        <MicConfig />
        <Adw.ExpanderRow>
          <Gtk.Box
            $type="prefix"
            spacing={8}
          >
            <BatteryIcon />
            <MediaIcon />
            <CalendarIcon />
          </Gtk.Box>
          <Battery />
          <Media />
          <Calendar />
        </Adw.ExpanderRow>
        <NotificationList />
      </Gtk.Box>
    </Gtk.ScrolledWindow>
  </Astal.Window>
}
