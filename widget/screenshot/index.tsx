import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { execAsync } from "ags/process";

export default () => <window
  name={"screenshot"}
  application={app}
  margin={48}
  anchor={Astal.WindowAnchor.BOTTOM}
>
  <box
    css={"padding: 8px;"}
    spacing={8}>
    <button
      $clicked={async () => {
        app.get_window("screenshot")!.visible = false;
        await execAsync("hyprshot -m output")
      }}>
      <box
        css={"padding: 8px;"}
        orientation={Gtk.Orientation.VERTICAL}>
        <image
          iconName={"computer-symbolic"}
          pixelSize={48} />
        <label label={"Screen"} />
      </box>
    </button>

    <button
      $clicked={async () => {
        app.get_window("screenshot")!.visible = false;
        await execAsync("hyprshot -m window")
      }}>
      <box
        css={"padding: 8px;"}
        orientation={Gtk.Orientation.VERTICAL}>
        <image
          iconName={"computer-apple-ipad-symbolic"}
          pixelSize={48} />
        <label label={"Window"} />
      </box>
    </button>

    <button
      $clicked={async () => {
        app.get_window("screenshot")!.visible = false;
        await execAsync("hyprshot -m region")
      }}>
      <box
        css={"padding: 8px;"}
        orientation={Gtk.Orientation.VERTICAL}>
        <image
          iconName={"adw-tab-icon-missing-symbolic"}
          pixelSize={48} />
        <label label={"Region"} />
      </box>
    </button>
  </box>
</window>