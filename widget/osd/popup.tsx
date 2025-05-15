import GObject, { signal } from "ags/gobject"
import { Gtk } from "ags/gtk4"
import { Binding } from "ags/state"
import { timeout } from "ags/time"

const TIMEOUT_MS = 2000

export default ({ widget, connectable, signal }: {
  widget: Gtk.Widget,
  connectable: GObject.Object,
  signal: string,
}) =>
  <revealer
    transitionDuration={200}
    revealChild={false}
    transitionType={Gtk.RevealerTransitionType.SWING_DOWN}
    $={self =>
      connectable.connect(signal, () => {
        if (!self.revealChild) {
          self.revealChild = true
          timeout(TIMEOUT_MS, () =>
            self.revealChild = false)
        }
      })
    }>
    {widget}
  </revealer>
