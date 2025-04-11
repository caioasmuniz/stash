import { type Binding, bind, sync } from "ags/state"
import { Gtk, For, Gdk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"
import Apps from "gi://AstalApps"

const hyprland = Hyprland.get_default()

const apps = new Apps.Apps({
  nameMultiplier: 4,
  entryMultiplier: 1,
  executableMultiplier: 1,
  descriptionMultiplier: 1,
})

const getIcon = (client: Hyprland.Client) => {
  switch (client.class) {
    case "code-url-handler":
      return "vscode"
    default:
      return apps.fuzzy_query(client.class).at(0)?.iconName ||
        apps.fuzzy_query(client.title).at(0)?.iconName ||
        apps.fuzzy_query(client.initialTitle).at(0)?.iconName ||
        "image-missing-symbolic"
  }
}

export default ({ monitor, vertical }:
  { monitor: Hyprland.Monitor, vertical: boolean }) =>
  <box
    orientation={vertical ?
      Gtk.Orientation.VERTICAL :
      Gtk.Orientation.HORIZONTAL}
    spacing={4}>
    <For
      each={bind(hyprland, "workspaces").as(ws => ws
        .filter(ws => ws.monitor === monitor)
        .sort((a, b) => a.id - b.id))}
      cleanup={child => child.run_dispose()}>
      {ws => {
        const focusedWs = bind(hyprland, "focusedWorkspace")
        const isFocused = focusedWs.as(focused =>
          focused === ws)
        const special = ws.id < 0
        return <Gtk.ToggleButton
          active={bind(hyprland, "focusedWorkspace").as(focused => focused === ws)}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
          cssClasses={["pill", "ws-button",
            isFocused ? "active" : "",
            special ? "special" : "",
            vertical ? "vert" : ""]}
          $clicked={() => {
            if (special)
              hyprland.message_async(
                "dispatch togglespecialworkspace scratchpad",
                null)
            if (!special && !isFocused)
              ws.focus()
          }}>
          <box
            spacing={4}
            orientation={vertical ?
              Gtk.Orientation.VERTICAL :
              Gtk.Orientation.HORIZONTAL}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}>
            <For
              each={bind(ws, "clients")}
              cleanup={child => child.run_dispose()}>
              {client => <image
                cssClasses={bind(hyprland, "focusedClient")
                  .as(focused => {
                    if (focused === client)
                      return ["focused"]
                    return ["unfocused"]
                  })}
                iconName={getIcon(client)} />}
            </For>
          </box>
        </Gtk.ToggleButton >
      }}
    </For>
  </box>

