import { exec, execAsync } from "ags/process";
import { Accessor, createState } from "ags";
import { createPoll } from "ags/time";
import { Gdk, Gtk } from "ags/gtk4";
import GTop from "gi://GTop";
import Settings from "../../lib/settings";

export default ({ vertical }: { vertical: boolean }) => {
  const settings = Settings.get_default()

  const [lastCpuTop, setLastCpuTop] = createState(new GTop.glibtop_cpu())
  const INTERVAL = 1000;

  const cpu = createPoll(0, INTERVAL, () => {
    const cpuTop = new GTop.glibtop_cpu()
    GTop.glibtop_get_cpu(cpuTop);
    const total = cpuTop.total - lastCpuTop.get().total;
    const user = cpuTop.user - lastCpuTop.get().user;
    const sys = cpuTop.sys - lastCpuTop.get().sys;
    const nice = cpuTop.nice - lastCpuTop.get().nice;
    setLastCpuTop(cpuTop)
    return (user + sys + nice) / total;
  })

  const memory = createPoll(0, INTERVAL, () => {
    const memTop = new GTop.glibtop_mem()
    GTop.glibtop_get_mem(memTop);
    return memTop.user / memTop.total;
  })

  const disk = createPoll(0, INTERVAL, () => {
    const diskTop = new GTop.glibtop_fsusage()
    GTop.glibtop_get_fsusage(diskTop, "/");
    return diskTop.bavail / diskTop.bfree;
  })

  const temp = createPoll(0, INTERVAL, () => {
    if (settings.bar.tempPath)
      return parseInt(
        exec(`cat ${settings.bar.tempPath}`)
      ) / 100000
    else
      return -1
  })

  const Indicator = ({ value, label, unit, vertical, visible = true }:
    {
      value: Accessor<number>,
      label: string,
      unit: string,
      vertical: boolean,
      visible?: Accessor<boolean> | boolean
    }) => <Gtk.LevelBar
      visible={visible}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}
      inverted={vertical}
      value={value}
      widthRequest={vertical ? -1 : 50}
      heightRequest={vertical ? 50 : -1}>
      <box
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        spacing={2}
        orientation={vertical ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL}>
        <label
          label={label}
          cssClasses={["title"]} />
        <label
          cssClasses={["body"]}
          label={value(v => (v * 100)
            .toFixed(0)
            .concat(unit))} />
      </box>
    </Gtk.LevelBar >

  return <button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    onClicked={() =>
      settings.bar.systemMonitor ?
        execAsync([settings.bar.systemMonitor]) : null}
    cssClasses={["pill", "sys-usage"]}>
    <box
      hexpand={vertical}
      vexpand={!vertical}
      orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}
      spacing={4}>
      <Indicator
        vertical={vertical}
        value={cpu}
        label="CPU"
        unit="%" />
      <Indicator
        vertical={vertical}
        value={memory}
        label="RAM"
        unit="%" />
      <Indicator
        visible={temp.as(t => t >= 0)}
        vertical={vertical}
        value={temp}
        label="TEMP"
        unit="°C" />
      <Indicator
        vertical={vertical}
        visible={false}
        value={disk}
        label="DISK"
        unit="%" />
    </box>
  </button >
}