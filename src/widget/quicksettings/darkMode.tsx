import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "gnim"
import Darkman from "../../lib/darkman";

const darkman = Darkman.get_default()

export default () => <Adw.SplitButton
  popover={
    <Gtk.Popover>
      <Gtk.Box
        orientation={Gtk.Orientation.VERTICAL}
        cssClasses={["linked"]}>
        <Gtk.Button onClicked={() => darkman.mode = "light"}>
          <Adw.ButtonContent
            iconName={"weather-clear-symbolic"}
            label="Light Mode" />
        </Gtk.Button>
        <Gtk.Button onClicked={() => darkman.mode = "dark"}>
          <Adw.ButtonContent
            iconName={"weather-clear-night-symbolic"}
            label="Dark Mode" />
        </Gtk.Button>
      </Gtk.Box>
    </Gtk.Popover> as Gtk.Popover}
  widthRequest={150}
  $={self =>
    self.connect("clicked", () => {
      if (darkman.mode === "light")
        darkman.mode = "dark"
      else
        darkman.mode = "light"
    })}>
  <Adw.ButtonContent
    iconName={createBinding(darkman, "icon_name")}
    label={createBinding(darkman, "mode")(mode =>
      mode === "dark" ?
        "Dark Mode" :
        "Light Mode")} />
</Adw.SplitButton>

