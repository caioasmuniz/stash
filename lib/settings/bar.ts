import { register, Object as Obj, signal, getter } from "ags/gobject";
import { Astal } from "ags/gtk4";

@register({ GTypeName: "BarSettings" })
export default class BarSettings extends Obj {
  #position: Astal.WindowAnchor
  #tempPath: string
  #systemMonitor: string

  @signal()
  updateFile() { }

  @getter(String)
  get tempPath() {
    return this.#tempPath;
  }

  set tempPath(path) {
    this.#tempPath = path
    this.notify("temp-path")
    this.emit("update-file")
  }

  @property(String)
  get systemMonitor() {
    return this.#systemMonitor
  }

  set systemMonitor(path) {
    this.#systemMonitor = path
    this.notify("system-monitor")
    this.emit("update-file")
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
    tempPath: string,
    systemMonitor: string
  }) {
    super();
    this.#position = position;
    this.#tempPath = tempPath;
    this.#systemMonitor = systemMonitor;
  }
}
