- 
- API Reference
- Deprecated Legacy API
- F1 API - fastf1.api

F1 API - fastf1.api#

Functions#

Warning

fastf1.api will be considered private in future releases and potentially
be removed or changed. Please do not use functionality from fastf1.api.
If you currently require functionality from there, please open an issue
on Github with details about what you require and why.

A collection of functions to interface with the F1 web api.

  ----------------------- --
  timing_data             
  timing_app_data         
  car_data                
  position_data           
  track_status_data       
  session_status_data     
  race_control_messages   
  lap_count               
  driver_info             
  weather_data            
  fetch_page              
  parse                   
  ----------------------- --

fastf1.api.make_path(wname, wdate, sname, sdate)[source]#

    Create the api path base string to append on livetiming.formula1.com
    for api requests.

    The api path base string changes for every session only.

    Parameters:

        - wname – Weekend name (e.g. ‘Italian Grand Prix’)

        - wdate – Weekend date (e.g. ‘2019-09-08’)

        - sname – Session name ‘Qualifying’ or ‘Race’

        - sdate – Session date (formatted as wdate)

    Returns:

        relative url path

fastf1.api.timing_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse timing data.

    Timing data is a mixed stream of information. At a given time a
    packet of data may indicate position, lap time, speed trap, sector
    times and so on.

    While most of this data can be mapped lap by lap giving a readable
    and usable data structure (-> laps_data), other entries like
    position and time gaps are provided on a more frequent time base.
    Those values are separated and returned as a separate object (->
    stream_data).

    Note

    This function does not actually return “raw” API data. This is
    because of the need to process a mixed linear data stream into a
    usable object and because of frequent errors and inaccuracies in
    said stream. Occasionally an “educated guess” needs to be made for
    judging whether a value belongs to this lap or to another lap.
    Additionally, some values which are considered “obviously” wrong are
    removed from the data. This can happen with or without warnings,
    depending on the reason and severity.

    - Timestamps (‘SessionTime’) marking start or end of a lap are
      post-processed as the provided values are inaccurate.

    - Lap and sector times are not modified ever! They are considered as
      the absolute truth. If necessary, other values are adjusted to
      fit.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response (str | None) – api response can be passed if data was
          already downloaded

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Return type:

        (DataFrame, DataFrame)

    Returns:

        laps_data and stream_data

        - 

          laps_data (DataFrame):

              contains the following columns of data (one row per driver
              and lap)

                - Time (pandas.Timedelta): Session time at which the lap
                  was set (i.e. finished)

                - LapTime (pandas.Timedelta): Lap time of the last
                  finished lap (the lap in this row)

                - Driver (str): Driver number

                - NumberOfLaps (int): Number of laps driven by this
                  driver including the lap in this row

                - NumberOfPitStops (int): Number of pit stops of this
                  driver

                - PitInTime (pandas.Timedelta): Session time at which
                  the driver entered the pits. Consequently, if this
                  value is not NaT the lap in this row is an inlap.

                - PitOutTime (pandas.Timedelta): Session time at which
                  the driver exited the pits. Consequently, if this
                  value is not NaT, the lap in this row is an outlap.

                - Sector1/2/3Time (pandas.Timedelta): Sector times (one
                  column for each sector time)

                - Sector1/2/3SessionTime (pandas.Timedelta): Session
                  time at which the corresponding sector time was set
                  (one column for each sector’s session time)

                - SpeedI1/I2/FL/ST: Speed trap speeds; FL is speed at
                  the finish line; I1 and I2 are speed traps in sector 1
                  and 2 respectively; ST maybe a speed trap on the
                  longest straight (?)

        - 

          stream_data (DataFrame):

              contains the following columns of data

                - Time (pandas.Timedelta): Session time at which this
                  sample was created

                - Driver (str): Driver number

                - Position (int): Position in the field

                - GapToLeader (pandas.Timedelta): Time gap to leader in
                  seconds

                - IntervalToPositionAhead (pandas.Timedelta): Time gap
                  to car ahead

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.timing_app_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse ‘timing app data’.

    Timing app data provides the following data channels per sample:

        - LapNumber (float or nan): Current lap number

        - Driver (str): Driver number

        - LapTime (pandas.Timedelta or None): Lap time of last lap

        - Stint (int): Counter for the number of driven stints

        - TotalLaps (float or nan): Total number of laps driven on this
          set of tires (includes laps driven in other sessions!)

        - Compound (str or None): Tire compound

        - New (bool or None): Whether the tire was new when fitted

        - TyresNotChanged (int or None): ??? Probably a flag to mark pit
          stops without tire changes

        - Time (pandas.Timedelta): Session time

        - LapFlags (float or nan): ??? unknown

        - LapCountTime (None or ???): ??? unknown; no data

        - StartLaps (float or nan): ??? Tire age when fitted (same as
          ‘TotalLaps’ in the same sample?!?)

        - Outlap (None or ???): ??? unknown; no data

    Only a few values are present per timestamp. Somewhat comprehensive
    information can therefore only be obtained by aggregating data
    (usually over the course of one lap). Some values are sent even less
    frequently (for example ‘Compound’ only after tire changes).

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A DataFrame containing one column for each data channel listed
        above.

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.car_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse car data.

    Car data provides the following data channels per sample:

        - Time (pandas.Timedelta): session timestamp (time only);
          inaccurate, has duplicate values; use Date instead

        - Date (pandas.Timestamp): timestamp for this sample as Date +
          Time; more or less exact

        - Speed (int): Km/h

        - RPM (int)

        - Gear (int): [called ‘nGear’ in the data!]

        - Throttle (int): 0-100%

        - Brake (bool)

        - DRS (int): 0-14 (Odd DRS is Disabled, Even DRS is Enabled?)
          (More Research Needed?)

          - 0 = Off

          - 1 = Off

          - 2 = (?)

          - 3 = (?)

          - 8 = Detected, Eligible once in Activation Zone (Noted
            Sometimes)

          - 10 = On (Unknown Distinction)

          - 12 = On (Unknown Distinction)

          - 14 = On (Unknown Distinction)

        - Source (str): Indicates the source of a sample; ‘car’ for all
          values here

    The data stream has a sample rate of (usually) 240ms. The samples
    from the data streams for position data and car data do not line up.
    Resampling/interpolation is required to merge them.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one pandas DataFrame per driver.
        Dictionary keys are the driver’s numbers as string (e.g. ‘16’).
        You should never assume that a number exists!

        Each dataframe contains one column for each data channel as
        listed above

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.position_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse position data.

    Position data provides the following data channels per sample:

        - Time (pandas.Timedelta): session timestamp (time only);
          inaccurate, has duplicate values; use Date instead

        - Date (pandas.Timestamp): timestamp for this sample as Date +
          Time; more or less exact

        - Status (str): ‘OnTrack’ or ‘OffTrack’

        - X, Y, Z (int): Position coordinates; starting from 2020 the
          coordinates are given in 1/10 meter

        - Source (str): Indicates the source of a sample; ‘pos’ for all
          values here

    The data stream has a sample rate of (usually) 220ms. The samples
    from the data streams for position data and car data do not line up.
    Resampling/interpolation is required to merge them.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one pandas DataFrame per driver.
        Dictionary keys are the driver’s numbers as string (e.g. ‘16’).
        You should never assume that a number exists!

        Each dataframe contains one column for each data channel as
        listed above

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.track_status_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse track status data.

    Track status contains information on yellow/red/green flags, safety
    car and virtual safety car. It provides the following data channels
    per sample:

      - Time (datetime.timedelta): session timestamp (time only)

      - Status (str): contains track status changes as numeric values
        (described below)

      - Message (str): contains the same information as status but in
        easily understandable words (‘Yellow’, ‘AllClear’,…)

    A new value is sent every time the track status changes.

    Track status is indicated using single digit integer status codes
    (as string). List of known statuses:

      - 

        ‘1’: Track clear (beginning of session or to indicate the end

            of another status)

      - ‘2’: Yellow flag (sectors are unknown)

      - ‘3’: ??? Never seen so far, does not exist?

      - ‘4’: Safety Car

      - ‘5’: Red Flag

      - ‘6’: Virtual Safety Car deployed

      - ‘7’: Virtual Safety Car ending (As indicated on the drivers
        steering wheel, on tv and so on; status ‘1’ will mark the actual
        end)

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one key for each data channel and a list
        of values per key.

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.session_status_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse session status data.

    Session status contains information on when a session was started
    and when it ended (amongst others). It provides the following data
    channels per sample:

      - Time (datetime.timedelta): session timestamp (time only)

      - Status (str): status messages

    A new value is sent every time the session status changes.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one key for each data channel and a list
        of values per key.

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.race_control_messages(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse race control messages.

    Race control messages are sent by race control to all teams to
    notify of decisions and statuses of the session.

    Every message has the following attributes:

      - Utc: Message timestamp

      - Category (str): Type of message, “Other”, “Flag”, “Drs”,
        “CarEvent”

      - Message (str): Content of message

    Other possible attributes are:

      - Status (str): Status of context, e.g. “DISABLED” for disabling
        DRS

      - Flag (str): Type of flag being waved “GREEN”, “RED”, “YELLOW”,
        “CLEAR”, “CHEQUERED”

      - Scope (str): Scope of message “Track”, “Sector”, “Driver”

      - Sector (int): Affected track sector for sector-scoped messages

      - RacingNumber (str): Affected driver for CarEvent messages

      - Lap (int): Number of the lap in which the message was displayed

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one key for each data channel and a list
        of values per key.

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.lap_count(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse lap count data.

    It provides the following data channels per sample:

        - Time: session timestamp (time only)

        - TotalLaps (int): Intended number of total laps

        - CurrentLap (int): Current race lap

    A value can have both ‘TotalLaps’ and ‘CurrentLap’ or only one of
    them.

    A new value is sent every time a lap is completed or the intended
    number of laps changes.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one key for each data channel and a list
        of values per key.

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.driver_info(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch driver information.

    Driver information contains the following information about each
    driver:

      [‘RacingNumber’, ‘BroadcastName’, ‘FullName’, ‘Tla’, ‘Line’,
      ‘TeamName’, ‘TeamColour’, ‘FirstName’, ‘LastName’, ‘Reference’,
      ‘HeadshotUrl’, ‘CountryCode’]

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one entry for each driver with the
        drivers racing number as key

    Raises:

        SessionNotAvailableError – in case the F1 livetiming api returns
        no data

fastf1.api.weather_data(path, response=None, livedata=None)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch and parse weather data.

    Weather data provides the following data channels per sample:

      - Time (datetime.timedelta): session timestamp (time only)

      - AirTemp (float): Air temperature [°C]

      - Humidity (float): Relative humidity [%]

      - Pressure (float): Air pressure [mbar]

      - Rainfall (bool): Shows if there is rainfall

      - TrackTemp (float): Track temperature [°C]

      - WindDirection (int): Wind direction [°] (0°-359°)

      - WindSpeed (float): Wind speed [m/s]

    Weather data is updated once per minute.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - response – Response as returned by fetch_page() can be passed
          if it was downloaded already.

        - livedata – An instance of
          fastf1.livetiming.data.LiveTimingData to use as a source
          instead of the api

    Returns:

        A dictionary containing one key for each data channel and a list
        of values per key.

    Raises:

        SessionNotAvailableError – in case the F1 live timing api
        returns no data

fastf1.api.fetch_page(path, name)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Fetch data from the formula1 livetiming web api, given url base path
    and page name. An attempt to parse json or decode known messages is
    made.

    Parameters:

        - path (str) – api path base string (usually Session.api_path)

        - name (str) – page name (see api.pages for all known pages)

    Returns:

        - dictionary if content was json

        - list of entries if jsonStream, where each entry again contains
          two elements: [timestamp, content]. Content is parsed with
          parse() and will usually be a dictionary created from json
          data.

        - None if request failed

fastf1.api.parse(text, zipped=False)[source]#

    Warning

    fastf1.api will be considered private in future releases and
    potentially be removed or changed.

    Parse json and jsonStream as returned by livetiming.formula1.com

    This function can only pass one data entry at a time, not a whole
    response. Timestamps and data need to be separated before and only
    the data must be passed as a string to be parsed.

    Parameters:

        - text (str) – The string which should be parsed

        - zipped (bool) – Whether the text is compressed. This is the
          case for ‘.z’ data (e.g. position data)

    Return type:

        str | dict

    Returns:

        

        Depending on data of which page is parsed

            - a dictionary created as a result of loading json data

            - a string

previous

Deprecated Legacy API

next

Legacy Functionality - fastf1.legacy

Choose version

On this page

- Functions
  - make_path()
  - timing_data()
  - timing_app_data()
  - car_data()
  - position_data()
  - track_status_data()
  - session_status_data()
  - race_control_messages()
  - lap_count()
  - driver_info()
  - weather_data()
  - fetch_page()
  - parse()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
