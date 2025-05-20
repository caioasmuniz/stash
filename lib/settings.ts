import { readFile, writeFileAsync } from "ags/file";
import GObject, { register, property } from "ags/gobject";
import { Astal, Gtk } from "ags/gtk4";
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

  @property(Number)
  get barPosition() {
    return this.#barPosition;
  }

  #updateFile(key: string, value: any) {
    writeFileAsync(PATH, JSON.stringify({
      ...JSON.parse(readFile(PATH)),
      [key]: value
    }))
  }

  set barPosition(position) {
    if (Object.values(Astal.WindowAnchor)
      .find(w => position === w)) {
      this.#updateFile("barPosition", position)
      this.#barPosition = position;
      this.notify("bar-position")
    }
  }

  constructor() {
    super();
    let config = {
      barPosition: Astal.WindowAnchor.LEFT
    }
    try {
      let file = readFile(PATH)
      config = JSON.parse(file)
    } catch (error) {
      writeFileAsync(PATH, JSON.stringify(config))
    }
    this.#barPosition = config.barPosition
  }
}
