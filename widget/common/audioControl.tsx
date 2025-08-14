import Wireplumber from "gi://AstalWp"
import Gtk from "gi://Gtk?version=4.0"
import { Accessor, createBinding, createState, For } from "gnim"
import { Slider } from "./slider"

interface AudioControlProps {
  defaultDevice: Wireplumber.Endpoint
  devices: Accessor<Wireplumber.Endpoint[]>
}

export const AudioEndpointControl = ({ defaultDevice, devices }: AudioControlProps) => {
  const [visible, setVisible] = createState(false)

  return (
    <Gtk.Box
      cssClasses={["audio-config"]}
      orientation={Gtk.Orientation.VERTICAL}>
      <Gtk.Button onClicked={() => setVisible(!visible.get())}>
        <Slider
          icon={createBinding(defaultDevice, "volumeIcon")}
          min={0}
          max={100}
          value={createBinding(defaultDevice, 'volume')
            (v => v * 100)}
          setValue={value => defaultDevice.set_volume(value / 100)}
        />
      </Gtk.Button>
      <Gtk.Revealer revealChild={visible}>
        <Gtk.Box cssClasses={["buttonGroup"]}
          orientation={Gtk.Orientation.VERTICAL}>
          <For each={devices}>
            {device =>
              <Gtk.Button
                cssClasses={createBinding(device, "isDefault")
                  (isDefault => isDefault ? ['active', 'linked'] : ['linked'])}
                onClicked={() => device.set_is_default(true)}>
                <Gtk.Label
                  $type="label"
                  label={device.description}
                  wrap
                  maxWidthChars={10}
                />
              </Gtk.Button>
            }
          </For>
        </Gtk.Box>
      </Gtk.Revealer>
    </Gtk.Box>
  )
} 