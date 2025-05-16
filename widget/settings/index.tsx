import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Adw from "gi://Adw?version=1";
import general from "./general";
import GObject from "ags/gobject";

const pages: {
  title: string,
  iconName: string,
  widget: GObject.Object
}[] = [{
  title: "General",
  iconName: "preferences-desktop-appearance-symbolic",
  widget: general()
}, {
  title: "Desktop",
  iconName: "preferences-desktop-display-symbolic",
  widget: <label label={"view 2"} /> as Gtk.Widget
}];

const stack =
  <Adw.ViewStack>
    {pages.map(page =>
      <Adw.ViewStackPage
        title={page.title}
        iconName={page.iconName}
        child={page.widget as Gtk.Widget} />)}
  </Adw.ViewStack> as Adw.ViewStack

export default () =>
  <Adw.Window
    visible
    name={"settings"}
    application={app}
    cssClasses={["background"]}>
    <Adw.NavigationPage>
      <box orientation={Gtk.Orientation.VERTICAL}>
        <Adw.HeaderBar>
          <Adw.ViewSwitcher stack={stack} />
        </Adw.HeaderBar>
        {stack}
      </box>
    </Adw.NavigationPage>
  </Adw.Window >