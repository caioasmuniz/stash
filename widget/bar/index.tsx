import { Astal, Gtk } from "ags/gtk4"
import App from "ags/gtk4/app"

import Hyprland from "gi://AstalHyprland";

import SystemIndicators from "./systemIndicators";
import SystemUsage from "./systemUsage";
import Workspaces from "./workspaces";
import Clock from "./clock";
import Launcher from "./launcher";
import { createBinding } from "ags";
import Settings from "../../lib/settings";

const hyprland = Hyprland.get_default()
const settings = Settings.get_default()
const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor


const bar = (monitor: Hyprland.Monitor, vertical: boolean) =>
  <window
    visible
    cssClasses={["bar", "background",
      vertical ? "vert" : ""]}
    application={App}
    monitor={monitor.id}
    name={`bar-${monitor.id}`}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={createBinding(settings.bar, "position")(p =>
      p === TOP ? (TOP | LEFT | RIGHT) :
        p === LEFT ? (TOP | LEFT | BOTTOM) :
          p === BOTTOM ? (RIGHT | LEFT | BOTTOM) :
            (TOP | RIGHT | BOTTOM)
    )}>
    <centerbox
      cssClasses={["bar-centerbox"]}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}>
      <box
        $type="start"
        spacing={4}
        orientation={vertical ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL}>
        <Launcher />
        <SystemUsage vertical={vertical} />
      </box>
      <box $type="center">
        <Workspaces vertical={vertical} monitor={monitor} />
      </box>
      <box
        $type="end"
        cssClasses={["linked"]}
        orientation={vertical ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL}
        valign={vertical ? Gtk.Align.END : Gtk.Align.FILL}
        halign={vertical ? Gtk.Align.FILL : Gtk.Align.END} >
        <Clock vertical={vertical} />
        <Gtk.Separator />
        <SystemIndicators vertical={vertical} />
      </box>
    </centerbox>
  </window > as Astal.Window;

export default () => {
  const bars = new Map<number, Astal.Window>()
  const vertical = createBinding(settings.bar, "position")
    (p => p === LEFT || p === RIGHT)

  hyprland.get_monitors().forEach(monitor =>
    bars.set(monitor.id, bar(monitor, vertical.get())))

  hyprland.connect("monitor-added", (_, monitor) =>
    bars.set(monitor.id, bar(monitor, vertical.get())))

  hyprland.connect("monitor-removed", (_, id) => {
    bars.get(id)!.close()
    bars.delete(id)
  })

  vertical.subscribe(() => {
    hyprland.get_monitors()
      .forEach(monitor => {
        bars.get(monitor.id)!.close()
        bars.delete(monitor.id)
        bars.set(monitor.id, bar(monitor, vertical.get()))
      })
  })
}