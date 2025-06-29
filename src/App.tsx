import Adw from "gi://Adw"
import Gio from "gi://Gio"
import GObject, { register } from "gnim/gobject"
import { createContext, createRoot, createSettings } from "gnim"
import { schema, SettingsContext } from "./settings"
import Osd from "./widget/osd"

@register()
export class App extends Adw.Application {
  declare private osd: GObject.Object

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

      // const settings = createSettings(
      //   new Gio.Settings({ schemaId: import.meta.domain }),
      //   schema)

      // return <SettingsContext value={settings}>
      //   {() =>
      //     <Osd app={this} ref={(self) => (this.osd = self)} />
      //   }
      // </SettingsContext>

      const Ctx = createContext(null)
      return <Ctx value={null}>
        {() =>
          <Osd app={this} ref={(self) => (this.osd = self)} />
        }
      </Ctx>
    })
  }

  vfunc_activate(): void {
    this.osd
  }
}
