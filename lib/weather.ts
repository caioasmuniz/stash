import GObject, { property, register } from "ags/gobject"
import { Poll } from "ags/state"
import GLib from "gi://GLib?version=2.0"
import GWeather from "gi://GWeather?version=4.0"

@register({ GTypeName: "Weather" })
export default class Weather extends GObject.Object {
  static instance: Weather;
  static get_default() {
    if (!this.instance) this.instance =
      new Weather({ weatherInfo: undefined });
    return this.instance;
  }

  #weather: GWeather.Info
  #unit = {
    temp: GWeather.TemperatureUnit.CENTIGRADE,
    pressure: GWeather.PressureUnit.ATM,
    distance: GWeather.DistanceUnit.KM,
    speed: GWeather.SpeedUnit.KPH
  }

  @property(Number)
  get apparent() {
    return this.#weather
      .get_value_apparent(this.#unit.temp)[1]
  }

  @property(String)
  get attribution() {
    return this.#weather.get_attribution()
  }

  @property(String)
  get conditions() {
    return this.#weather.get_conditions()
  }

  @property(Number)
  get dew() {
    return this.#weather
      .get_value_dew(this.#unit.temp)[1]
  }

  @property(Object)
  get forecast() {
    return this.#weather.get_forecast_list()
      .map(w => {
        return new Weather({ weatherInfo: w })
      })
  }

  @property(String)
  get humidity() {
    return this.#weather.get_humidity()
  }

  @property(String)
  get iconName() {
    return this.#weather.get_icon_name()
  }

  @property(Boolean)
  get isDaytime() {
    return this.#weather.is_daytime()
  }

  @property(Object)
  get lastUpdated() {
    return this.toDate(
      this.#weather.get_value_update()[1])
  }

  @property(GWeather.Location)
  get location() {
    return this.#weather.get_location()
  }

  @property(Number)
  get moonPhase() {
    return this.#weather.get_value_moonphase()[1]
  }

  @property(Number)
  get moonLat() {
    return this.#weather.get_value_moonphase()[2]
  }

  @property(Number)
  get pressure() {
    return this.#weather
      .get_value_pressure(this.#unit.pressure)[1]
  }

  @property(Object)
  get sunrise() {
    return this.toDate(
      this.#weather.get_value_sunrise()[1])
  }

  @property(Object)
  get sunset() {
    return this.toDate(
      this.#weather.get_value_sunset()[1])

  }

  @property(Number)
  get temp() {
    return this.#weather
      .get_value_temp(this.#unit.temp)
  }

  @property(String)
  get tempSummary() {
    return this.#weather.get_temp_summary()
  }

  @property(Number)
  get visibility() {
    return this.#weather
      .get_value_visibility(this.#unit.distance)
  }

  @property(Number)
  get windDirection() {
    return this.#weather.get_value_wind(this.#unit.speed)[1]
  }

  @property(Number)
  get windSpeed() {
    return this.#weather.get_value_wind(this.#unit.speed)[2]
  }

  @property(Number)
  get windSummary() {
    return this.#weather.get_wind()
  }

  private toDate(time: number) {
    return GLib.DateTime.new_from_unix_local(time)
  }

  public update() {
    this.#weather.update()
  }

  constructor({ weatherInfo = undefined }:
    { weatherInfo: GWeather.Info | undefined }
  ) {   
    super()
    if (weatherInfo) {
      this.#weather = weatherInfo
    } else {
      this.#weather = GWeather.Info.new(
        GWeather.Location.get_world()
          ?.find_nearest_city(-23.1, -50.6))

      this.#weather.set_enabled_providers(GWeather.Provider.MET_NO)
      this.#weather.set_contact_info("caiomuniz888@gmail.com")
      this.update()
    }
    new Poll<void>(undefined,
      1 * 3600000,
      () => this.#weather.update()
    )
    this.#weather.connect("updated", weather => {
      this.notify("apparent")
      this.notify("attribution")
      this.notify("conditions")
      this.notify("dew")
      this.notify("forecast")
      this.notify("humidity")
      this.notify("icon-name")
      this.notify("is-daytime")
      this.notify("last-updated")
      this.notify("location")
      this.notify("moon-phase")
      this.notify("moon-lat")
      this.notify("pressure")
      this.notify("sunrise")
      this.notify("sunset")
      this.notify("temp")
      this.notify("temp-summary")
      this.notify("visibility")
      this.notify("wind-direction")
      this.notify("wind-speed")
      this.notify("wind-summary")
    })
  }
}