import Gio from "gi://Gio?version=2.0";
import { createContext, createSettings } from "gnim";

const barSchema = {
  "position": "i",
  "temp-path": "s",
  "system-monitor": "s"
}

type Settings = { bar: ReturnType<typeof createSettings<typeof barSchema>> }

export const SettingsContext = createContext<Settings | null>(null)

export function initSettings(): Settings {
  return {
    bar: createSettings(
      new Gio.Settings({ schemaId: `${import.meta.domain}.bar` }),
      barSchema)
  }
}

export function useSettings() {
  const settings = SettingsContext.use()
  if (!settings) throw Error("settings not in scope")
  return settings
}