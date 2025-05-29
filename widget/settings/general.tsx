import { Astal, Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";
import Adw from "gi://Adw?version=1";
import Settings from "../../lib/settings";

const settings = Settings.get_default()
const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

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

      <Adw.ActionRow
        title={"Bar Orientation"}
        subtitle={bind(settings.bar, "position")
          .as(position => {
            switch (position) {
              case TOP:
                return "Top";
              case LEFT:
                return "Left";
              case RIGHT:
                return "Right";
              case BOTTOM:
                return "Bottom";
              default:
                return "";
            }
          })
        }>
        <Adw.ToggleGroup
          _type="suffix"
          cssClasses={["round"]}
          valign={Gtk.Align.CENTER}
          $$activeName={self => settings.bar.position =
            Number(self.activeName) as Astal.WindowAnchor
          }
          activeName={bind(settings.bar, "position")
            .as(position => position.toString() ?? "")
          }>
          <Adw.Toggle
            name={TOP.toString()}
            label={"Top"}
            iconName={"orientation-landscape-symbolic"}
          />
          <Adw.Toggle
            name={LEFT.toString()}
            label={"Left"}
            iconName={"orientation-portrait-inverse-symbolic"}
          />
          <Adw.Toggle
            name={RIGHT.toString()}
            label={"Right"}
            iconName={"orientation-portrait-right-symbolic"}
          />
          <Adw.Toggle
            name={BOTTOM.toString()}
            label={"Bottom"}
            iconName={"orientation-landscape-inverse-symbolic"}
          />
        </Adw.ToggleGroup>
      </Adw.ActionRow>
    </Adw.PreferencesGroup>