import Wireplumber from "gi://AstalWp"
import { bind } from "ags/state"
import { For, Gtk } from "ags/gtk4"
import { Slider, SliderType } from "../common/slider"

const audio = Wireplumber.get_default()!.audio

export default () =>
  <box
    orientation={Gtk.Orientation.VERTICAL}
    spacing={4}>
    <Slider type={SliderType.AUDIO} />
    <menubutton>
      <popover>
        <box
          orientation={Gtk.Orientation.VERTICAL}>
          <For each={bind(audio, "speakers")}>
            {speaker =>
              <Gtk.CheckButton
                label={speaker.description}
                active={bind(speaker, "isDefault")}
                $={self => self.connect("notify::active", self => {
                  speaker.isDefault = self.state
                })}>
              </Gtk.CheckButton>
            }
          </For>
        </box>
      </popover>
    </menubutton>
  </box >