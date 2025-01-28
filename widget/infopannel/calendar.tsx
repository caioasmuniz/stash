import GObject from "gi://GObject"
import { Gtk, astalify, type ConstructProps } from "astal/gtk4"

type CalendarProps = ConstructProps<Gtk.Calendar, Gtk.Calendar.ConstructorProps>
const Cal = astalify<Gtk.Calendar, Gtk.Calendar.ConstructorProps>(Gtk.Calendar, {
    // if it is a container widget, define children setter and getter here
    getChildren(self) { return [] },
    setChildren(self, children) {},
})

export function Calendar() {
    function setup(button: Gtk.Calendar) {

    }

    return <Cal
        setup={setup}
        onDaySelected={(self) => {
            print(self.day)
        }}
    />
}