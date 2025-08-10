import Tray from "gi://AstalTray";
import { Gtk } from "ags/gtk4";
import { createBinding, For } from "ags";

const tray = Tray.get_default();

export default () => <box
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
        <image gicon={item.gicon} />
      </Gtk.MenuButton>
    )}
  </For>
</box >