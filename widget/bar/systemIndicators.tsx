import Bluetooth from "gi://AstalBluetooth"
import Notifd from "gi://AstalNotifd"
import Network from "gi://AstalNetwork"
import Batery from "gi://AstalBattery"
import Wireplumber from "gi://AstalWp"
import PowerProf from "gi://AstalPowerProfiles"
import { bind } from "ags/state"
import { Gtk, Gdk } from "ags/gtk4"
import App from "ags/gtk4/app"

const audio = Wireplumber.get_default()!.audio
const battery = Batery.get_default()
const network = Network.get_default()
const powerprof = PowerProf.get_default()
const notifd = Notifd.get_default()
const bluetooth = Bluetooth.get_default()

const ProfileIndicator = () => <image
  visible={bind(powerprof, "activeProfile")
    .as(p => p !== "balanced")}
  iconName={bind(powerprof, "iconName")}
  tooltipMarkup={bind(powerprof, "active_profile").as(String)} />

const DNDIndicator = () => <image
  visible={bind(notifd, "dontDisturb")}
  iconName="notifications-disabled-symbolic" />

const BluetoothIndicator = () => <image
  iconName="bluetooth-active-symbolic"
  visible={bind(bluetooth.adapter, "powered")} />

const NetworkIndicator = () => <image
  iconName={bind(network, "primary").as(primary =>
    network[(primary === Network.Primary.WIRED ?
      "wired" : "wifi")].iconName)}
  visible={bind(network, "primary")
    .as(p => p !== Network.Primary.UNKNOWN)} />

const AudioIndicator = () => <image
  iconName={bind(audio.default_speaker, "volume_icon")}
  tooltipMarkup={bind(audio.default_speaker, "volume")
    .as(v => "Volume: " + (v * 100).toFixed(0).toString() + "%")} />

const MicrophoneIndicator = () => <image
  visible={bind(audio, "recorders").as(rec => rec.length > 0)}
  iconName={bind(audio.default_microphone, "volume_icon")}
  tooltipMarkup={bind(audio.default_microphone, "volume")
    .as(v => (v * 100).toFixed(0).toString() + "%")} />

const BatteryIndicator = () => <image
  visible={bind(battery, "is_present")}
  iconName={bind(battery, "batteryIconName")}
  tooltipMarkup={bind(battery, "percentage")
    .as((p) => (p * 100).toFixed(0).toString() + "%")} />


export default ({ vertical }: { vertical: boolean }) =>
  <Gtk.ToggleButton
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={["pill", "sys-indicators", vertical ? "vert" : ""]}
    active={bind(App.get_window("quicksettings")!, "visible")}
    $clicked={() => App.toggle_window("quicksettings")}
  // $scroll={(self, dx, dy) => dy > 0 ?
  // audio.default_speaker.volume -= 0.025 :
  // audio.default_speaker.volume += 0.025}
  >
    <box
      spacing={4}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}>
      {ProfileIndicator()}
      {BluetoothIndicator()}
      {NetworkIndicator()}
      {BatteryIndicator()}
      {MicrophoneIndicator()}
      {AudioIndicator()}
      {DNDIndicator()}
    </box>
  </Gtk.ToggleButton>
