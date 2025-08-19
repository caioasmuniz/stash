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
  declare private osd: Astal.Window
  declare private applauncher: Astal.Window
  declare private notifications: Astal.Window
  declare private bar: Astal.Window
  declare private quicksettings: Astal.Window
  declare private settings: Adw.Window

  constructor() {
    super({
      applicationId: import.meta.domain,
      flags: Gio.ApplicationFlags.FLAGS_NONE,
    })
  }

  vfunc_activate(): void {
    createRoot((dispose) => {
      this.connect("shutdown", dispose)
      return <SettingsContext value={initSettings()}>
        {() => <>
          <Osd app={this}
            $={(self) => (this.osd = self).present()}
          />
          <Applauncher app={this}
            $={(self) => (this.applauncher = self)}
          />
          <Notifications app={this}
            $={(self) => (this.notifications = self).present()}
          />
          <Bar app={this}
            $={(self) => (this.bar = self).present()}
          />
          <Quicksettings app={this}
            $={(self) => (this.quicksettings = self)}
          />
          <Settings app={this}
            $={(self) => (this.settings = self)}
          />
        </>}
      </SettingsContext>
    })
  }
}
