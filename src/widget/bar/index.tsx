import Hyprland from "gi://AstalHyprland";
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import SystemIndicators from "./systemIndicators";
import SystemUsage from "./systemUsage";
import Workspaces from "./workspaces";
import Clock from "./clock";
import Launcher from "./launcher";
import { useSettings } from "../../lib/settings";
import { createBinding } from "gnim";

export default ({ app, $ }: {
  app: Gtk.Application
  $?: (self: Astal.Window) => void
}) => {
  const hyprland = Hyprland.get_default()
  const settings = useSettings()
  const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const vertical = settings.bar.position.as((p) =>
    p === LEFT || p === RIGHT)
  return <Astal.Window
    $={$}
    visible
    cssClasses={vertical.as(v =>
      ["bar", "background",
        v ? "vert" : ""])}
    application={app}
    monitor={createBinding(hyprland.focusedMonitor, "id")}
    name={`bar`}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={settings.bar.position.as(p =>
      p === TOP ? (TOP | LEFT | RIGHT) :
        p === LEFT ? (TOP | LEFT | BOTTOM) :
          p === BOTTOM ? (RIGHT | LEFT | BOTTOM) :
            (TOP | RIGHT | BOTTOM)
    )}>
    <Gtk.CenterBox
      cssClasses={["bar-centerbox"]}
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}>
      <Gtk.Box
        $type="start"
        spacing={4}
        orientation={vertical.as(v => v ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL)}>
        <Launcher />
        <SystemUsage vertical={vertical} />
      </Gtk.Box>
      <Gtk.Box $type="center">
        <Workspaces vertical={vertical}
          monitor={hyprland.focusedMonitor}
        />
      </Gtk.Box>
      <Gtk.Box
        $type="end"
        cssClasses={["linked"]}
        orientation={vertical.as(v => v ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL)}
        valign={vertical.as(v => v ?
          Gtk.Align.END : Gtk.Align.FILL)}
        halign={vertical.as(v => v ?
          Gtk.Align.FILL : Gtk.Align.END)} >
        <Clock vertical={vertical} />
        <Gtk.Separator />
        <SystemIndicators vertical={vertical} />
      </Gtk.Box>
    </Gtk.CenterBox>
  </Astal.Window>
}