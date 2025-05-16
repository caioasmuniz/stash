import { Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";

export default () =>
  <Adw.PreferencesGroup>
    <Adw.ActionRow title={"System Theme"}>
      <Adw.ToggleGroup _type="suffix">
        <Adw.Toggle
          iconName={"weather-clear-symbolic"}
        />
        <Adw.Toggle
          iconName={"night-light-symbolic"}
        />
        <Adw.Toggle
          iconName={"weather-clear-night-symbolic"}
        />
      </Adw.ToggleGroup>
    </Adw.ActionRow>

    <Adw.ActionRow title={"Bar Orientation"}>
      <Adw.ToggleGroup _type="suffix">
        <Adw.Toggle
          iconName={"object-flip-vertical-symbolic"}
        />
        <Adw.Toggle
          iconName={"object-flip-horizontal-symbolic"}
        />
      </Adw.ToggleGroup>
    </Adw.ActionRow>
  </Adw.PreferencesGroup> as Gtk.Widget