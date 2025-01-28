import Darkman from "../../lib/darkman";
import { bind } from "astal"
import { Gtk } from "astal/gtk4"
import { ButtonContent, SplitButton } from "../../lib/astalified"

const darkman = Darkman.get_default()

export default () => <SplitButton
  popover={
    <popover>
      <box
        vertical
        cssClasses={["linked"]}>
        <button onClicked={() => darkman.mode = "light"}>
          <ButtonContent
            iconName={"weather-clear-symbolic"}
            label="Light Mode" />
        </button>
        <button onClicked={() => darkman.mode = "dark"}>
          <ButtonContent
            iconName={"weather-clear-night-symbolic"}
            label="Dark Mode" />
        </button>
      </box>
    </popover> as Gtk.Popover}
  widthRequest={150}
  setup={self =>
    self.connect("clicked", () => {
      darkman.mode === "light" ?
        darkman.mode = "dark" :
        darkman.mode = "light"
    })}>
  <ButtonContent
    iconName={bind(darkman, "icon_name")}
    label={bind(darkman, "mode").as(mode =>
      mode === "dark" ?
        "Dark Mode" :
        "Light Mode")} />
</SplitButton>

