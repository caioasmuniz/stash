import Adw from "gi://Adw?version=1";
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import Settings from "../../lib/settings";
import { createBinding } from "gnim";

const { bar } = Settings.get_default()
const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

export default () =>
  <Adw.PreferencesGroup
    title={"Bar"}
    description={"Bar widget settings"}>
    <Adw.ActionRow
      title={"Position"}
      subtitle={createBinding(bar, "position")
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
        $type="suffix"
        cssClasses={["round"]}
        valign={Gtk.Align.CENTER}
        onNotifyActiveName={self => bar.position =
          Number(self.activeName) as Astal.WindowAnchor
        }
        activeName={createBinding(bar, "position")
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
    <Adw.EntryRow
      title={"Temperature Path"}
      showApplyButton
      text={bar.tempPath ?? ""}
      onEntryActivated={self => bar.tempPath = self.text}
      onApply={self => bar.tempPath = self.text}
    />
    <Adw.EntryRow
      title={"System Monitor"}
      showApplyButton
      text={bar.systemMonitor ?? ""}
      onEntryActivated={self => bar.systemMonitor = self.text}
      onApply={self => bar.systemMonitor = self.text}
    />
  </Adw.PreferencesGroup>