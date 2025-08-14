import { Accessor, createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"
import Hyprland from "gi://AstalHyprland"
import Apps from "gi://AstalApps"
import Adw from "gi://Adw?version=1"

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
      return apps.fuzzy_query(client.class)[0]?.iconName ||
        apps.fuzzy_query(client.title)[0]?.iconName ||
        apps.fuzzy_query(client.initialTitle)[0]?.iconName ||
        "image-missing-symbolic"
  }
}

export default ({ monitor, vertical }:
  { monitor: Hyprland.Monitor, vertical: Accessor<boolean> }) =>
  <box
    orientation={vertical.as(v => v ?
      Gtk.Orientation.VERTICAL :
      Gtk.Orientation.HORIZONTAL)}
    spacing={8}>
    <For each={createBinding(hyprland, "workspaces")
      (ws => ws
        .filter(ws => ws.monitor === monitor)
        .sort((a, b) => a.id - b.id)
      )
    }>
      {(ws: Hyprland.Workspace) => <Adw.ToggleGroup
        orientation={vertical.as(v => v ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL)}
        cssClasses={["round", "ws-toggle",
          ws.id < 0 ? "special" : ""]}
        onNotifyActive={self => {
          if (hyprland.focusedClient && self.activeName !== null &&
            hyprland.focusedClient.address !== self.activeName
          )
            hyprland.get_client(self.get_active_name() ?? "")
              ?.focus()
        }}
        $={self => createBinding(hyprland, "focusedClient")
          .subscribe(() => {
            const f = hyprland.focusedClient
            if (f) {
              if (f.workspace === ws)
                self.activeName = f.address
              else
                self.active = 128
            }
          })
        }>
        <For each={createBinding(ws, "clients")}>
          {(client: Hyprland.Client) =>
            <Adw.Toggle
              name={client.address}
              iconName={getIcon(client)}
            />
          }
        </For>
      </Adw.ToggleGroup>}
    </For>
  </box >

