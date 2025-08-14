import AstalBluetooth from "gi://AstalBluetooth"
import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import { createBinding, For } from "gnim"

const bluetooth = AstalBluetooth.get_default()

print(bluetooth.devices)

export default () => <Adw.SplitButton
  widthRequest={150}
  $={self => {
    self.connect("clicked", () => {
      bluetooth.adapter.powered = !bluetooth.adapter.powered
    })
    self.connect("activate", () => {
      bluetooth.adapter.discoverable = true
    })
  }}
  popover={
    <popover>
      <Gtk.Box cssClasses={["linked"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <For each={createBinding(bluetooth, "devices")}>
          {(device: AstalBluetooth.Device) => (
            <Gtk.Button onClicked={() => device.connected ? device.disconnect_device((_, res) => {
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
                cssClasses={createBinding(device, 'connected')
                  (connected => connected ? ["connected"] : [])}
                iconName={device.icon}
                label={device.name} />
            </Gtk.Button>
          )}
        </For>
      </Gtk.Box>
    </ popover> as Gtk.Popover}>
  <Adw.ButtonContent
    iconName={createBinding(bluetooth, "isPowered")
      (isPowered => isPowered ?
        "bluetooth-symbolic" :
        "bluetooth-disabled-symbolic"
      )}
    label={createBinding(bluetooth, "isPowered")
      (isPowered => isPowered ? "Bluetooth" : "Bluetooth Off")} />
</Adw.SplitButton>
