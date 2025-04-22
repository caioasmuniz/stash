import AstalBattery from "gi://AstalBattery";
import { Gtk } from "ags/gtk4";
import { bind, derive } from "ags/state";
import GLib from "gi://GLib";

const battery = AstalBattery.get_default()

const timeTo = derive([
  bind(battery, "charging"),
  bind(battery, "timeToEmpty"),
  bind(battery, "timeToFull")],
  (charging, timeToEmpty, timeToFull) =>
    charging ? timeToFull : -timeToEmpty)

export default () => <box
  cssClasses={["battery"]}
  spacing={4}
  visible={bind(timeTo).as(timeTo => timeTo > 0)}
>
  <levelbar
    value={bind(battery, "percentage")}
    widthRequest={100}
    heightRequest={50}>
    <label label={bind(battery, "percentage")
      .as(p => `${(p * 100).toFixed(0)}%`)} />
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
      label={bind(timeTo).as(timeTo =>
        `${timeTo < 0 ?
          "Discharged" : "Charged"
        } in: ${GLib.DateTime
          .new_from_unix_utc(timeTo)
          .format("%kh %Mm %Ss")}`)}
    />
    <label
      halign={Gtk.Align.START}
      label={bind(battery, "energyRate").as(rate =>
        `Rate of ${battery.get_charging() ?
          "Charge" : "discharge"}: ${rate.toFixed(2)}W`)}
    />
    <label
      halign={Gtk.Align.START}
      label={bind(battery, "energy").as(energy =>
        `Energy: ${energy.toFixed(2)}/${battery.energyFull.toFixed(0)}Wh`)}
    />
  </box>
</box>

