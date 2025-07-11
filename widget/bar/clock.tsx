import GLib from "gi://GLib"
import { createPoll } from "ags/time"
import { Gtk, Gdk } from "ags/gtk4"

export default ({ vertical }: { vertical: boolean }) => {
  const day = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().get_day_of_month().toString())
  const month = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format("%b")!)
  const hour = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format("%H")!)
  const minute = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format("%M")!)

  return <Gtk.MenuButton
    direction={vertical ?
      Gtk.ArrowType.RIGHT :
      Gtk.ArrowType.UP}
    hexpand={vertical}
    cssClasses={["pill"]}
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    popover={<Gtk.Popover
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      hasArrow={false}>
      <Gtk.Calendar />
    </Gtk.Popover> as Gtk.Popover}>
    <box
      cssClasses={["clock", vertical ? "vert" : ""]}
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
          label={hour}
          cssClasses={["time"]} />
        <label
          label={minute}
          cssClasses={["time"]} />
      </box>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={vertical ? 2 : 0}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}>
        <label
          cssClasses={["date"]}
          label={day}
        />
        <label
          cssClasses={["date"]}
          label={month}
        />
      </box>
    </box>
  </Gtk.MenuButton >
}