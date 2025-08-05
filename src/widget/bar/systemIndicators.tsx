import Bluetooth from "gi://AstalBluetooth"
import Notifd from "gi://AstalNotifd"
import Network from "gi://AstalNetwork"
import Batery from "gi://AstalBattery"
import Wireplumber from "gi://AstalWp"
import PowerProf from "gi://AstalPowerProfiles"
import { createBinding } from "ags"
import { Gtk, Gdk } from "ags/gtk4"
import App from "ags/gtk4/app"

const audio = Wireplumber.get_default()!.audio
const battery = Batery.get_default()
const network = Network.get_default()
const powerprof = PowerProf.get_default()
const notifd = Notifd.get_default()
const bluetooth = Bluetooth.get_default()

const ProfileIndicator = () => <image
  visible={createBinding(powerprof, "activeProfile")
    (p => p !== "balanced")}
  iconName={createBinding(powerprof, "iconName")}
  tooltipMarkup={createBinding(powerprof, "active_profile")
    (String)} />

const DNDIndicator = () => <image
  visible={createBinding(notifd, "dontDisturb")}
  iconName="notifications-disabled-symbolic" />

const BluetoothIndicator = () => <image
  iconName="bluetooth-active-symbolic"
  visible={createBinding(bluetooth.adapter, "powered")} />

const NetworkIndicator = () => <image
  iconName={createBinding(network, "primary")(primary =>
    network[(primary === Network.Primary.WIRED ?
      "wired" : "wifi")].iconName)}
  visible={createBinding(network, "primary")
    (p => p !== Network.Primary.UNKNOWN)} />

const AudioIndicator = () => <image
  iconName={createBinding(audio.default_speaker, "volume_icon")}
  tooltipMarkup={createBinding(audio.default_speaker, "volume")
    (v => "Volume: " + (v * 100).toFixed(0).toString() + "%")} />

const MicrophoneIndicator = () => <image
  visible={createBinding(audio, "recorders")
    (rec => rec.length > 0)}
  iconName={createBinding(audio.default_microphone, "volume_icon")}
  tooltipMarkup={createBinding(audio.default_microphone, "volume")
    (v => (v * 100).toFixed(0).toString() + "%")} />

const BatteryIndicator = () => <image
  visible={createBinding(battery, "is_present")}
  iconName={createBinding(battery, "batteryIconName")}
  tooltipMarkup={createBinding(battery, "percentage")
    ((p) => (p * 100).toFixed(0).toString() + "%")} />


export default ({ vertical }: { vertical: boolean }) =>
  <Gtk.ToggleButton
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={["pill", "sys-indicators", vertical ? "vert" : ""]}
    active={createBinding(App.get_window("quicksettings")!, "visible")}
    onClicked={() => App.toggle_window("quicksettings")}
    $={self => self.add_controller(
      <Gtk.EventControllerScroll
        flags={Gtk.EventControllerScrollFlags.VERTICAL}
        onScroll={(self, dx, dy) => dy > 0 ?
          audio.default_speaker.volume -= 0.025 :
          audio.default_speaker.volume += 0.025}
      /> as Gtk.EventController)}>
    <box
      spacing={4}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}>
      <ProfileIndicator />
      <BluetoothIndicator />
      <NetworkIndicator />
      <BatteryIndicator />
      <MicrophoneIndicator />
      <AudioIndicator />
      <DNDIndicator />
    </box>
  </Gtk.ToggleButton>