import { readFile, writeFileAsync } from "ags/file";
import GObject, { register, property } from "ags/gobject";
import { Astal } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";

const PATH = GLib.build_filenamev([
  GLib.get_home_dir(), ".config", "stash.json"])

@register({ GTypeName: "Settings" })
export default class Settings extends GObject.Object {
  static instance: Settings;
  static get_default() {
    if (!this.instance) this.instance = new Settings();
    return this.instance;
  }

  #barPosition: Astal.WindowAnchor
  #tempPath: string | null
  #systemMonitor: string | null

  @property(String)
  get tempPath() {
    return this.#tempPath;
  }

  @property(String)
  get systemMonitor() {
    return this.#systemMonitor
  }

  @property(Number)
  get barPosition() {
    return this.#barPosition;
  }

  set barPosition(position) {
    if (Object.values(Astal.WindowAnchor)
      .find(w => position === w)) {
      this.#updateFile("barPosition", position)
      this.#barPosition = position;
      this.notify("bar-position")
    }
  }

  #updateFile(key: string, value: any) {
    writeFileAsync(PATH, JSON.stringify({
      ...JSON.parse(readFile(PATH)),
      [key]: value
    }))
  }


  constructor() {
    super();
    let config = {
      barPosition: Astal.WindowAnchor.LEFT,
      tempPath: null,
      systemMonitor: null
    }
    try {
      let file = readFile(PATH)
      config = JSON.parse(file)
    } catch (error) {
      writeFileAsync(PATH, JSON.stringify(config))
    }
    this.#barPosition = config.barPosition;
    this.#tempPath = config.tempPath;
    this.#systemMonitor = config.systemMonitor;
  }
}
