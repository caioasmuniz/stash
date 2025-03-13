import Notifd from "gi://AstalNotifd";
import { Gdk, Gtk } from "astal/gtk4";
import { bind } from "astal";
import notification from "../common/notification";
import { ScrolledWindow, StatusPage } from "../../lib/astalified";

const notifd = Notifd.get_default();

const DNDButton = () => <box spacing={4}>
  <image iconName={"notifications-disabled-symbolic"} />
  <label label={"Do Not Disturb"} />
  <switch
    valign={Gtk.Align.CENTER}
    active={bind(notifd, "dontDisturb")}
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    setup={self =>
      self.connect("notify::active", self =>
        notifd.dontDisturb = self.state)} />
</box>

const ClearAllButton = () => <button
  halign={Gtk.Align.END}
  cursor={Gdk.Cursor.new_from_name("pointer", null)}
  onClicked={() => notifd.get_notifications().
    forEach(n => n.dismiss())}>
  <box spacing={4}>
    <image iconName={"edit-clear-all-symbolic"} />
    <label label={"Clear All"} />
  </box>
</button >

export default () =>
  <box vertical spacing={4}>
    <box vertical spacing={4}>
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
    <ScrolledWindow
      hscrollbarPolicy={Gtk.PolicyType.NEVER}
      propagateNaturalHeight
      maxContentHeight={400}>
      <box
        vertical
        spacing={6}>
        {bind(notifd, "notifications").as(n =>
          n.length > 0 ?
            n.map(notification) :
            <StatusPage
              cssClasses={["compact"]}
              title={"No new Notifications"}
              description={"You're up-to-date"}
              iconName={"user-offline-symbolic"} />
        )}
      </box>
    </ScrolledWindow>
  </box>