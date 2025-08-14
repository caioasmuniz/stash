import GTop from "gi://GTop";
import { useSettings } from "../../lib/settings";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import AstalIO from "gi://AstalIO?version=0.1";
import { Accessor, createState } from "gnim";

import { createPoll } from "ags/time";

export default ({ vertical }: { vertical: Accessor<boolean> }) => {
  const settings = useSettings()

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
    if (settings.bar.tempPath.get())
      return parseInt(
       AstalIO.Process.exec(`cat ${settings.bar.tempPath.get()}`)
      ) / 100000
    else
      return -1
  })

  const Indicator = ({ value, label, unit, vertical, visible = true }:
    {
      value: Accessor<number>,
      label: string,
      unit: string,
      vertical: Accessor<boolean>,
      visible?: Accessor<boolean> | boolean
    }) => <Gtk.LevelBar
      visible={visible}
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}
      inverted={vertical}
      value={value}
      widthRequest={vertical.as(v => v ? -1 : 50)}
      heightRequest={vertical.as(v => v ? 50 : -1)}>
      <Gtk.Box
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        spacing={2}
        orientation={vertical.as(v => v ?
          Gtk.Orientation.VERTICAL :
          Gtk.Orientation.HORIZONTAL)}>
        <Gtk.Label
          label={label}
          cssClasses={["title"]} />
        <Gtk.Label
          cssClasses={["body"]}
          label={value(v => (v * 100)
            .toFixed(0)
            .concat(unit))} />
      </Gtk.Box>
    </Gtk.LevelBar >

  return <Gtk.Button
    cursor={Gdk.Cursor.new_from_name("pointer", null)}
    onClicked={() =>
      settings.bar.systemMonitor ?
       AstalIO.Process.exec_async((
          settings.bar.systemMonitor as Accessor<any>)
          .get()
        ) : null}
    cssClasses={["pill", "sys-usage"]}>
    <Gtk.Box
      hexpand={vertical}
      vexpand={!vertical}
      orientation={vertical.as(v => v ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL)}
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
    </Gtk.Box>
  </Gtk.Button >
}