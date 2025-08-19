import GLib from "gi://GLib"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import { Accessor, createState } from "gnim"

export default ({ vertical }: { vertical: Accessor<boolean> }) => {

  const [time, setTime] = createState(new GLib.DateTime)
  setInterval(() => {
    setTime(GLib.DateTime.new_now_local())
  }, 1000);

  const day = time.as(t => t.get_day_of_month().toString())
  const month = time.as(t => t.format("%b")!)
  const hour = time.as(t => t.format("%H")!)
  const minute = time.as(t => t.format("%M")!)

  return <Gtk.MenuButton
    direction={vertical.as(v => v ?
      Gtk.ArrowType.RIGHT :
      Gtk.ArrowType.UP)}
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
      cssClasses={vertical.as(v => ["clock", v ? "vert" : ""])}
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}
      spacing={vertical.as(v => v ? 0 : 4)}>
      <Gtk.Box
        orientation={vertical.as(v => v ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL)}
        spacing={vertical.as(v => v ? 0 : 4)}>
        <Gtk.Label
          label={hour}
          cssClasses={["time"]} />
        <Gtk.Label
          label={minute}
          cssClasses={["time"]} />
      </Gtk.Box>
      <Gtk.Box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={vertical.as(v => v ? 2 : 0)}
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