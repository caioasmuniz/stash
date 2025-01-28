import Powerprofiles from "gi://AstalPowerProfiles"
import { bind } from "astal"
import { Gtk } from "astal/gtk4"
import { ButtonContent, SplitButton } from "../../lib/astalified"

const profile = Powerprofiles.get_default()
export default () => <SplitButton
  popover={
    <popover>
      <box
        cssClasses={["linked"]}
        vertical>
        <button onClicked={() => profile.set_active_profile("power-saver")}>
          <ButtonContent
            iconName={"power-profile-power-saver-symbolic"}
            label="Power Saver" />
        </button>
        <button onClicked={() => profile.set_active_profile("balanced")}>
          <ButtonContent
            iconName={"power-profile-balanced-symbolic"}
            label="Balanced" />
        </button>
        <button onClicked={() => profile.set_active_profile("performance")}>
          <ButtonContent
            iconName={"power-profile-performance-symbolic"}
            label="Performance" />
        </button>
      </box>
    </popover> as Gtk.Popover}
  widthRequest={150}
  setup={self =>
    self.connect("clicked", () => {
      const p = profile.get_active_profile()
      if (p === "power-saver")
        profile.set_active_profile("balanced")
      else if (p === "balanced")
        profile.set_active_profile("performance")
      else
        profile.set_active_profile("power-saver")
    })}>
  <ButtonContent
    iconName={bind(profile, "iconName")}
    label={bind(profile, "activeProfile").as(p =>
      p === "power-saver" ?
        "Power Saver" :
        p === "balanced" ?
          "Balanced" :
          "Performance"
    )} />

</SplitButton>

