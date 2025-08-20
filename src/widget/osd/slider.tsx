import Gtk from "gi://Gtk?version=4.0"
import { Accessor } from "gnim"

export default ({ value, iconName }: {
  value: Accessor<number>,
  iconName: string | Accessor<string>
}) =>
  <Gtk.Box
    cssClasses={["slider"]}
    spacing={8}>
    <Gtk.Image
      iconName={iconName}
      pixelSize={20} />
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
  </Gtk.Box>

