import { readFile, readFileAsync, writeFile, writeFileAsync } from "ags/file";
import GObject, { register, property } from "ags/gobject";
import { Gtk } from "ags/gtk4";
import { bind, State } from "ags/state";

const PATH = "/run/user/1000/stash.json"

@register({ GTypeName: "Settings" })
export default class Settings extends GObject.Object {
  static instance: Settings;
  static get_default() {
    if (!this.instance) this.instance = new Settings();
    return this.instance;
  }

  #config: State<{
    barOrientation?: Gtk.Orientation
  }>
  #barOrientation = Gtk.Orientation.VERTICAL

  @property(Number)
  get barOrientation() {
    return this.#barOrientation;
  }

  set barOrientation(orientation) {
    this.#config.set({
      ...this.#config.get(),
      barOrientation: orientation
    })
    this.#barOrientation = orientation;
    this.notify("bar-orientation")
  }

  constructor() {
    super();
    this.#config = new State({})
    this.#config.set(JSON.parse(readFile(PATH)))
    this.barOrientation = this.#config.get().barOrientation!

    this.#config.subscribe(async c => {
      console.log(c)
      await writeFileAsync(PATH, JSON.stringify(c))
    })
  }
}
