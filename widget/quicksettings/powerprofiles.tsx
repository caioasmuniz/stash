import Powerprofiles from "gi://AstalPowerProfiles"
import { createBinding } from "ags"
import { Gtk } from "ags/gtk4"
import Adw from "gi://Adw?version=1"

const profile = Powerprofiles.get_default()
export default () => <Adw.SplitButton
  widthRequest={150}
  $={self =>
    self.connect("clicked", () => {
      const p = profile.get_active_profile()
      if (p === "power-saver")
        profile.set_active_profile("balanced")
      else if (p === "balanced")
        profile.set_active_profile("performance")
      else
        profile.set_active_profile("power-saver")
    })}
  popover={
    <popover>
      <box
        cssClasses={["linked"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <button onClicked={() => profile.set_active_profile("power-saver")}>
          <Adw.ButtonContent
            iconName={"power-profile-power-saver-symbolic"}
            label="Power Saver" />
        </button>
        <button onClicked={() => profile.set_active_profile("balanced")}>
          <Adw.ButtonContent
            iconName={"power-profile-balanced-symbolic"}
            label="Balanced" />
        </button>
        <button onClicked={() => profile.set_active_profile("performance")}>
          <Adw.ButtonContent
            iconName={"power-profile-performance-symbolic"}
            label="Performance" />
        </button>
      </box>
    </popover> as Gtk.Popover}>
  <Adw.ButtonContent
    iconName={createBinding(profile, "iconName")}
    label={createBinding(profile, "activeProfile")(p =>
      p === "power-saver" ?
        "Power Saver" :
        p === "balanced" ?
          "Balanced" :
          "Performance"
    )} />
</Adw.SplitButton>

