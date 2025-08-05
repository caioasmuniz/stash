import { createBinding } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";

export default () => <Gtk.ToggleButton
  cursor={Gdk.Cursor.new_from_name("pointer", null)}
  active={createBinding(App.get_window("applauncher")!, "visible")}
  cssClasses={["circular", "launcher"]}
  onClicked={() => App.toggle_window("applauncher")}>
  <Gtk.Image iconName={"nix-snowflake"} />
</Gtk.ToggleButton>
