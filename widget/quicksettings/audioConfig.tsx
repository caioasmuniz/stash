import Wireplumber from "gi://AstalWp"
import { createBinding } from "gnim"
import { AudioEndpointControl } from "../common/audioControl"

const audio = Wireplumber.get_default()!.audio

export const AudioConfig = () => (
  <AudioEndpointControl
    defaultDevice={audio.defaultSpeaker}
    devices={createBinding(audio, 'speakers')}
  />
)

export const MicConfig = () => (
  <AudioEndpointControl
    defaultDevice={audio.defaultMicrophone}
    devices={createBinding(audio, "microphones")}
  />
)
