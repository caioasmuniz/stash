import Wireplumber from "gi://AstalWp"
import { bind } from "ags/state"
import { AudioEndpointControl } from "../common/audioControl"

const audio = Wireplumber.get_default()!.audio

export const AudioConfig = () => (
  <AudioEndpointControl
    defaultDevice={audio.defaultSpeaker}
    devices={bind(audio, 'speakers')}
  />
)

export const MicConfig = () => (
  <AudioEndpointControl
    defaultDevice={audio.defaultMicrophone}
    devices={bind(audio, "microphones")}
  />
)
