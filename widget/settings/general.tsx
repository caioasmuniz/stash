import { Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";
import Adw from "gi://Adw?version=1";
import { Config } from ".";

export default (config: State<Config>) =>
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
      <Adw.ToggleGroup _type="suffix"
        $$active={self => config.set({
          ...config.get(),
          barOrientation: self.active as Gtk.Orientation
        })}
        active={bind(config).as(c =>
          c.barOrientation as number ?? 0
        )}>
        <Adw.Toggle
          iconName={"object-flip-horizontal-symbolic"}
        />
        <Adw.Toggle
          iconName={"object-flip-vertical-symbolic"}
        />
      </Adw.ToggleGroup>
    </Adw.ActionRow>
  </Adw.PreferencesGroup> as Gtk.Widget