import Wireplumber from "gi://AstalWp"
import { bind, State } from "ags/state"
import { For, Gtk } from "ags/gtk4"
import { Slider, SliderType } from "../common/slider"

const audio = Wireplumber.get_default()!.audio
const visible = new State<boolean>(false)

export default () =>
  <box
    cssClasses={["audio-config"]}
    orientation={Gtk.Orientation.VERTICAL}>
    <button $clicked={() => visible.set(!visible.get())}>
      <Slider type={SliderType.AUDIO} />
    </button>
    <Gtk.Revealer revealChild={bind(visible)}>
      <box
        orientation={Gtk.Orientation.VERTICAL}>
        <For each={bind(audio, "speakers")}>
          {speaker =>
            <Gtk.ToggleButton
              active={bind(speaker, "isDefault")}
              $activate={() => {
                speaker.set_is_default(true);
              }}>
              <label
                _type="label"
                label={speaker.description}
                wrap
                maxWidthChars={10}
              />
            </Gtk.ToggleButton>
          }
        </For>
      </box>
    </Gtk.Revealer >
  </box >
