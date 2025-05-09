import { Gtk } from "ags/gtk4"
import { bind, observe, Poll, State } from "ags/state"
import GWeather from "gi://GWeather?version=4.0"

const UPDATE_HOURS = 1

const weather = GWeather.Info.new(
  GWeather.Location.get_world()
    ?.find_nearest_city(-23.1, -50.6))

weather.set_enabled_providers(GWeather.Provider.ALL)
weather.set_contact_info("caiomuniz888@gmail.com")

const weatherInfo = observe(
  { temp: 0, iconName: "" },
  [weather, "updated", () => {
    return {
      temp: weather.get_value_temp(GWeather.TemperatureUnit.CENTIGRADE)[1],
      iconName: weather.get_icon_name()
    }
  }])

export default ({ vertical }: { vertical: boolean }) =>
  <button
    $={() => {
      weather.update()
      new Poll<void>(undefined,
        UPDATE_HOURS * 360000,
        () => weather.update()
      )
    }}
    $clicked={() => weather.update()}
    cssClasses={["pill", "weather",
      vertical ? "vert" : ""]}>
    <box orientation={vertical ?
      Gtk.Orientation.VERTICAL :
      Gtk.Orientation.HORIZONTAL}>
      <image
        pixelSize={22}
        iconName={bind(weatherInfo).as(w => w.iconName)}
      />
      <label
        cssClasses={["body"]}
        css={"font-size:0.75rem"}
        label={bind(weatherInfo).as(w =>
          `${w.temp.toFixed(0)} °C`)}
      />
    </box>
  </button>