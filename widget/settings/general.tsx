import { Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";

export default () =>
  <Adw.PreferencesGroup
    title={"Appearance"}
    description={"Set cosmetic options"}>
    <Adw.ActionRow title={"System Theme"}>
      <Adw.ToggleGroup _type="suffix"
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