import { createContext, createSettings } from "gnim";
import Gio from "gi://Gio?version=2.0";

export default () => {
  const s = createSettings(new Gio.Settings({
    schema_id: "stash.bar"
  }), schema)
  return {
    bar: s
  }
}

export const schema = Object.freeze({
  "position": "i",
  "temp-path": "s",
  "system-monitor": "s"
})

type Settings = ReturnType<typeof createSettings<typeof schema>>

export const SettingsContext = createContext<Settings | null>(null)

export function useSettings() {
  const settings = SettingsContext.use()
  if (!settings) throw Error("settings not in scope")
  return settings
}