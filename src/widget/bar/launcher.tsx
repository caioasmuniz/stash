import Gdk from "gi://Gdk?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "gnim";
import { App } from "../../App";

export default ({ app }: { app: App }) => {
  return <Gtk.ToggleButton
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    active={createBinding(app.applauncher, "visible")}
    cssClasses={["circular", "launcher"]}
    onClicked={() =>
      app.applauncher.visible = !app.applauncher.visible
    }>
    <Gtk.Image iconName={"nix-snowflake"} />
  </Gtk.ToggleButton>
}
