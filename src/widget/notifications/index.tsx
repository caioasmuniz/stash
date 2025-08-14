import Notifd from "gi://AstalNotifd";
import Hyprland from "gi://AstalHyprland";
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import AstalIO from "gi://AstalIO?version=0.1";
import { For, createBinding, createState, createComputed } from "gnim";
import Notification from "../common/notification";

export default ({ app, $ }: {
  app: Gtk.Application
  $: (self: Astal.Window) => void
}) => {
  const notifd = Notifd.get_default();
  const hyprland = Hyprland.get_default();

  const [notifs, setNotifs] = createState<Notifd.Notification[]>([])

  return <Astal.Window
    $={$}
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
    application={app}>
    <Gtk.Box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={4}
      $={() => notifd.connect("notified",
        (self, id) => {
          AstalIO.Time.timeout(5000, () =>
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
  </Astal.Window > as Astal.Window
}