import Powerprofiles from "gi://AstalPowerProfiles"
import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import { createBinding } from "gnim"

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
    <Gtk.Popover>
      <Gtk.Box
        cssClasses={["linked"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <Gtk.Button onClicked={() => profile.set_active_profile("power-saver")}>
          <Adw.ButtonContent
            iconName={"power-profile-power-saver-symbolic"}
            label="Power Saver" />
        </Gtk.Button>
        <Gtk.Button onClicked={() => profile.set_active_profile("balanced")}>
          <Adw.ButtonContent
            iconName={"power-profile-balanced-symbolic"}
            label="Balanced" />
        </Gtk.Button>
        <Gtk.Button onClicked={() => profile.set_active_profile("performance")}>
          <Adw.ButtonContent
            iconName={"power-profile-performance-symbolic"}
            label="Performance" />
        </Gtk.Button>
      </Gtk.Box>
    </Gtk.Popover> as Gtk.Popover}>
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

