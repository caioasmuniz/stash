import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";

export default () =>
  <Adw.PreferencesGroup
    title={"Appearance"}
    description={"Set cosmetic options"}>
    <Adw.ActionRow title={"System Theme"}>
      <Adw.ToggleGroup $type="suffix"
        cssClasses={["round"]}
        valign={Gtk.Align.CENTER}>
        <Adw.Toggle
          label={"Light"}
          iconName={"weather-clear-symbolic"}
        />
        <Adw.Toggle
          label={"Auto"}
          iconName={"night-light-symbolic"}
        />
        <Adw.Toggle
          label={"Dark"}
          iconName={"weather-clear-night-symbolic"}
        />
      </Adw.ToggleGroup>
    </Adw.ActionRow>
  </Adw.PreferencesGroup>