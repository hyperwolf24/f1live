- 
- API Reference
- Timing Data
- Lap

Lap#

class fastf1.core.Lap(*args, **kwargs)[source]#

    Bases: BaseSeries

    Object for accessing lap (timing) data of a single lap.

    This class wraps pandas.Series. It provides extra functionality for
    accessing a lap’s associated telemetry data.

    Parameters:

        - *args – passed through to pandas.Series super class

        - **kwargs – passed through to pandas.Series super class

    Attributes:

      ----------- -----------------------------
      telemetry   Telemetry data for this lap
      ----------- -----------------------------

    Methods:

      ------------------------------- -----------------------------------
      get_telemetry(*[, frequency])   Telemetry data for this lap
      get_car_data(**kwargs)          Car data for this lap
      get_pos_data(**kwargs)          Pos data for all laps in self
      get_weather_data()              Return weather data for this lap.
      ------------------------------- -----------------------------------

    property telemetry: Telemetry#

        Telemetry data for this lap

        This is a cached (!) property for get_telemetry(). It will
        return the same value as get_telemetry but cache the result so
        that the involved processing is only done once.

        This is mainly provided for convenience and backwards
        compatibility.

        See get_telemetry() for more information.

        Returns:

            instance of Telemetry

    get_telemetry(*, frequency=None)[source]#

        Telemetry data for this lap

        Telemetry data is the result of merging the returned data from
        get_car_data() and get_pos_data(). This means that telemetry
        data at least partially contains interpolated values! Telemetry
        data additionally already has computed channels added (e.g.
        Distance).

        This method is provided for convenience and compatibility
        reasons. But using it does usually not produce the most accurate
        possible result. It is recommended to use get_car_data() or
        get_pos_data() when possible. This is also faster if merging of
        car and position data is not necessary and if not all computed
        channels are needed.

        Resampling during merging is done according to the frequency set
        by TELEMETRY_FREQUENCY if not overwritten with the frequency
        argument.

        Parameters:

            frequency (Union[int, Literal['original'], None]) – Optional
            frequency to overwrite default value set by
            TELEMETRY_FREQUENCY. (Either string ‘original’ or integer
            for a frequency in Hz)

        Return type:

            Telemetry

        Returns:

            instance of Telemetry

    get_car_data(**kwargs)[source]#

        Car data for this lap

        Slices the car data in Session.car_data using this lap and
        returns the result.

        The data returned by this method does not contain computed
        telemetry channels. The can be added by calling the appropriate
        add_*() method on the returned telemetry object.

        Parameters:

            **kwargs – Keyword arguments are passed to
            Telemetry.slice_by_lap()

        Return type:

            Telemetry

        Returns:

            instance of Telemetry

    get_pos_data(**kwargs)[source]#

        Pos data for all laps in self

        Slices the position data in Session.pos_data using this lap and
        returns the result.

        Parameters:

            **kwargs – Keyword arguments are passed to
            Telemetry.slice_by_lap()

        Return type:

            Telemetry

        Returns:

            instance of Telemetry

    get_weather_data()[source]#

        Return weather data for this lap.

        Weather data is updated once per minute. This means that there
        are usually one or two data points per lap. This function will
        always return only one data point:

          - The first value within the duration of a lap

        or

          - the last known value before the end of the lap if there are
            no values within the duration of a lap

        See fastf1.api.weather_data() for available data channels.

        If you wish to have more control over the data, you can access
        the weather data directly in Session.weather_data.

        Return type:

            Series

        Returns:

            pandas.Series

            >>> session = fastf1.get_session(2019, 'Monza', 'Q')
            >>> session.load(telemetry=False)
            >>> lap = session.laps.pick_fastest()
            >>> lap['LapStartTime']
            Timedelta('0 days 01:09:55.561000')
            >>> lap.get_weather_data()
            Time             0 days 01:10:15.292000
            AirTemp                            23.0
            Humidity                           51.9
            Pressure                          992.4
            Rainfall                          False
            TrackTemp                          37.8
            WindDirection                       166
            WindSpeed                           0.8
            Name: 70, dtype: object

previous

Laps

next

Car Telemetry

Choose version

On this page

- Lap
  - Lap.telemetry
  - Lap.get_telemetry()
  - Lap.get_car_data()
  - Lap.get_pos_data()
  - Lap.get_weather_data()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
