import { bind } from "astal";
import { Gdk } from "astal/gtk4";
import App from "astal/gtk4/app";
import { ToggleButton } from "../../lib/astalified";

export default () => <ToggleButton
  cursor={Gdk.Cursor.new_from_name("pointer", null)}
  active={bind(App.get_window("applauncher")!, "visible")}
  cssClasses={["circular", "launcher"]}
  onClicked={() => App.toggle_window("applauncher")}>
  <image iconName={"nix-snowflake"} />
</ToggleButton>
