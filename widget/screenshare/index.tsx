import { Astal, Gtk, For } from "ags/gtk4";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"
import { bind, State } from "ags/state";
import Adw from "gi://Adw";

const hyprland = Hyprland.get_default()

const outputs = new State<{
  monitors: Hyprland.Monitor[],
  clients: Hyprland.Client[]
}>({ monitors: [], clients: [] })


let response: (response: any) => void = () => { }

export function updateResponse(res: (response: any) => void) {
  response = res
}

export default () =>
  <window
    defaultWidth={300}
    valign={Gtk.Align.CENTER}
    name={"screenshare"}
    margin={12}
    application={App}
    cssClasses={["screenshare", "background"]}
    keymode={Astal.Keymode.ON_DEMAND}
    monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
    anchor={Astal.WindowAnchor.NONE}
  >
    <box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={8}
    >
      <label cssClasses={["title-1"]} label={"Share Picker"} />
      <Adw.ExpanderRow
        title={"monitors"}
        iconName={"preferences-desktop-display-symbolic"}
      >
        <For each={bind(hyprland, "monitors")}>
          {monitor =>
            <Adw.ActionRow
              title={`${monitor.name} (${monitor.id})`}
              subtitle={monitor.description}
              iconName={"preferences-desktop-display-symbolic"}
              activatable
              selectable
              $activated={self => {
                console.log(monitor.id)
                response(monitor.id)
                App.get_window("screenshare")!.visible = false;
              }} />}
        </For>
      </Adw.ExpanderRow>

      <Adw.ExpanderRow
        title={"Windows"}
        iconName={"tablet-symbolic"}
      >
        <For each={bind(hyprland, "clients")}>
          {client =>
            <Adw.ActionRow
              title={`${client.title} (${client.workspace.name})`}
              subtitle={client.class}
              iconName={"tablet-symbolic"}
              activatable
              selectable
              $activated={self => {
                console.log(client.address)
                response(client.address)
                App.get_window("screenshare")!.visible = false;
              }} />}
        </For>
      </Adw.ExpanderRow>
    </box >
  </window >
