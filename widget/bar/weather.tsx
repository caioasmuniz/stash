import { Gdk, Gtk } from "ags/gtk4"
import { bind, observe, Poll, State } from "ags/state"
import Adw from "gi://Adw?version=1"
import GLib from "gi://GLib?version=2.0"
import GWeather from "gi://GWeather?version=4.0"

const UPDATE_HOURS = 1
const CELSIUS = GWeather.TemperatureUnit.CENTIGRADE

type WeatherInfo = {
  apparent: number,
  attribution: string,
  conditions: string,
  dew: number,
  forecast: WeatherInfo[] | null,
  humidity: string,
  iconName: string,
  lastUpdated: GLib.DateTime,
  location: GWeather.Location,
  moon: {
    phase: number,
    lat: number
  },
  pressure: number,
  sunrise: GLib.DateTime,
  sunset: GLib.DateTime,
  temp: number,
  tempMax: number,
  tempMin: number,
  tempSummary: string,
  visibility: number,
  wind: {
    direction: number,
    speed: GWeather.WindDirection,
    summary: string
  }
}

const updateWeather = () => {
  weatherInfo.set({} as WeatherInfo)
  weather.update()
}

const toDate = (time: number) => {
  return GLib.DateTime.new_from_unix_local(time)
}

const toWeatherInfo = (weather: GWeather.Info) => {
  const info = {
    forecast: weather.get_forecast_list().map(w => toWeatherInfo(w)),
    apparent: weather.get_value_apparent(CELSIUS)[1],
    attribution: weather.get_attribution(),
    conditions: weather.get_value_conditions()[1] === 0 ?
      weather.get_sky() : weather.get_conditions(),
    dew: weather.get_value_dew(CELSIUS)[1],
    humidity: weather.get_humidity(),
    iconName: weather.get_icon_name(),
    lastUpdated: toDate(weather.get_value_update()[1]),
    location: weather.get_location(),
    moon: {
      phase: weather.get_value_moonphase()[1],
      lat: weather.get_value_moonphase()[2]
    },
    pressure: weather.get_value_pressure(GWeather.PressureUnit.ATM)[1],
    sunrise: toDate(weather.get_value_sunrise()[1]),
    sunset: toDate(weather.get_value_sunset()[1]),
    temp: weather.get_value_temp(CELSIUS)[1],
    tempMax: weather.get_value_temp_max(CELSIUS)[1],
    tempMin: weather.get_value_temp_min(CELSIUS)[1],
    tempSummary: weather.get_temp_summary(),
    visibility: weather.get_value_visibility(GWeather.DistanceUnit.KM)[1],
    wind: {
      direction: weather.get_value_wind(GWeather.SpeedUnit.KPH)[1],
      speed: weather.get_value_wind(GWeather.SpeedUnit.KPH)[2],
      summary: weather.get_wind(),
    }
  } as WeatherInfo;
  return info;
}

const weather = GWeather.Info.new(
  GWeather.Location.get_world()
    ?.find_nearest_city(-23.1, -50.6))

weather.set_enabled_providers(GWeather.Provider.MET_NO)
weather.set_contact_info("caiomuniz888@gmail.com")

const weatherInfo = observe(
  {} as WeatherInfo,
  [weather, "updated", () => {
    const info = toWeatherInfo(weather)
    return info
  }])

export default ({ vertical }: { vertical: boolean }) =>
  <Gtk.MenuButton
    direction={vertical ?
      Gtk.ArrowType.RIGHT :
      Gtk.ArrowType.UP}
    cssClasses={["pill", "weather",
      vertical ? "vert" : ""]}
    cursor={Gdk.Cursor
      .new_from_name("pointer", null)}
    $={() => {
      weather.update()
      new Poll<void>(undefined,
        UPDATE_HOURS * 3600000,
        () => updateWeather()
      )
    }}
    popover={<Gtk.Popover
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      hasArrow={false}>
      <box
        orientation={Gtk.Orientation.VERTICAL}
        css={"padding:4px;"}>
        <label
          cssClasses={["title-1"]}
          label="Weather" />
        <box>
          <image
            pixelSize={84}
            iconName={bind(weatherInfo)
              .as(w => w.iconName || "")}
          />
          <box orientation={Gtk.Orientation.VERTICAL}>
            <label label={bind(weatherInfo)
              .as(w => w.conditions || "")} />
            <box>
              <image iconName={"go-top-symbolic"} />
              <label label={bind(weatherInfo)
                .as(w => w.tempMax?.toString() || "")} />
            </box>
            <box>
              <image iconName={"go-bottom-symbolic"} />
              <label label={bind(weatherInfo)
                .as(w => w.tempMin?.toString() || "")} />
            </box>

            <box>
              <image iconName={"daytime-sunrise-symbolic"} />
              <label label={bind(weatherInfo)
                .as(w => w.sunrise?.format("%H:%M") || "")} />
            </box>
            <box>
              <image iconName={"daytime-sunset-symbolic"} />
              <label label={bind(weatherInfo)
                .as(w => w.sunset?.format("%H:%M") || "")} />
            </box>

            <box>
              <image iconName={"weather-windy-symbolic"} />
              <label label={bind(weatherInfo)
                .as(w => w.wind?.summary || "")} />
            </box>

            <label useMarkup label={bind(weatherInfo)
              .as(w => w.attribution || "")} />

            <button iconName={"view-refresh-symbolic"}
              $clicked={() => updateWeather()} />
          </box>
        </box>
      </box>

    </Gtk.Popover> as Gtk.Popover}
  >
    <box>
      <box orientation={vertical ?
        Gtk.Orientation.VERTICAL :
        Gtk.Orientation.HORIZONTAL}
        visible={bind(weatherInfo).as(w => w !== undefined)}>
        <image
          pixelSize={22}
          iconName={bind(weatherInfo).as(w => w.iconName || "")}
        />
        <label
          cssClasses={["body"]}
          css={"font-size:0.75rem"}
          label={bind(weatherInfo)
            .as(w => w.tempSummary || "")}
        />
      </box>
      <Adw.Spinner visible={bind(weatherInfo).as(w => w === undefined)} />
    </box>
  </Gtk.MenuButton>