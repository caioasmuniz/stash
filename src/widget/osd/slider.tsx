import { Accessor } from "ags"
import { Gtk } from "ags/gtk4"

export default ({ value, iconName }: {
  value: Accessor<number>,
  iconName: string | Accessor<string>
}) =>
  <Gtk.Box
    cssClasses={["slider"]}
    spacing={8}>
    <Gtk.Image iconName={iconName} />
    <Gtk.LevelBar
      hexpand
      $={self => self.set_value(value.get())}
      value={value}
    />
    <Gtk.Label
      cssClasses={["heading"]}
      label={value(v =>
        Math.floor(v * 100)
          .toString()
          .concat("%"))
      }
    />
  </Gtk.Box> as Gtk.Widget

