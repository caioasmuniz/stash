import { createBinding } from "ags"
import { Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1";
import Darkman from "../../lib/darkman";

const darkman = Darkman.get_default()

export default () => <Adw.SplitButton
  popover={
    <popover>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["linked"]}>
        <button $clicked={() => darkman.mode = "light"}>
          <Adw.ButtonContent
            iconName={"weather-clear-symbolic"}
            label="Light Mode" />
        </button>
        <button $clicked={() => darkman.mode = "dark"}>
          <Adw.ButtonContent
            iconName={"weather-clear-night-symbolic"}
            label="Dark Mode" />
        </button>
      </box>
    </popover> as Gtk.Popover}
  widthRequest={150}
  $={self =>
    self.connect("clicked", () => {
      darkman.mode === "light" ?
        darkman.mode = "dark" :
        darkman.mode = "light"
    })}>
  <Adw.ButtonContent
    iconName={createBinding(darkman, "icon_name")}
    label={createBinding(darkman, "mode")(mode =>
      mode === "dark" ?
        "Dark Mode" :
        "Light Mode")} />
</Adw.SplitButton>

