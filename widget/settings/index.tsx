import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Adw from "gi://Adw?version=1";
import General from "./general";

export default () => {
  return <Adw.Window
    hideOnClose
    name={"settings"}
    application={app}
    cssClasses={["background"]}
    title={"Stash Settings"}>
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Adw.PreferencesPage>
        <General />
      </Adw.PreferencesPage>
    </box>
  </Adw.Window >
}