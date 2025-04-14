import Notifd from "gi://AstalNotifd";
import Hyprland from "gi://AstalHyprland";
import App from "ags/gtk4/app";
import { bind, derive, State } from "ags/state";
import { Astal, For, Gtk } from "ags/gtk4";

import Notification from "../common/notification";
import { timeout } from "ags/time";

const notifd = Notifd.get_default();
const hyprland = Hyprland.get_default();

const notifs = new State<Notifd.Notification[]>([])
const visible = derive(bind(notifs), bind(notifd, "dontDisturb"),
  (notifs, dnd) => notifs.length > 0 && !dnd)

export default () => <window
  name={"notifications"}
  margin={12}
  cssClasses={["notif-popup"]}
  visible={bind(visible)}
  anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
  monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
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
