import Notifd from "gi://AstalNotifd";
import { bind } from "astal"
import { Gtk } from "astal/gtk4";

export default (notif: Notifd.Notification) =>
  <box
    name={notif.id.toString()}
    cssClasses={["notification"]}
    vertical>
    <box spacing={8}>
      <image iconName={notif.app_icon} />
      <box vertical>
        <box>
          <label
            cssClasses={["title"]}
            hexpand
            label={notif.summary} />
          <button
            halign={Gtk.Align.END}
            cssClasses={["circular"]}
            onClicked={() => notif.dismiss()}>
            <image iconName={"window-close-symbolic"} />
          </button>
        </box>
        <label
          wrap
          maxWidthChars={25}
          cssClasses={["body"]}
          label={notif.body} />
      </box>
    </box>
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