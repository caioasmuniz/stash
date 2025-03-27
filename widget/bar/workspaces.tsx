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

// const workspaces = Variable.derive([
//   bind(hyprland, "focusedWorkspace"),
//   bind(hyprland, "focusedClient"),
//   bind(hyprland, "workspaces")],
//   (focusWs, focusCli, ws) => ({
//     data: ws,
//     focusedWs: focusCli && focusCli?.workspace.id < 0 ?
//       focusCli.workspace :
//       focusWs
//   }))

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
  <box vertical={vertical} spacing={4}>
    <For each={bind(hyprland, "workspaces").as(ws => ws
      .filter(ws => ws.monitor === monitor)
      .sort((a, b) => a.id - b.id))}>
      {ws =>
        <Gtk.ToggleButton
          // active={workspaces.focusedWs === ws}
          cursor={Gdk.Cursor.new_from_name("pointer", null)}
          cssClasses={["pill", "ws-button",
            // workspaces.focusedWs === ws ? "active" : "",
            ws.id < 0 ? "special" : "",
            vertical ? "vert" : ""]}
          $clicked={() => {
            // if (workspaces.focusedWs.id < 0 || ws.id < 0)
            //   hyprland.message_async(
            //     "dispatch togglespecialworkspace scratchpad",
            //     null)
            // if (ws.id > 0 && workspaces.focusedWs.id !== ws.id)
            ws.focus()
          }}>
          <box
            spacing={4}
            vertical={vertical}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}>
            <For each={bind(ws, "clients")}>
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
        </Gtk.ToggleButton >}
    </For>
  </box>

