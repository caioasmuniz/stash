import Notifd from "gi://AstalNotifd";
import { bind } from "astal"
import { Gtk } from "astal/gtk4";

export default (notif: Notifd.Notification) =>
  <box
    name={notif.id.toString()}
    cssClasses={["notification"]}
    spacing={8}
    vertical>
    <box spacing={8}>
      <image 
      pixelSize={24}
      iconName={notif.app_icon} />
      <label
        wrap
        hexpand
        cssClasses={["title-4"]}
        label={notif.summary} />
      <button
        halign={Gtk.Align.END}
        valign={Gtk.Align.CENTER}
        cssClasses={["circular"]}
        onClicked={() => notif.dismiss()}
        iconName={"window-close-symbolic"} />
    </box>
    <label
      wrap
      maxWidthChars={25}
      cssClasses={["body"]}
      label={notif.body} />
    <box cssClasses={["actions"]} spacing={4}>
      {bind(notif, "actions").as(n =>
        n.map((action) =>
          <button
            onClicked={() =>
              notif.invoke(action.id)}>
            <label label={action.label} />
          </button>
        ))}
    </box>
  </box>