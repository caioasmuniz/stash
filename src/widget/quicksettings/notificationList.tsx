import Adw from "gi://Adw?version=1";
import Notifd from "gi://AstalNotifd";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { createBinding, For } from "gnim";
import Notification from "../common/notification";

export default () => {
  const notifd = Notifd.get_default();

  const Header = () => {

    const DNDButton = () => <Gtk.Box spacing={4}>
      <Gtk.Image iconName={"notifications-disabled-symbolic"} />
      <Gtk.Label label={"Do Not Disturb"} />
      <Gtk.Switch
        valign={Gtk.Align.CENTER}
        active={createBinding(notifd, "dontDisturb")}
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
        $={self =>
          self.connect("notify::active", self =>
            notifd.dontDisturb = self.state)} />
    </Gtk.Box>

    const ClearAllButton = () => <Gtk.Button
      halign={Gtk.Align.END}
      cursor={Gdk.Cursor.new_from_name("pointer", null)}
      onClicked={() => notifd.get_notifications().
        forEach(n => n.dismiss())}>
      <Gtk.Box spacing={4}>
        <Gtk.Image iconName={"edit-clear-all-symbolic"} />
        <Gtk.Label label={"Clear All"} />
      </Gtk.Box>
    </Gtk.Button >

    return <Gtk.Box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={4}>
      <Gtk.Label
        label={"Notifications"}
        cssClasses={["title-2"]}
      />
      <Gtk.Box
        halign={Gtk.Align.CENTER}
        spacing={4}>
        <DNDButton />
        <ClearAllButton />
      </Gtk.Box>
    </Gtk.Box>
  }

  return <Gtk.Box
    orientation={Gtk.Orientation.VERTICAL}
    cssClasses={["notif-list"]}
    spacing={4}>
    <Header />
    <Gtk.Box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={6}>
      <For each={createBinding(notifd, "notifications")
        .as(n => n
          .sort((a, b) => b.time - a.time)
          .reduce((res, notif) => {
            const i = res.findIndex(n =>
              n[0].appName === notif.appName)
            if (i === -1)
              res.push([notif]);
            else
              res[i].push(notif);
            return res;
          }, [] as Notifd.Notification[][]))
      }>
        {(n: Notifd.Notification[]) => {
          if (n.length === 1)
            return <Notification
              notif={n[0]}
              closeAction={n => n.dismiss()} />
          return <Adw.ExpanderRow
          // title={n[0].appName}
          // iconName={n[0].appIcon}
          >
            <Notification
              $type="prefix"
              notif={n[0]}
              closeAction={n => n.dismiss()} />
            {n.map(notif =>
              <Notification
                notif={notif}
                closeAction={n => n.dismiss()} />
            )}
          </Adw.ExpanderRow>
        }}
      </For>
      <Adw.StatusPage
        visible={createBinding(notifd, "notifications")
          .as(n => n.length < 1)}
        vexpand
        cssClasses={["compact"]}
        title={"No new Notifications"}
        description={"You're up-to-date"}
        iconName={"user-offline-symbolic"} />
    </Gtk.Box>
  </Gtk.Box >
}