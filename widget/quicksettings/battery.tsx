import AstalBattery from "gi://AstalBattery";
import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";

const battery = AstalBattery.get_default()


function lengthStr(length: number) {
  const hours = Math.floor(length / 3600);
  const min = Math.floor(length % 3600 / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${hours}h ${min}m ${sec0}${sec}s`;
}

const timeTo = Variable.derive([
  bind(battery, "charging"),
  bind(battery, "timeToEmpty"),
  bind(battery, "timeToFull")],
  (charging, timeToEmpty, timeToFull) =>
    charging ? timeToFull : -timeToEmpty)

export default () => <box
  spacing={4}
// css={`
// border-radius:12px;
// background:@theme_bg_color;
// padding:4px;
// border:1px solid @borders;`}
>
  <levelbar
    value={bind(battery, "percentage")}
    widthRequest={100}
    heightRequest={50}
  // css={"color:@theme_text_color;min-width:100px;"}
  >
    <label
      label={bind(battery, "percentage")
        .as(p => `${(p * 100).toFixed(0)}%`)}
    // css={`
    //   color:@theme_text_color;
    //   font-weight:bold;
    //   font-size:100%;`}
    />
  </levelbar>
  <box vertical hexpand valign={Gtk.Align.CENTER}>
    <label label={"Battery Info"} halign={Gtk.Align.CENTER}
    // css={`color:@theme_text_color;font-weight:bold;font-size:2em;`} 
    />

    <label halign={Gtk.Align.START} label={bind(timeTo).as(timeTo =>
      `${timeTo < 0 ? "Discharged" : "Charged"} in: ${lengthStr(Math.abs(timeTo))}`)}
    // css={`color:@theme_text_color;font-weight:bold;`} 
    />

    <label halign={Gtk.Align.START} label={bind(battery, "energyRate").as(rate =>
      `Rate of ${battery.get_charging() ? "Charge" : "discharge"}: ${rate.toFixed(2)}W`)}
    // css={`color:@theme_text_color;font-weight:bold;`} 
    />
    <label halign={Gtk.Align.START} label={bind(battery, "energy").as(energy =>
      `Energy: ${energy.toPrecision(2)}/${battery.energyFull}Wh`)}
    // css={`color:@theme_text_color;font-weight:bold;`}
    />
  </box>
</box>

