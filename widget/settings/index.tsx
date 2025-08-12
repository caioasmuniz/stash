import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";
import General from "./general";
import Bar from "./bar";

import app from "ags/gtk4/app";

export default () => {
  return <Adw.Window
    hideOnClose
    visible
    name={"settings"}
    application={app}
    cssClasses={["background"]}
    title={"Stash Settings"}>
    <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
      <Adw.PreferencesPage>
        <General />
        <Bar />
      </Adw.PreferencesPage>
    </Gtk.Box>
  </Adw.Window >
}