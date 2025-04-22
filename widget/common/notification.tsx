import Notifd from "gi://AstalNotifd";
import { bind } from "ags/state"
import { For, Gtk } from "ags/gtk4";
import GLib from "gi://GLib";

export default ({ notif, closeAction }: {
  notif: Notifd.Notification,
  closeAction: (notif: Notifd.Notification, self: Gtk.Widget) => void,
}) =>
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
        $clicked={self => closeAction(notif, self.parent.parent)}
        iconName={"window-close-symbolic"} />
    </box>
    <label
      wrap
      maxWidthChars={25}
      cssClasses={["body"]}
      label={notif.body} />
    <label
      label={GLib.DateTime
        .new_from_unix_local(notif.time)
        .format("%H:%M:%S") || "ERROR"} />
    <box cssClasses={["actions"]} spacing={4}>
      <For each={bind(notif, "actions")}>
        {action => <button
          $clicked={() =>
            notif.invoke(action.id)}>
          <label label={action.label} />
        </button>
        }
      </For>
    </box>
  </box> as Gtk.Widget