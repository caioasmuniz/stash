import Tray from "gi://AstalTray";
import { Gtk } from "astal/gtk4";
import { bind } from "astal";

const tray = Tray.get_default();

export default () => <box
  spacing={8}
  halign={Gtk.Align.FILL}>
  {bind(tray, "items").as(items =>
    items.map(item =>
      <menubutton
        cssClasses={["circular"]}
        setup={self => {
          self.insert_action_group("dbusmenu", item.actionGroup)
        }}
        tooltipMarkup={bind(item, "tooltipMarkup")}
        popover={undefined}
        actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={item.menuModel}
        tooltip_markup={bind(item, "tooltip_markup")}>
        <image gicon={item.gicon} />
      </menubutton>
    ))}
</box >