import Notifd from "gi://AstalNotifd";
import { For, Gdk, Gtk } from "ags/gtk4";
import { bind } from "ags/state";
import notification from "../common/notification";

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
      propagateNaturalHeight
      maxContentHeight={400}>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={6}>
        <For
          each={bind(notifd, "notifications")}
          cleanup={self => self.run_dispose()}>
          {n => notification(n, notif => notif.dismiss())}
        </For>
      </box>
    </Gtk.ScrolledWindow>
  </box>