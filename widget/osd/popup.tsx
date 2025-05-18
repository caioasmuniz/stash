import GObject, { signal } from "ags/gobject"
import { Gtk } from "ags/gtk4"
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
    visible={false}
    transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
    $={self =>
      connectable.connect(signal, () => {
        if (!self.revealChild) {
          self.visible = true
          self.revealChild = true
          timeout(TIMEOUT_MS, () => {
            self.revealChild = false
            timeout(200, () =>
              self.visible = false
            )
          })
        }
      })
    }>
    {widget}
  </revealer>
