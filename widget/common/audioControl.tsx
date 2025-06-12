import { Accessor, createBinding, createState, For } from "ags"
import { Gtk } from "ags/gtk4"
import { Slider } from "./slider"
import Wireplumber from "gi://AstalWp"

interface AudioControlProps {
  defaultDevice: Wireplumber.Endpoint
  devices: Accessor<Wireplumber.Endpoint[]>
}

export const AudioEndpointControl = ({ defaultDevice, devices }: AudioControlProps) => {
  const [visible, setVisible] = createState(false)

  return (
    <box
      cssClasses={["audio-config"]}
      orientation={Gtk.Orientation.VERTICAL}>
      <button $clicked={() => setVisible(!visible.get())}>
        <Slider
          icon={createBinding(defaultDevice, "volumeIcon")}
          min={0}
          max={100}
          value={createBinding(defaultDevice, 'volume')
            (v => v * 100)}
          setValue={value => defaultDevice.set_volume(value / 100)}
        />
      </button>
      <Gtk.Revealer revealChild={visible}>
        <box cssClasses={["buttonGroup"]}
          orientation={Gtk.Orientation.VERTICAL}>
          <For each={devices}>
            {device =>
              <button
                cssClasses={createBinding(device, "isDefault")
                  (isDefault => isDefault ? ['active', 'linked'] : ['linked'])}
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