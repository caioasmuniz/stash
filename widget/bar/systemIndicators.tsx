import Bluetooth from "gi://AstalBluetooth"
import Notifd from "gi://AstalNotifd"
import Network from "gi://AstalNetwork"
import Batery from "gi://AstalBattery"
import Wireplumber from "gi://AstalWp"
import PowerProf from "gi://AstalPowerProfiles"
import Gdk from "gi://Gdk?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import { createBinding, createComputed } from "gnim"

import App from "ags/gtk4/app"

const audio = Wireplumber.get_default()!.audio
const battery = Batery.get_default()
const network = Network.get_default()
const powerprof = PowerProf.get_default()
const notifd = Notifd.get_default()
const bluetooth = Bluetooth.get_default()

const ProfileIndicator = () => <Gtk.Image
  visible={createBinding(powerprof, "activeProfile")
    (p => p !== "balanced")}
  iconName={createBinding(powerprof, "iconName")}
  tooltipMarkup={createBinding(powerprof, "active_profile")
    (String)} />

const DNDIndicator = () => <Gtk.Image
  visible={createBinding(notifd, "dontDisturb")}
  iconName="notifications-disabled-symbolic" />

const BluetoothIndicator = () => <Gtk.Image
  iconName="bluetooth-active-symbolic"
  visible={createBinding(bluetooth, "adapter")
    .as(adapter => adapter && adapter.powered)
  } />

const NetworkIndicator = () => {
  const icon = createComputed([
    createBinding(network, "primary"),
    createBinding(network, "wifi"),
    createBinding(network, "wired")],
    (primary, wifi, wired) =>
      primary === Network.Primary.WIFI ?
        wifi.iconName : wired.iconName)
  return <image
    iconName={icon}
    visible={createBinding(network, "primary")
      (p => p !== Network.Primary.UNKNOWN)} />
}

const AudioIndicator = () => <Gtk.Image
  iconName={createBinding(audio.default_speaker, "volume_icon")}
  tooltipMarkup={createBinding(audio.default_speaker, "volume")
    (v => "Volume: " + (v * 100).toFixed(0).toString() + "%")} />

const MicrophoneIndicator = () => <Gtk.Image
  visible={createBinding(audio, "recorders")
    (rec => rec.length > 0)}
  iconName={createBinding(audio.default_microphone, "volume_icon")}
  tooltipMarkup={createBinding(audio.default_microphone, "volume")
    (v => (v * 100).toFixed(0).toString() + "%")} />

const BatteryIndicator = () => <Gtk.Image
  visible={createBinding(battery, "is_present")}
  iconName={createBinding(battery, "batteryIconName")}
  tooltipMarkup={createBinding(battery, "percentage")
    ((p) => (p * 100).toFixed(0).toString() + "%")} />


export default ({ vertical }: { vertical: Accessor<boolean> }) =>
  <Gtk.ToggleButton
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={vertical.as(v =>
      ["pill", "sys-indicators", v ? "vert" : ""])}
    active={createBinding(App.get_window("quicksettings")!, "visible")}
    onClicked={() => App.toggle_window("quicksettings")}
    $={self => self.add_controller(
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(self, dx, dy) => {
          dy > 0 ?
            audio.default_speaker.volume -= 0.025 :
            audio.default_speaker.volume += 0.025
        }}
      /> as Gtk.EventController)}>
    <Gtk.Box
      spacing={4}
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}>
      <ProfileIndicator />
      <BluetoothIndicator />
      <NetworkIndicator />
      <BatteryIndicator />
      <MicrophoneIndicator />
      <AudioIndicator />
      <DNDIndicator />
    </Gtk.Box>
  </Gtk.ToggleButton>