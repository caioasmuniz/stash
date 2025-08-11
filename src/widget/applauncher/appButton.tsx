import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import Apps from "gi://AstalApps"

import App from "ags/gtk4/app";

export default ({ app }: { app: Apps.Application }) =>
  <Gtk.Button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    cssClasses={["app-button"]}
    onClicked={() => {
      App.get_window("applauncher")!.hide()
      app.launch();
    }}>
    <Gtk.Box spacing={8}>
      <Gtk.Image
        iconName={app.iconName || ""}
        pixelSize={48} />
      <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
        <Gtk.Label
          wrap
          cssClasses={["title-2"]}
          label={app.name}
          xalign={0} />
        <Gtk.Label
          cssClasses={["body"]}
          label={app.description}
          xalign={0}
          maxWidthChars={25}
          wrap />
      </Gtk.Box>
    </Gtk.Box>
  </Gtk.Button>