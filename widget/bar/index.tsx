import { Astal, App, Gtk } from "astal/gtk4"

import Hyprland from "gi://AstalHyprland";

import SystemIndicators from "./systemIndicators";
import SystemUsage from "./systemUsage";
import Workspaces from "./workspaces";
import Clock from "./clock";
import Launcher from "./launcher";
import { Variable } from "astal";

const hyprland = Hyprland.get_default()

const bar = (monitor: Hyprland.Monitor, vertical: boolean) =>
  <window
    visible
    cssClasses={["bar", "background",
      vertical ? "vert" : ""]}
    application={App}
    monitor={monitor.id}
    name={`bar-${monitor.id}`}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={vertical ?
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.BOTTOM
      :
      Astal.WindowAnchor.BOTTOM |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT}>
    <centerbox
      cssClasses={["bar-centerbox"]}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}>
      <box
        spacing={4}
        vertical={vertical}
        halign={Gtk.Align.START}>
        <Launcher />
        <SystemUsage vertical={vertical} />
      </box>
      <Workspaces vertical={vertical} monitor={monitor} />
      <box
        spacing={4}
        vertical={vertical}
        valign={vertical ? Gtk.Align.END : Gtk.Align.FILL}
        halign={vertical ? Gtk.Align.FILL : Gtk.Align.END} >
        <Clock vertical={vertical} />
        <SystemIndicators vertical={vertical} />
      </box>
    </centerbox>
  </window> as Astal.Window

export default (vertical: Variable<boolean>) => {
  const bars = new Map<Hyprland.Monitor, Astal.Window>()

  // initialize
  for (const monitor of hyprland.get_monitors()) {
    bars.set(monitor, bar(monitor, vertical.get()))
  }

  hyprland.connect("monitor-added", (_, monitor) => {
    bars.set(monitor, bar(monitor, vertical.get()))
  })

  hyprland.connect("monitor-removed", (_, id) => {
    bars.get(hyprland.get_monitor(id))?.close()
    bars.delete(hyprland.get_monitor(id))
  })

  vertical.subscribe(vert => {
    const monitor = hyprland.focusedMonitor
    bars.get(monitor)?.close()
    bars.delete(monitor)
    bars.set(monitor, bar(monitor, vert))
  })
}