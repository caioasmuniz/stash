import Notifd from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { For, createBinding } from "gnim"

export default ({ notif, closeAction }: {
  notif: Notifd.Notification,
  closeAction: (notif: Notifd.Notification, self: Gtk.Widget) => void,
}) =>
  <Gtk.Box
    name={notif.id.toString()}
    cssClasses={["card"]}
    spacing={8}
    orientation={Gtk.Orientation.VERTICAL}>
    <Gtk.Box spacing={8}>
      <Gtk.Image
        pixelSize={24}
        iconName={notif.app_icon} />
      <Gtk.Label
        wrap
        hexpand
        cssClasses={["title-4"]}
        label={notif.summary} />
      <Gtk.Button
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        cssClasses={["circular","destructive-action"]}
        onClicked={self => closeAction(notif, self.parent.parent)}
        iconName={"window-close-symbolic"} />
    </Gtk.Box>
    <Gtk.Label
      wrap
      maxWidthChars={25}
      cssClasses={["body"]}
      useMarkup={notif.body.startsWith('<')}
      label={notif.body} />
    <Gtk.Label
      label={GLib.DateTime
        .new_from_unix_local(notif.time)
        .format("%H:%M:%S") || "ERROR"} />
    <Gtk.Box cssClasses={["actions"]} spacing={4}>
      <For each={createBinding(notif, "actions")}>
        {(action: Notifd.Action) => <Gtk.Button
          onClicked={() =>
            notif.invoke(action.id)}>
          <Gtk.Label label={action.label} />
        </Gtk.Button>
        }
      </For>
    </Gtk.Box>
  </Gtk.Box> as Gtk.Widget