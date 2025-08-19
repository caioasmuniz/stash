import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";
import Bar from "./bar";

export default ({ app, $ }: {
  app: Gtk.Application
  $?: (self: Adw.Window) => void
}) => {
  return <Adw.Window
    $={$}
    hideOnClose
    name={"settings"}
    application={app}
    cssClasses={["background"]}
    title={"Stash Settings"}>
    <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
      <Adw.HeaderBar
        titleWidget={
          <Adw.WindowTitle
            title={"Stash Settings"}
            cssClasses={["title-2"]}
          /> as Gtk.Widget} />
      <Adw.PreferencesPage>
        {/* <General /> */}
        <Bar />
      </Adw.PreferencesPage>
    </Gtk.Box>
  </Adw.Window >
}