import AstalBattery from "gi://AstalBattery";
import GLib from "gi://GLib";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding, createComputed } from "gnim";

const battery = AstalBattery.get_default()

const timeTo = createComputed([
  createBinding(battery, "charging"),
  createBinding(battery, "timeToEmpty"),
  createBinding(battery, "timeToFull")],
  (charging, timeToEmpty, timeToFull) =>
    charging ? timeToFull : -timeToEmpty)

export default () => <Gtk.Box
  orientation={Gtk.Orientation.VERTICAL}
  cssClasses={["card"]}
  spacing={4}
  visible={timeTo(timeTo => Math.abs(timeTo) > 0)}
>
  <Gtk.Label
    cssClasses={["title-3"]}
    label={"Battery Info"}
    halign={Gtk.Align.CENTER}
  />
  <Gtk.Label
    halign={Gtk.Align.START}
    label={timeTo(timeTo =>
      `${timeTo < 0 ?
        "Discharged" : "Charged"
      } in: ${GLib.DateTime
        .new_from_unix_utc(timeTo)
        .format("%kh %Mm %Ss")}`
    )}
  />
  <Gtk.Label
    halign={Gtk.Align.START}
    label={createBinding(battery, "energyRate")(rate =>
      `Rate of ${battery.get_charging() ?
        "Charge" : "discharge"}: ${rate.toFixed(2)}W`)}
  />
  <Gtk.Label
    halign={Gtk.Align.START}
    label={createBinding(battery, "energy")(energy =>
      `Energy: ${energy.toFixed(2)}/${battery.energyFull.toFixed(0)}Wh`)}
  />
  <Gtk.LevelBar
    value={createBinding(battery, "percentage")}
    widthRequest={100}
    heightRequest={50}>
    <Gtk.Label label={createBinding(battery, "percentage")
      .as(p => `${(p * 100).toFixed(0)}%`)} />
  </Gtk.LevelBar>
</Gtk.Box>

