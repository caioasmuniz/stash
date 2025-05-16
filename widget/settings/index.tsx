import app from "ags/gtk4/app";
import Adw from "gi://Adw?version=1";

export default () =>
  <Adw.Window
    name={"settings"}
    application={app}
    cssClasses={["background"]}
  >
    <box>
      <label label={"SETTINGS"} />
    </box>
  </Adw.Window>