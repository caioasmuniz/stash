import Astal from "gi://Astal?version=4.0";
import GObject from "gi://GObject";
import { getter, register, setter, signal } from "gnim/gobject";

@register({ GTypeName: "BarSettings" })
export default class BarSettings extends GObject.Object {
  declare static $gtype: GObject.GType<BarSettings>
  #position: Astal.WindowAnchor
  #tempPath: string
  #systemMonitor: string

  @signal()
  updateFile() { }

  @getter(String)
  get tempPath() {
    return this.#tempPath;
  }
  @setter(String)
  set tempPath(path) {
    this.#tempPath = path
    this.notify("temp-path")
    this.emit("update-file")
  }

  @getter(String)
  get systemMonitor() {
    return this.#systemMonitor
  }

  @setter(String)
  set systemMonitor(path) {
    this.#systemMonitor = path
    this.notify("system-monitor")
    this.emit("update-file")
  }

  @getter(Astal.WindowAnchor)
  get position() {
    return this.#position;
  }

  @setter(Astal.WindowAnchor)
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
