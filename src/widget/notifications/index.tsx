import Notifd from "gi://AstalNotifd";
import Hyprland from "gi://AstalHyprland";
import App from "ags/gtk4/app";
import { Astal, Gtk } from "ags/gtk4";
import { For, createBinding, Accessor, createState, createComputed } from "ags";

import Notification from "../common/notification";
import { timeout } from "ags/time";

const notifd = Notifd.get_default();
const hyprland = Hyprland.get_default();

const [notifs, setNotifs] = createState<Notifd.Notification[]>([])

export default () => <Astal.Window
  name={"notifications"}
  margin={12}
  cssClasses={["notif-popup"]}
  visible={createComputed([notifs, createBinding(notifd, "dontDisturb")],
    (notifs, dnd) => notifs.length > 0 && !dnd)
  }
  anchor={
    Astal.WindowAnchor.RIGHT |
    Astal.WindowAnchor.TOP |
    Astal.WindowAnchor.BOTTOM}
  monitor={createBinding(hyprland, "focusedMonitor")(m => m.id)}
  application={App}>
  <Gtk.Box
    orientation={Gtk.Orientation.VERTICAL}
    spacing={4}
    $={() => notifd.connect("notified",
      (self, id) => {
        timeout(5000, () =>
          setNotifs(notifs.get().filter(n => id !== n.id)))
        setNotifs(notifs.get().concat(notifd.get_notification(id)))
      })}>
    <For each={notifs(n => n.reverse())}>
      {(n: Notifd.Notification) =>
        <Notification
          closeAction={() => setNotifs(
            notifs.get().filter(notif => n !== notif))}
          notif={n} />
      }
    </For>
  </Gtk.Box>
</Astal.Window >
