import Gdk from "gi://Gdk?version=4.0";
import Gtk from "gi://Gtk?version=4.0";

// import App from "ags/gtk4/app";

export default () => <Gtk.ToggleButton
  cursor={Gdk.Cursor.new_from_name("pointer", null)}
  // active={createBinding(App.get_window("applauncher")!, "visible")}
  cssClasses={["circular", "launcher"]}
  // onClicked={() => App.toggle_window("applauncher")}
  >
  <Gtk.Image iconName={"nix-snowflake"} />
</Gtk.ToggleButton>
