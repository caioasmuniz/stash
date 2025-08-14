import { createBinding, createComputed } from "gnim"
import Adw from "gi://Adw?version=1"
import AstalNetwork from "gi://AstalNetwork?version=0.1"
import NetworkPage from "../settings/network"
import Gtk from "gi://Gtk?version=4.0"

const network = AstalNetwork.get_default()
const primary = createComputed([
  createBinding(network, "wifi"),
  createBinding(network, "wired"),
  createBinding(network, "primary")
], (wifi, wired, primary) =>
  primary === AstalNetwork.Primary.WIRED ?
    wired : wifi)

export default () => <Adw.SplitButton
  widthRequest={150}
  popover={
    <Gtk.Popover hexpand
      widthRequest={300}>
      <NetworkPage />
    </ Gtk.Popover> as Gtk.Popover}>
  <Adw.ButtonContent
    iconName={primary.as(p => p.iconName)}
    label={primary.as(p =>
      p instanceof AstalNetwork.Wifi ?
        (p as AstalNetwork.Wifi).ssid :
        (p as AstalNetwork.Wired).device.interface
    )} />
</Adw.SplitButton>
