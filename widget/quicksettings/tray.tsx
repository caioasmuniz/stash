import Tray from "gi://AstalTray";
import { Gtk, For } from "ags/gtk4";
import { bind } from "ags/state";

const tray = Tray.get_default();

export default () => <box
  spacing={8}
  halign={Gtk.Align.FILL}>
  <For each={bind(tray, "items")}>
    {(item =>
      <Gtk.MenuButton
        cssClasses={["circular"]}
        $={self => {
          self.insert_action_group("dbusmenu", item.actionGroup)
        }}
        tooltipMarkup={bind(item, "tooltipMarkup")}
        popover={undefined}
        //actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={item.menuModel}
        tooltip_markup={bind(item, "tooltip_markup")}>
        <image gicon={item.gicon} />
      </Gtk.MenuButton>
    )}
  </For>
</box >