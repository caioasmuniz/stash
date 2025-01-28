import Wireplumber from "gi://AstalWp"
import { bind } from "astal"
import { Slider, SliderType } from "../common/slider"
import { CheckButton } from "../../lib/astalified"

const audio = Wireplumber.get_default()!.audio

export default () => <box vertical spacing={4}>
  <Slider type={SliderType.AUDIO} />
  <menubutton>
    <popover>
      <box vertical>
        {bind(audio, "speakers").as(speakers =>
          speakers.map(speaker =>
            <CheckButton
              label={speaker.description}
              active={bind(speaker, "isDefault")}
              setup={self => self.connect("notify::active", self => {
                speaker.isDefault = self.state
              })}>
            </CheckButton>
          ))}
      </box>
    </popover>
  </menubutton>
</box>