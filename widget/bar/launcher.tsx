import { bind } from "ags/state";
import { Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";

export default () => <Gtk.ToggleButton
  cursor={Gdk.Cursor.new_from_name("pointer", null)}
  // active={bind(App.get_window("applauncher")!, "visible")}
  cssClasses={["circular", "launcher"]}
  $clicked={() => App.toggle_window("applauncher")}>
  <image iconName={"nix-snowflake"} />
</Gtk.ToggleButton>
