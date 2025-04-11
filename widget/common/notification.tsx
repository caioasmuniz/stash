import Notifd from "gi://AstalNotifd";
import { bind } from "ags/state"
import { For, Gtk } from "ags/gtk4";

export default (
  notif: Notifd.Notification,
  closeAction: (notif: Notifd.Notification, self: Gtk.Widget) => void) =>
  <box
    name={notif.id.toString()}
    cssClasses={["notification"]}
    spacing={8}
    orientation={Gtk.Orientation.VERTICAL}>
    <box spacing={8}>
      <image
        pixelSize={24}
        iconName={notif.app_icon} />
      <label
        wrap
        hexpand
        cssClasses={["title-4"]}
        label={notif.summary} />
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        cssClasses={["circular"]}
        $clicked={self => closeAction(notif, self)}
        iconName={"window-close-symbolic"} />
    </box>
    <label
      wrap
      maxWidthChars={25}
      cssClasses={["body"]}
      label={notif.body} />
    <box cssClasses={["actions"]} spacing={4}>
      <For
        each={bind(notif, "actions")}
        cleanup={self => self.run_dispose()}>
        {action => <button
          $clicked={() =>
            notif.invoke(action.id)}>
          <label label={action.label} />
        </button>
        }
      </For>
    </box>
  </box> as Gtk.Widget