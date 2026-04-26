- 
- API Reference
- Results Data
- SessionResults

SessionResults#

class fastf1.core.SessionResults(*args, _cast_default_cols=False, _force_default_cols=False, **kwargs)[source]#

    Bases: BaseDataFrame

    This class provides driver and result information for all drivers
    that participated in a session.

    This class subclasses a pandas.DataFrame and the usual methods
    provided by pandas can be used to work with the data.

    All dataframe columns will always exist even if they are not
    relevant for the current session!

    The following information is provided for each driver as a column of
    the dataframe:

      - DriverNumber | str | The number associated with this driver in
        this session (usually the drivers permanent number)

      - BroadcastName | str | First letter of the drivers first name
        plus the drivers full last name in all capital letters. (e.g. ‘P
        GASLY’)

      - FullName | str | The drivers full name (e.g. “Pierre Gasly”)

      - Abbreviation | str | The drivers three letter abbreviation (e.g.
        “GAS”)

      - DriverId | str | driverId that is used by the Ergast API

      - TeamName | str | The team name (short version without title
        sponsors)

      - TeamColor | str | The color commonly associated with this team
        (hex value)

      - TeamId | str | constructorId that is used by the Ergast API

      - FirstName | str | The drivers first name

      - LastName | str | The drivers last name

      - HeadshotUrl | str | The URL to the driver’s headshot

      - CountryCode | str | The driver’s country code (e.g. “FRA”)

      - Position | float | The drivers finishing position (values only
        given if session is ‘Race’, ‘Qualifying’, ‘Sprint Shootout’,
        ‘Sprint’, or ‘Sprint Qualifying’). This additionally accounts
        for post-race penalties and disqualifications if session is
        ‘Race’, ‘Qualifying’, Sprint Shootout’, or ‘Sprint’.

      - ClassifiedPosition | str | The official classification result
        for each driver. This is either an integer value if the driver
        is officially classified or one of “R” (retired), “D”
        (disqualified), “E” (excluded), “W” (withdrawn), “F” (failed to
        qualify) or “N” (not classified).

      - GridPosition | float | The drivers starting position (values
        only given if session is ‘Race’, ‘Sprint’, ‘Sprint Shootout’ or
        ‘Sprint Qualifying’)

      - Q1 | pd.Timedelta | The drivers best Q1 time (values only given
        if session is ‘Qualifying’ or ‘Sprint Shootout’)

      - Q2 | pd.Timedelta | The drivers best Q2 time (values only given
        if session is ‘Qualifying’ or ‘Sprint Shootout’)

      - Q3 | pd.Timedelta | The drivers best Q3 time (values only given
        if session is ‘Qualifying’ or ‘Sprint Shootout’)

      - Time | pd.Timedelta | The drivers total race time (values only
        given if session is ‘Race’, ‘Sprint’, ‘Sprint Shootout’ or
        ‘Sprint Qualifying’ and the driver was not more than one lap
        behind the leader)

      - Status | str | A status message to indicate if and how the
        driver finished the race or to indicate the cause of a DNF.
        Possible values include but are not limited to ‘Finished’, ‘+ 1
        Lap’, ‘Crash’, ‘Gearbox’, … (values only given if session is
        ‘Race’, ‘Sprint’, ‘Sprint Shootout’ or ‘Sprint Qualifying’)

      - Points | float | The number of points received by each driver
        for their finishing result.

      - Laps | float | The number of laps driven by each driver (values
        only given if session is ‘Race’ or ‘Sprint’)

    By default, the session results are indexed by driver number and
    sorted by finishing position.

    Note

    This class is usually not instantiated directly. You should create a
    session and access the session result through the Session.results
    property.

    Parameters:

        - *args – passed on to pandas.DataFrame superclass

        - force_default_cols (bool) – Enforce that all default columns
          and only the default columns exist

        - **kwargs – passed on to pandas.DataFrame superclass (except
          ‘columns’ which is unsupported for this object)

    Added in version 2.2.

previous

Results Data

next

DriverResult

Choose version

On this page

- SessionResults

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
