import GLib from "gi://GLib"
import { Poll } from "ags/state"
import { Gtk, Gdk } from "ags/gtk4"
import App from "ags/gtk4/app"

export default ({ vertical }: { vertical: boolean }) => {
  const day = new Poll<string>("", 1000, () =>
    GLib.DateTime.new_now_local().get_day_of_month().toString())
  const month = new Poll<string>("", 1000, () =>
    GLib.DateTime.new_now_local().format("%b")!)
  const hour = new Poll<string>("", 1000, () =>
    GLib.DateTime.new_now_local().format("%H")!)
  const minute = new Poll<string>("", 1000, () =>
    GLib.DateTime.new_now_local().format("%M")!)

  return <Gtk.ToggleButton
    hexpand={vertical}
    cssClasses={["pill", "clock", vertical ? "vert" : ""]}
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    // active={bind(App.get_window("infopannel")!, "visible")}
    $clicked={() => App.toggle_window("infopannel")}>
    <box
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}
      spacing={vertical ? 0 : 4}>
      <box
        orientation={vertical ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL}
        spacing={vertical ? 0 : 4}>
        <label
          label={hour()}
          cssClasses={["time"]} />
        <label
          label={minute()}
          cssClasses={["time"]} />
      </box>
      <box
        orientation={vertical ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL}
        spacing={vertical ? 2 : 0}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}>
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
  </Gtk.ToggleButton>
}