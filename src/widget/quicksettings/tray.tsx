import Tray from "gi://AstalTray";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding, For } from "gnim";

const tray = Tray.get_default();

export default () => <Gtk.Box
  spacing={8}
  halign={Gtk.Align.FILL}>
  <For each={createBinding(tray, "items")}>
    {((item: Tray.TrayItem) =>
      <Gtk.MenuButton
        cssClasses={["circular"]}
        $={self => {
          self.insert_action_group("dbusmenu", item.actionGroup)
        }}
        tooltipMarkup={createBinding(item, "tooltipMarkup")}
        popover={undefined}
        //actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={item.menuModel}
        tooltip_markup={createBinding(item, "tooltip_markup")}>
        <Gtk.Image gicon={item.gicon} />
      </Gtk.MenuButton>
    )}
  </For>
</Gtk.Box >