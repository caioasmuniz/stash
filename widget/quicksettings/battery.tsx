import AstalBattery from "gi://AstalBattery";
import { Gtk } from "ags/gtk4";
import { createBinding, createComputed } from "ags";
import GLib from "gi://GLib";

const battery = AstalBattery.get_default()

const timeTo = createComputed([
  createBinding(battery, "charging"),
  createBinding(battery, "timeToEmpty"),
  createBinding(battery, "timeToFull")],
  (charging, timeToEmpty, timeToFull) =>
    charging ? timeToFull : -timeToEmpty)

export default () => <box
  cssClasses={["battery"]}
  spacing={4}
  visible={timeTo(timeTo => timeTo > 0)}
>
  <levelbar
    value={createBinding(battery, "percentage")}
    widthRequest={100}
    heightRequest={50}>
    <label label={createBinding(battery, "percentage")
      (p => `${(p * 100).toFixed(0)}%`)} />
  </levelbar>
  <box
    orientation={Gtk.Orientation.VERTICAL}
    hexpand
    valign={Gtk.Align.CENTER}>
    <label
      cssClasses={["title-4"]}
      label={"Battery Info"}
      halign={Gtk.Align.CENTER} />

    <label
      halign={Gtk.Align.START}
      label={timeTo(timeTo =>
        `${timeTo < 0 ?
          "Discharged" : "Charged"
        } in: ${GLib.DateTime
          .new_from_unix_utc(timeTo)
          .format("%kh %Mm %Ss")}`)}
    />
    <label
      halign={Gtk.Align.START}
      label={createBinding(battery, "energyRate")(rate =>
        `Rate of ${battery.get_charging() ?
          "Charge" : "discharge"}: ${rate.toFixed(2)}W`)}
    />
    <label
      halign={Gtk.Align.START}
      label={createBinding(battery, "energy")(energy =>
        `Energy: ${energy.toFixed(2)}/${battery.energyFull.toFixed(0)}Wh`)}
    />
  </box>
</box>

