import { Accessor } from "ags"

type SliderProps = {
  icon: Accessor<string> | string,
  min: number,
  max: number,
  value: Accessor<number>,
  setValue: (value: number) => void,
}
export const Slider = (props: SliderProps) =>
  <box
    cssClasses={["slider"]}
    spacing={4}>
    <image iconName={props.icon} />
    <slider
      hexpand
      min={props.min}
      max={props.max}
      $={self => self.set_value(props.value.get())}
      $changeValue={({ value }) =>
        props.setValue(value)
      }
      value={props.value} />
    <label
      cssClasses={["heading"]}
      label={props.value(v => v
        .toFixed(0)
        .toString()
        .concat("%"))
      } />
  </box>