import Notifd from "gi://AstalNotifd";
import Hyprland from "gi://AstalHyprland";
import { App, Astal } from "astal/gtk4";
import { bind, timeout } from "astal";

import notification from "../common/notification";

const notifd = Notifd.get_default();
const hyprland = Hyprland.get_default();

const onNotified = (self: Astal.Box, notifd: Notifd.Notifd, id: number) => {
  const n = notifd.get_notification(id)
  const onResolved = () => notifd
    .emit("resolved", id, Notifd.ClosedReason.EXPIRED)

  if (n.expire_timeout === -1) {
    switch (n.urgency) {
      case Notifd.Urgency.LOW:
        timeout(3000, onResolved)
        break;
      case Notifd.Urgency.NORMAL:
        timeout(5000, onResolved)
        break;
      case Notifd.Urgency.CRITICAL:
        timeout(10000, onResolved)
        break;
    }
  }
  self.children = [notification(n), ...self.children]
}

export default () => <window
  name={"notifications"}
  cssClasses={["notif-popup"]}
  visible={bind(notifd, "dontDisturb").as(dnd => !dnd)}
  anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP}
  monitor={bind(hyprland, "focusedMonitor").as(m => m.id)}
  exclusivity={Astal.Exclusivity.EXCLUSIVE}
  application={App}>
  <box vertical spacing={4}
    setup={self => {
      notifd.connect("notified", (notifd, id) =>
        onNotified(self, notifd, id))
      notifd.connect("resolved", (_, id, reason) => {
        self.children = self.children.filter(n =>
          Number(n.name) !== id)
      })
    }} />
</window >
