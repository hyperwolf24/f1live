- 
- API Reference
- Session

Session#

The Session is a core part of FastF1 and serves as a starting point for
accessing various data. A Session object represents a specific race,
qualifying, sprint or other Formula 1 session and all data related to
such a session can be accessed through it.

class fastf1.core.Session(event, session_name, f1_api_support=False)[source]#

    Object for accessing session specific data.

    The session class will usually be your starting point. This object
    will have various information about the session.

    Note

    Most of the data is only available after calling Session.load()

    Attributes:

      ----------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------
      event                   Reference to the associated event object.
      name                    Name of this session, for example 'Qualifying', 'Race', 'FP1', ...
      f1_api_support          The official F1 API supports this event and lap timing data and telemetry data are available.
      date                    Date at which this session took place.
      api_path                API base path for this session
      session_info            Session information including meeting, session, country and circuit names and id keys.
      drivers                 List of all drivers that took part in this session; contains driver numbers as string.
      results                 Session result with driver information.
      laps                    All laps from all drivers driven in this session.
      total_laps              Originally scheduled number of laps for race-like sessions such as Race and Sprint.
      weather_data            Dataframe containing weather data for this session as received from the api.
      car_data                Dictionary of car telemetry (Speed, RPM, etc.) as received from the api by car number (where car number is a string and the telemetry is an instance of Telemetry)
      pos_data                Dictionary of car position data as received from the api by car number (where car number is a string and the telemetry is an instance of Telemetry)
      session_status          Session status data as returned by fastf1.api.session_status_data()
      track_status            Track status data as returned by fastf1.api.track_status_data()
      race_control_messages   Race Control messages as returned by fastf1.api.race_control_messages()
      session_start_time      Session time at which the session was started according to the session status data.
      t0_date                 Date timestamp which marks the beginning of the data stream (the moment at which the session time is zero).
      ----------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Methods:

      ------------------------------------------ ---------------------------------------------------------------------------
      load(*[, laps, telemetry, weather, ...])   Load session data from the supported APIs.
      get_driver(identifier)                     Get a driver object which contains additional information about a driver.
      get_circuit_info()                         Returns additional information about the circuit that hosts this event.
      ------------------------------------------ ---------------------------------------------------------------------------

    event#

        Reference to the associated event object.

        Type:

            Event

    name#

        Name of this session, for example ‘Qualifying’, ‘Race’, ‘FP1’, …

        Type:

            str

    f1_api_support#

        The official F1 API supports this event and lap timing data and
        telemetry data are available.

        Type:

            bool

    date#

        Date at which this session took place.

        Type:

            pandas.Datetime

    api_path#

        API base path for this session

        Type:

            str

    property session_info: dict#

        Session information including meeting, session, country and
        circuit names and id keys.

        The id keys are unique identifiers that are used by the F1 APIs.

        (This property holds the data that is returned by the
        “SessionInfo” endpoint of the F1 livetiming API.)

    property drivers#

        List of all drivers that took part in this session; contains
        driver numbers as string.

        Data is available after calling Session.load

        Type:

            list

    property results: SessionResults#

        Session result with driver information.

        Data is available after calling Session.load

        Type:

            SessionResults

    property laps: Laps#

        All laps from all drivers driven in this session.

        Data is available after calling Session.load with laps=True

        Type:

            Laps

    property total_laps: int#

        Originally scheduled number of laps for race-like sessions such
        as Race and Sprint. It takes None as a default value for other
        types of sessions or if data is unavailable

        Data is available after calling Session.load with laps=True

        Type:

            int

    property weather_data#

        Dataframe containing weather data for this session as received
        from the api. See fastf1.api.weather_data() for available data
        channels. Each data channel is one row of the dataframe.

        Data is available after calling Session.load with weather=True

    property car_data: Telemetry#

        Dictionary of car telemetry (Speed, RPM, etc.) as received from
        the api by car number (where car number is a string and the
        telemetry is an instance of Telemetry)

        Data is available after calling Session.load with telemetry=True

    property pos_data: Telemetry#

        Dictionary of car position data as received from the api by car
        number (where car number is a string and the telemetry is an
        instance of Telemetry)

        Data is available after calling Session.load with telemetry=True

    property session_status#

        Session status data as returned by
        fastf1.api.session_status_data()

        Data is available after calling Session.load with laps=True

        Type:

            pandas.Dataframe

    property track_status#

        Track status data as returned by fastf1.api.track_status_data()

        Data is available after calling Session.load with laps=True

        Type:

            pandas.Dataframe

    property race_control_messages#

        Race Control messages as returned by
        fastf1.api.race_control_messages()

        Data is available after calling Session.load with messages=True

        Type:

            pandas.Dataframe

    property session_start_time: Timedelta#

        Session time at which the session was started according to the
        session status data. This is not the time at which the session
        is scheduled to be started!

        Data is available after calling Session.load with laps=True

        Type:

            pandas.Timedelta

    property t0_date#

        Date timestamp which marks the beginning of the data stream (the
        moment at which the session time is zero).

        Data is available after calling Session.load with telemetry=True

        Type:

            pandas.Datetime

    load(*, laps=True, telemetry=True, weather=True, messages=True, livedata=None)[source]#

        Load session data from the supported APIs.

        This method allows to flexibly load some or all data that FastF1
        can give you access to. Without specifying any further options,
        all data is loaded by default.

        Usually, it is recommended to load all available data because
        internally FastF1 partially mixes data from multiple endpoints
        and data sources to correct for errors or to add more
        information. These features are optional and may not work when
        some data is unavailable. In these cases, FastF1 will return the
        data to the best of its abilities.

        Note

        Lap data: drivers crashing and retiring

        During a session: An additional last lap is added for a driver
        if the last timed lap of a driver is not an inlap and the
        session is aborted next. The Time for when this lap was “set”
        will be set to the time at which the session was aborted.

        First lap in a race: A single lap with minimal information will
        be added in race sessions if a driver does not complete at least
        one timed lap. The LapStartTime for this lap will be set to the
        start time of the session as with all other laps in a race. The
        Time at which this lap was “set” will be set to the time at
        which the first driver completes their first lap.

        Note

        Absolute time is not super accurate. The moment a lap is logged
        is not always the same and there will be some jitter. At the
        moment lap time reference is synchronised on the sector time
        triggered with lowest latency. Expect an error of around ±10m
        when overlapping telemetry data of different laps.

        Parameters:

            - laps (bool) – Load laps and session status data.

            - telemetry (bool) – Load telemetry data.

            - weather (bool) – Load weather data.

            - messages (bool) – Load race control messages for the
              session

            - livedata (LiveTimingData) – instead of requesting the data
              from the api, locally saved livetiming data can be used as
              a data source

    get_driver(identifier)[source]#

        Get a driver object which contains additional information about
        a driver.

        Parameters:

            identifier (str) – driver’s three letter identifier (for
            example ‘VER’) or driver number as string

        Return type:

            DriverResult

        Returns:

            instance of DriverResult

    get_circuit_info()[source]#

        Returns additional information about the circuit that hosts this
        event.

        This information includes the location of corners, marshal
        lights, marshal sectors and the rotation of the track map. Note
        that the data is manually created and therefore not highly
        accurate, but it is useful for annotating data visualizations.

        See CircuitInfo for detailed information.

        Return type:

            CircuitInfo | None

previous

Event

next

Timing Data

Choose version

On this page

- Session
  - Session.event
  - Session.name
  - Session.f1_api_support
  - Session.date
  - Session.api_path
  - Session.session_info
  - Session.drivers
  - Session.results
  - Session.laps
  - Session.total_laps
  - Session.weather_data
  - Session.car_data
  - Session.pos_data
  - Session.session_status
  - Session.track_status
  - Session.race_control_messages
  - Session.session_start_time
  - Session.t0_date
  - Session.load()
  - Session.get_driver()
  - Session.get_circuit_info()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
