import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Adw from "gi://Adw?version=1";
import general from "./general";
import { readFileAsync, writeFileAsync } from "ags/file";
import { State } from "ags/state";

export type Config = {
  barOrientation?: Gtk.Orientation
}

const PATH = "/run/user/1000/stash.json"

export default (config: State<Config>) => {
  const pages = [{
    title: "General",
    iconName: "preferences-desktop-appearance-symbolic",
    widget: general(config)
  }, {
    title: "Desktop",
    iconName: "preferences-desktop-display-symbolic",
    widget: <label label={"view 2"} /> as Gtk.Widget
  }];

  const stack =
    <Adw.ViewStack
      enableTransitions>
      {pages.map(page =>
        <Adw.ViewStackPage
          title={page.title}
          iconName={page.iconName}
          child={page.widget as Gtk.Widget} />)}
    </Adw.ViewStack> as Adw.ViewStack

  return <Adw.Window
    hideOnClose
    name={"settings"}
    application={app}
    cssClasses={["background"]}
    title={"Stash Settings"}
    $={() => {
      readFileAsync(PATH)
        .then(v => config.set(JSON.parse(v)))
        .catch(() => config.set({
          barOrientation: Gtk.Orientation.VERTICAL
        }))
      config.subscribe(async c =>
        await writeFileAsync(PATH, JSON.stringify(c))
      )
    }}>
    <box orientation={Gtk.Orientation.VERTICAL}>
      <Adw.InlineViewSwitcher
        cssClasses={["round"]}
        displayMode={Adw.InlineViewSwitcherDisplayMode.BOTH}
        stack={stack} />
      {stack}
    </box>
  </Adw.Window >
}