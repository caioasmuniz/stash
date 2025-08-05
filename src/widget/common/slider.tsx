import { Accessor } from "ags"
import { Gtk, Astal } from "ags/gtk4"

type SliderProps = {
  icon: Accessor<string> | string,
  min: number,
  max: number,
  value: Accessor<number>,
  setValue: (value: number) => void,
}
export const Slider = (props: SliderProps) =>
  <Gtk.Box
    cssClasses={["slider"]}
    spacing={4}>
    <Gtk.Image iconName={props.icon} />
    <Astal.Slider
      hexpand
      min={props.min}
      max={props.max}
      $={self => self.set_value(props.value.get())}
      onChangeValue={({ value }) =>
        props.setValue(value)
      }
      value={props.value} />
    <Gtk.Label
      cssClasses={["heading"]}
      label={props.value(v => v
        .toFixed(0)
        .toString()
        .concat("%"))
      } />
  </Gtk.Box>