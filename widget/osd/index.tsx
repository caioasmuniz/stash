import Wireplumber from "gi://AstalWp"
import { bind } from "ags/state"
import Brightness from "../../lib/brightness"
import Slider from "./slider"
import PopupWindow from "./popupWindow"

const brightness = Brightness.get_default()
const audio = Wireplumber.get_default()!.audio

export default () => [
  PopupWindow({
    subscribable: bind(audio.defaultSpeaker, "volume"),
    widget: Slider({
      iconName: bind(audio.defaultSpeaker, "volumeIcon"),
      binding: bind(audio.defaultSpeaker, "volume"),
    })
  }),
  PopupWindow({
    subscribable: bind(brightness, "screen"),
    widget: Slider({
      iconName: "display-brightness-symbolic",
      binding: bind(brightness, "screen"),
    })
  }),
]
