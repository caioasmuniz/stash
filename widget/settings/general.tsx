import { Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";
import Adw from "gi://Adw?version=1";
import Settings from "../../lib/settings";

const settings = Settings.get_default()

export default () =>
  <Adw.PreferencesPage>
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

      <Adw.ActionRow
        title={"Bar Orientation"}
        subtitle={bind(settings, "barOrientation")
          .as(orientation =>
            orientation === Gtk.Orientation.HORIZONTAL ?
              "Horizontal" : "Vertical")}>
        <Adw.ToggleGroup
          _type="suffix"
          cssClasses={["round"]}
          valign={Gtk.Align.CENTER}
          $$active={self => settings.barOrientation =
            self.active as Gtk.Orientation
          }
          active={bind(settings, "barOrientation")
            .as(orientation => orientation as number ?? 0)
          }
        >
          <Adw.Toggle
            label={"Horizontal"}
            iconName={"object-flip-horizontal-symbolic"}
          />
          <Adw.Toggle
            label={"Vertical"}
            iconName={"object-flip-vertical-symbolic"}
          />
        </Adw.ToggleGroup>
      </Adw.ActionRow>
    </Adw.PreferencesGroup>
  </Adw.PreferencesPage > as Gtk.Widget