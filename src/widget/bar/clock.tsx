import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import { createPoll } from "ags/time"

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
    <Gtk.Box
      cssClasses={["clock", vertical ? "vert" : ""]}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}
      spacing={vertical ? 0 : 4}>
      <Gtk.Box
        orientation={vertical ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL}
        spacing={vertical ? 0 : 4}>
        <Gtk.Label
          label={hour}
          cssClasses={["time"]} />
        <Gtk.Label
          label={minute}
          cssClasses={["time"]} />
      </Gtk.Box>
      <Gtk.Box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={vertical ? 2 : 0}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}>
        <Gtk.Label
          cssClasses={["date"]}
          label={day}
        />
        <Gtk.Label
          cssClasses={["date"]}
          label={month}
        />
      </Gtk.Box>
    </Gtk.Box>
  </Gtk.MenuButton >
}