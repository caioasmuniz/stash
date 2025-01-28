import { bind, Variable } from "astal"
import Hyprland from "gi://AstalHyprland"
import Apps from "gi://AstalApps"
import { Gtk } from "astal/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import { ToggleButton } from "../../lib/astalified"

const hyprland = Hyprland.get_default()

const apps = new Apps.Apps({
  nameMultiplier: 4,
  entryMultiplier: 1,
  executableMultiplier: 1,
  descriptionMultiplier: 1,
})

const workspaces = Variable.derive([
  bind(hyprland, "focusedWorkspace"),
  bind(hyprland, "focusedClient"),
  bind(hyprland, "workspaces")],
  (focusWs, focusCli, ws) => ({
    data: ws,
    focusedWs: focusCli && focusCli?.workspace.id < 0 ?
      focusCli.workspace :
      focusWs
  }))

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
    {bind(workspaces).as(workspaces => workspaces.data
      .filter(ws => ws.monitor === monitor)
      .sort((a, b) => a.id - b.id)
      .map(ws => <ToggleButton
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
        onClicked={() => {
          if (workspaces.focusedWs.id < 0 || ws.id < 0)
            hyprland.message_async(
              "dispatch togglespecialworkspace scratchpad",
              null)
          if (ws.id > 0 && workspaces.focusedWs.id !== ws.id)
            ws.focus()
        }}
        active={workspaces.focusedWs === ws}
        cssClasses={["pill", "ws-button",
          workspaces.focusedWs === ws ? "active" : "",
          ws.id < 0 ? "special" : ""]}>
        <box
          spacing={4}
          vertical={vertical}
          halign={Gtk.Align.CENTER}
          valign={Gtk.Align.CENTER}>
          {bind(ws, "clients").as(clients =>
            clients.map(client => <image
              iconName={getIcon(client)} />
            ))}
        </box>
      </ToggleButton >))}
  </box>

