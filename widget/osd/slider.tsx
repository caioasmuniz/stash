import { Binding, } from "ags/state"
import { Gtk } from "ags/gtk4"

export default ({ binding, iconName }: {
  binding: Binding<number>,
  iconName: string | Binding<string>
}) =>
  <box
    cssClasses={["slider"]}
    spacing={8}>
    <image iconName={iconName} />
    <levelbar
      hexpand
      $={self => self.set_value(binding.get())}
      value={binding}
    />
    <label
      cssClasses={["heading"]}
      label={binding.as(v =>
        Math.floor(v * 100)
          .toString()
          .concat("%"))
      }
    />
  </box> as Gtk.Widget

