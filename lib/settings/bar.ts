import { register, property, Object as Obj, signal } from "ags/gobject";
import GObject from "gi://GObject";
import { Astal } from "ags/gtk4";

@register({ GTypeName: "BarSettings" })
export default class BarSettings extends Obj {
  #position: Astal.WindowAnchor
  #tempPath: string | null
  #systemMonitor: string | null

  @signal(String, GObject.TYPE_STRING)
  updateFile(a:string) { }

  @property(String)
  get tempPath() {
    return this.#tempPath;
  }

  @property(String)
  get systemMonitor() {
    return this.#systemMonitor
  }

  @property(Number)
  get position() {
    return this.#position;
  }

  set position(position) {
    if (Object.values(Astal.WindowAnchor)
      .find(w => position === w)) {
      this.#position = position
      this.notify("position")
      this.emit("update-file")
    }
  }

  public objectify() {
    return {
      position: this.position,
      tempPath: this.tempPath,
      systemMonitor: this.systemMonitor
    }
  }

  constructor({ position, tempPath, systemMonitor }: {
    position: Astal.WindowAnchor,
    tempPath: null,
    systemMonitor: null
  }) {
    super();
    this.#position = position;
    this.#tempPath = tempPath;
    this.#systemMonitor = systemMonitor;
  }
}
