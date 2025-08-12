import { Accessor } from "ags"
import { Gtk } from "ags/gtk4"

export default ({ value, iconName }: {
  value: Accessor<number>,
  iconName: string | Accessor<string>
}) =>
  <box
    cssClasses={["slider"]}
    spacing={8}>
    <image iconName={iconName} />
    <levelbar
      hexpand
      $={self => self.set_value(value.get())}
      value={value}
    />
    <label
      cssClasses={["heading"]}
      label={value(v =>
        Math.floor(v * 100)
          .toString()
          .concat("%"))
      }
    />
  </box> as Gtk.Widget

