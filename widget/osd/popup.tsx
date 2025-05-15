import { Gtk } from "ags/gtk4"
import { Binding } from "ags/state"
import { timeout } from "ags/time"

const TIMEOUT_MS = 2000

export default ({ widget, observable }: {
  widget: Gtk.Widget,
  observable: Binding<number>,
}) =>
  <revealer
    transitionDuration={200}
    revealChild={false}
    transitionType={Gtk.RevealerTransitionType.SWING_DOWN}
    $={self =>
      observable.subscribe(() => {
        if (!self.revealChild) {
          self.revealChild = true
          timeout(TIMEOUT_MS, () =>
            self.revealChild = false)
        }
      })}>
    {widget}
  </revealer>
