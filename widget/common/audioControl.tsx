import { bind, State, Binding } from "ags/state"
import { For, Gtk } from "ags/gtk4"
import { Slider } from "./slider"
import Wireplumber from "gi://AstalWp"

interface AudioControlProps {
  defaultDevice: Wireplumber.Endpoint
  devices: Binding<Wireplumber.Endpoint[]>
}

export const AudioEndpointControl = ({ defaultDevice, devices }: AudioControlProps) => {
  const visible = new State<boolean>(false)

  return (
    <box
      cssClasses={["audio-config"]}
      orientation={Gtk.Orientation.VERTICAL}>
      <button $clicked={() => visible.set(!visible.get())}>
        <Slider
          icon={bind(defaultDevice, "volumeIcon")}
          min={0}
          max={100}
          value={bind(defaultDevice, 'volume').as(v => v * 100)} 
          setValue={value => defaultDevice.set_volume(value / 100)}
        />
      </button>
      <Gtk.Revealer revealChild={bind(visible)}>
        <box cssClasses={["buttonGroup"]}
          orientation={Gtk.Orientation.VERTICAL}>
          <For each={devices}>
            {device =>
              <button
                cssClasses={bind(device, "isDefault").as(isDefault => isDefault ? ['active', 'linked'] : ['linked'])}
                $clicked={() => device.set_is_default(true)}>
                <label
                  _type="label"
                  label={device.description}
                  wrap
                  maxWidthChars={10}
                />
              </button>
            }
          </For>
        </box>
      </Gtk.Revealer>
    </box>
  )
} 