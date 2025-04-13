import Adw from "gi://Adw?version=1";
import Notifd from "gi://AstalNotifd";
import { For, Gdk, Gtk } from "ags/gtk4";
import { bind } from "ags/state";
import Notification from "../common/notification";

const notifd = Notifd.get_default();

const DNDButton = () => <box spacing={4}>
  <image iconName={"notifications-disabled-symbolic"} />
  <label label={"Do Not Disturb"} />
  <switch
    valign={Gtk.Align.CENTER}
    active={bind(notifd, "dontDisturb")}
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    $={self =>
      self.connect("notify::active", self =>
        notifd.dontDisturb = self.state)} />
</box>

const ClearAllButton = () => <button
  halign={Gtk.Align.END}
  cursor={Gdk.Cursor.new_from_name("pointer", null)}
  $clicked={() => notifd.get_notifications().
    forEach(n => n.dismiss())}>
  <box spacing={4}>
    <image iconName={"edit-clear-all-symbolic"} />
    <label label={"Clear All"} />
  </box>
</button >

export default () =>
  <box
    orientation={Gtk.Orientation.VERTICAL}
    spacing={4}>
    <box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={4}>
      <label
        label={"Notifications"}
        cssClasses={["title-2"]} />
      <box
        halign={Gtk.Align.CENTER}
        spacing={4}>
        <DNDButton />
        <ClearAllButton />
      </box>
    </box>
    <Gtk.ScrolledWindow
      hscrollbarPolicy={Gtk.PolicyType.NEVER}
      vexpand>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={6}>
        <For each={bind(notifd, "notifications")
          .as(n => n.sort((a, b) => b.time - a.time))}>
          {n => <Notification
            notif={n}
            closeAction={n => n.dismiss()} />}
        </For>
        <Adw.StatusPage
          visible={bind(notifd, "notifications")
            .as(n => n.length < 1)}
          vexpand
          cssClasses={["compact"]}
          title={"No new Notifications"}
          description={"You're up-to-date"}
          iconName={"user-offline-symbolic"} />
      </box>
    </Gtk.ScrolledWindow>
  </box>