import Adw from "gi://Adw?version=1";
import Notifd from "gi://AstalNotifd";
import { Gdk, Gtk } from "ags/gtk4";
import { createBinding, For } from "ags";
import Notification from "../common/notification";

const notifd = Notifd.get_default();

const DNDButton = () => <box spacing={4}>
  <image iconName={"notifications-disabled-symbolic"} />
  <label label={"Do Not Disturb"} />
  <switch
    valign={Gtk.Align.CENTER}
    active={createBinding(notifd, "dontDisturb")}
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
    cssClasses={["notif-list"]}
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
        <For each={createBinding(notifd, "notifications")
          (n => n.sort((a, b) => b.time - a.time)
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
                closeAction={n => n.dismiss()}
              />
            return <Gtk.Expander
              cssClasses={["notif-expander"]}>
              <Notification
                _type="label"
                notif={n[0]}
                closeAction={n => n.dismiss()}
              />
              <box
                marginTop={4}
                spacing={4}
                orientation={Gtk.Orientation.VERTICAL}
              >
                {n.slice(1).map(notif =>
                  <Notification
                    notif={notif}
                    closeAction={n => n.dismiss()}
                  />
                )}
              </box>
            </Gtk.Expander>
          }

          }
        </For>
        <Adw.StatusPage
          visible={createBinding(notifd, "notifications")
            (n => n.length < 1)}
          vexpand
          cssClasses={["compact"]}
          title={"No new Notifications"}
          description={"You're up-to-date"}
          iconName={"user-offline-symbolic"} />
      </box>
    </Gtk.ScrolledWindow >
  </box >