import Notifd from "gi://AstalNotifd";
import Hyprland from "gi://AstalHyprland";
import App from "ags/gtk4/app";
import { bind, observe, State, sync } from "ags/state";
import { Astal, For, Gtk } from "ags/gtk4";

import Notification from "../common/notification";
import { timeout } from "ags/time";

const notifd = Notifd.get_default();
const hyprland = Hyprland.get_default();

// const notifs = new State<Notifd.Notification[]>([]);
const notifs = new State<Notifd.Notification[]>([])

export default () => <window
  name={"notifications"}
  cssClasses={["notif-popup"]}
  visible={bind(notifd, "dontDisturb").as(dnd => !dnd)}
  anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
  monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
  // exclusivity={Astal.Exclusivity.EXCLUSIVE}
  application={App}>
  <box
    orientation={Gtk.Orientation.VERTICAL}
    spacing={4}
    $={() => notifd.connect("notified", (self, id) => {
      timeout(5000, () => notifs.set(notifs.get().filter(n => id !== n.id)))
      notifs.set(notifs.get().concat(notifd.get_notification(id)))
    })}>
    <For each={bind(notifs).as(n => n.reverse())}>
      {n => <Notification
        closeAction={() => notifs.set(notifs.get().filter(notif => n !== notif))}
        notif={n} />
      }
    </For>
  </box>
</window >
