import GLib from "gi://GLib?version=2.0";
import GObject from "gi://GObject?version=2.0";
import AstalIO from "gi://AstalIO?version=0.1";
import Astal from "gi://Astal?version=4.0";
import BarSettings from "./bar";
import { getter, register } from "gnim/gobject";

const PATH = GLib.build_filenamev([
  GLib.get_home_dir(), ".config",
  GLib.getenv("ENV") === "dev" ?
    "stash-dev.json" :
    "stash.json"
])

@register({ GTypeName: "Settings" })
export default class Settings extends GObject.Object {
  static instance: Settings;
  static get_default() {
    if (!this.instance) this.instance = new Settings();
    return this.instance;
  }

  #bar: BarSettings

  @getter(BarSettings)
  get bar() {
    return this.#bar;
  }

  #updateFile() {
    AstalIO.write_file_async(PATH, JSON.stringify({
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
      let file = AstalIO.read_file(PATH)
      if (file !== "")
        config = JSON.parse(file)
      else
        AstalIO.write_file_async(PATH, JSON.stringify(config))
    } catch (error) {
      AstalIO.write_file_async(PATH, JSON.stringify(config))
    }
    this.#bar = new BarSettings(config.bar)
    this.#bar.connect("update-file",
      () => this.#updateFile())
  }
}
