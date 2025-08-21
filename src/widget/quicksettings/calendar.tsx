import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"

export const Calendar = () =>
  <Gtk.Calendar
    cssClasses={["card"]}
  />

export const CalendarIcon = () =>
  <Gtk.Box>
    <Gtk.Image
      iconName={"x-office-calendar-symbolic"}
    />
    <Gtk.Label label={GLib.DateTime
      .new_now_local()
      .format("%x") ?? ""
    } />
  </Gtk.Box>