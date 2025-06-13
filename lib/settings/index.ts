import { readFile, writeFileAsync } from "ags/file";
import { register, Object, getter } from "ags/gobject";
import { Astal } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";
import BarSettings from "./bar";

const PATH = GLib.build_filenamev([
  GLib.get_home_dir(), ".config",
  GLib.getenv("ENV") === "dev" ?
    "stash-dev.json" :
    "stash.json"
])

@register({ GTypeName: "Settings" })
export default class Settings extends Object {
  static instance: Settings;
  static get_default() {
    if (!this.instance) this.instance = new Settings();
    return this.instance;
  }

  #bar: BarSettings

  @getter(Object)
  get bar() {
    return this.#bar;
  }

  #updateFile() {
    writeFileAsync(PATH, JSON.stringify({
      bar: this.#bar.objectify()
    }))
  }

  constructor() {
    super();
    let config = {
      bar: {
        position: Astal.WindowAnchor.LEFT,
        tempPath: "",
        systemMonitor: ""
      }
    }
    try {
      let file = readFile(PATH)
      if (file !== "")
        config = JSON.parse(file)
      else
        writeFileAsync(PATH, JSON.stringify(config))
    } catch (error) {
      writeFileAsync(PATH, JSON.stringify(config))
    }
    this.#bar = new BarSettings(config.bar)
    this.#bar.connect("update-file",
      () => this.#updateFile())
  }
}
