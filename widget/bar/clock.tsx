import { Variable, GLib, bind } from "astal"
import { App, Gtk } from "astal/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import { ToggleButton } from "../../lib/astalified"

export default ({ vertical }: { vertical: boolean }) => {
  const day = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().get_day_of_month().toString())
  const month = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format("%b")!)
  const hour = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format("%H")!)
  const minute = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format("%M")!)

  return <ToggleButton
    hexpand={vertical}
    cssClasses={["pill", "clock", vertical ? "vert" : ""]}
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    active={bind(App.get_window("infopannel")!, "visible")}
    onClicked={() => App.toggle_window("infopannel")}>
    <box
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      vertical={vertical}
      spacing={vertical ? 0 : 4}>
      <box
        vertical={vertical}
        spacing={vertical ? 0 : 4}>
        <label
          label={hour()}
          cssClasses={["time"]} />
        <label
          label={minute()}
          cssClasses={["time"]} />
      </box>
      <box vertical spacing={vertical ? 2 : 0}
        halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
        <label
          cssClasses={["date"]}
          label={day()}
        />
        <label
          cssClasses={["date"]}
          label={month()}
        />
      </box>
    </box>
  </ToggleButton>
}