import AstalBluetooth from "gi://AstalBluetooth"
import { bind } from "ags/state"
import { For, Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"

const bluetooth = AstalBluetooth.get_default()

print(bluetooth.devices)

export default () => <Adw.SplitButton
  widthRequest={150}
  $={self => {
    self.connect("clicked", () => {
      bluetooth.adapter.powered = !bluetooth.adapter.powered
    })
    self.connect("activate",() => {
      bluetooth.adapter.discoverable = true})
  }}
  popover={
    <popover>
      <box cssClasses={["linked"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <For each={bind(bluetooth, "devices")}>
          {(device) => (
            <button $clicked={() => device.connected ? device.disconnect_device((_, res) => {
              try {
                device.disconnect_device_finish(res);
              } catch (e) {
                print(e);
              } 
            }) : device.connect_device((_, res) => {
              try {
                device.connect_device_finish(res)
              } catch (e) {
                print(e);
              }
            })}>
              <Adw.ButtonContent
                cssClasses={bind(device, 'connected').as(connected => connected ? ["connected"] : [])}
                iconName={device.icon}
                label={device.name} />
            </button>
          )}
        </For>
      </box>
    </ popover> as Gtk.Popover}>
  <Adw.ButtonContent
    iconName={bind(bluetooth, "isPowered").as(isPowered => isPowered ? "bluetooth-symbolic" : "bluetooth-disabled-symbolic")}
    label={bind(bluetooth, "isPowered").as(isPowered => isPowered ? "Bluetooth" : "Bluetooth Off")} />
</Adw.SplitButton>
