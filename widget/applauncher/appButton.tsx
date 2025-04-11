import Apps from "gi://AstalApps"
import { Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";


export default ({ app }: { app: Apps.Application }) =>
  <button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={["app-button"]}
    $clicked={() => {
      App.get_window("applauncher")!.hide()
      app.launch();
    }}>
    <box spacing={8}>
      <image
        iconName={app.iconName || ""}
        pixelSize={48} />
      <box orientation={Gtk.Orientation.VERTICAL}>
        <label
          wrap
          cssClasses={["title-2"]}
          label={app.name}
          xalign={0} />
        <label
          cssClasses={["body"]}
          label={app.description}
          xalign={0}
          maxWidthChars={25}
          wrap />
      </box>
    </box>
  </button>