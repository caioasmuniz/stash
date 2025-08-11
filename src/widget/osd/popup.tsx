import AstalIO from "gi://AstalIO?version=0.1"
import GObject from "gi://GObject?version=2.0"
import Gtk from "gi://Gtk?version=4.0"

const TIMEOUT_MS = 2000

export default ({ widget, connectable, signal }: {
  widget: Gtk.Widget,
  connectable: GObject.Object,
  signal: string,
}) =>
  <Gtk.Revealer
    transitionDuration={200}
    revealChild={false}
    visible={false}
    transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
    $={self =>
      connectable.connect(signal, () => {
        if (!self.revealChild) {
          self.visible = true
          self.revealChild = true
          AstalIO.Time.timeout(TIMEOUT_MS, () => {
            self.revealChild = false
            AstalIO.Time.timeout(200, () =>
              self.visible = false
            )
          })
        }
      })
    }>
    {widget}
  </Gtk.Revealer>
