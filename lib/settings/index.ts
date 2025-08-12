import { createSettings } from "gnim";
import Gio from "gi://Gio?version=2.0";

export default () => {
  const s = createSettings(new Gio.Settings({
    schema_id: "stash.bar"
  }), {
    "position": "i",
    "temp-path": "s",
    "system-monitor": "s"
  })
  return {
    bar: s
  }
}

