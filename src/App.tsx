import Adw from "gi://Adw"
import Gio from "gi://Gio"
import Astal from "gi://Astal?version=4.0";
import { createRoot } from "gnim";
import { register } from "gnim/gobject"
import { initSettings, SettingsContext } from "lib/settings";
import Osd from "./widget/osd"
import Applauncher from "widget/applauncher";
import Notifications from "widget/notifications";
import Bar from "widget/bar";
import Quicksettings from "widget/quicksettings";
import Settings from "widget/settings";

@register()
export class App extends Adw.Application {
  declare osd: Astal.Window
  declare applauncher: Astal.Window
  declare notifications: Astal.Window
  declare bar: Astal.Window
  declare quicksettings: Astal.Window
  declare settings: Adw.Window

  constructor() {
    super({
      applicationId: import.meta.domain,
      flags: Gio.ApplicationFlags.FLAGS_NONE,
    })
  }

  vfunc_startup(): void {
    super.vfunc_startup()
    createRoot((dispose) => {
      this.connect("shutdown", dispose)
      return <SettingsContext value={initSettings()}>
        {() => <>
          <Osd app={this}
            $={(self) => (this.osd = self)} />
          <Applauncher app={this}
            $={(self) => (this.applauncher = self)} />
          <Notifications app={this}
            $={(self) => (this.notifications = self)} />
          <Quicksettings app={this}
            $={(self) => (this.quicksettings = self)} />
          <Bar app={this}
            $={(self) => (this.bar = self)} />
          <Settings app={this}
            $={(self) => (this.settings = self)} />
        </>}
      </SettingsContext>
    })
  }

  vfunc_activate(): void {
    this.bar.present()
  }
}
