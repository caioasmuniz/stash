import { readFile, writeFileAsync } from "ags/file";
import GObject, { register, property } from "ags/gobject";
import { Gtk } from "ags/gtk4";
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

  #barOrientation: Gtk.Orientation

  @property(Number)
  get barOrientation() {
    return this.#barOrientation;
  }

  #updateFile(key: string, value: any) {
    writeFileAsync(PATH, JSON.stringify({
      ...JSON.parse(readFile(PATH)),
      [key]: value
    }))
  }

  set barOrientation(orientation) {
    this.#updateFile("barOrientation", orientation)
    this.#barOrientation = orientation;
    this.notify("bar-orientation")
  }

  constructor() {
    super();
    let config = {
      barOrientation: Gtk.Orientation.VERTICAL
    }
    try {
      let file = readFile(PATH)
      config = JSON.parse(file)
    } catch (error) {
      writeFileAsync(PATH, JSON.stringify(config))
    }
    this.#barOrientation = config.barOrientation
  }
}
