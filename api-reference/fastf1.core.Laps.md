- 
- API Reference
- Timing Data
- Laps

Laps#

class fastf1.core.Laps(*args, session=None, **kwargs)[source]#

    Bases: BaseDataFrame

    Object for accessing lap (timing) data of multiple laps.

    Parameters:

        - *args – passed through to pandas.DataFrame super class

        - session (Session | None) – instance of session class; required
          for full functionality

        - **kwargs – passed through to pandas.DataFrame super class

    This class allows for easily picking specific laps from all laps in
    a session. It implements some additional functionality on top of the
    usual pandas.DataFrame functionality. Among others, the laps’
    associated telemetry data can be accessed.

    If for example you want to get the fastest lap of Bottas you can
    narrow it down like this:

        import fastf1

        session = fastf1.get_session(2019, 'Bahrain', 'Q')
        session.load()
        best_bottas = session.laps.pick_drivers('BOT').pick_fastest()

        print(best_bottas['LapTime'])
        # Timedelta('0 days 00:01:28.256000')

    Slicing this class will return Laps again for slices containing
    multiple rows. Single rows will be returned as Lap.

    Attributes:

      -------------------- -------------------------------------
      QUICKLAP_THRESHOLD   Used to determine 'quick' laps.
      telemetry            Telemetry data for all laps in self
      -------------------- -------------------------------------

    Methods:

      ---------------------------------- -------------------------------------------------------------------------------------------------------------------------------------
      join(*args, **kwargs)              Wraps pandas.DataFrame.join() and adds metadata propagation.
      merge(*args, **kwargs)             Wraps pandas.DataFrame.merge() and adds metadata propagation.
      get_telemetry(*[, frequency])      Telemetry data for all laps in self
      get_car_data(**kwargs)             Car data for all laps in self
      get_pos_data(**kwargs)             Pos data for all laps in self
      get_weather_data()                 Return weather data for each lap in self.
      pick_lap(lap_number)               Return all laps of a specific LapNumber in self based on LapNumber.
      pick_laps(lap_numbers)             Return all laps of a specific LapNumber or a list of LapNumbers in self. ::.
      pick_driver(identifier)            Return all laps of a specific driver in self based on the driver's three letters identifier or based on the driver number.
      pick_drivers(identifiers)          Return all laps of the specified driver or drivers in self based on the drivers' three letters identifier or the driver number. ::.
      pick_team(name)                    Return all laps of a specific team in self based on the team's name.
      pick_teams(names)                  Return all laps of the specified team or teams in self based on the team names. ::.
      pick_fastest([only_by_time])       Return the lap with the fastest lap time.
      pick_quicklaps([threshold])        Return all laps with LapTime faster than a certain limit.
      pick_tyre(compound)                Return all laps in self which were done on a specific compound.
      pick_compounds(compounds)          Return all laps in self which were done on some specific compounds.
      pick_track_status(status[, how])   Return all laps set under a specific track status.
      pick_wo_box()                      Return all laps which are NOT in laps or out laps.
      pick_box_laps([which])             Return all laps which are either in-laps, out-laps, or both.
      pick_not_deleted()                 Return all laps whose lap times are NOT deleted.
      pick_accurate()                    Return all laps which pass the accuracy validation check (lap['IsAccurate'] is True).
      split_qualifying_sessions()        Splits a lap object into individual laps objects for each qualifying session.
      iterlaps([require])                Iterator for iterating over all laps in self.
      ---------------------------------- -------------------------------------------------------------------------------------------------------------------------------------

    QUICKLAP_THRESHOLD = 1.07#

        Used to determine ‘quick’ laps. Defaults to the 107% rule.

    property telemetry: Telemetry#

        Telemetry data for all laps in self

        This is a cached (!) property for get_telemetry(). It will
        return the same value as get_telemetry but cache the result so
        that the involved processing is only done once.

        This is mainly provided for convenience and backwards
        compatibility.

        See get_telemetry() for more information.

        Note

        Telemetry can only be returned if self contains laps of one
        driver only.

        Returns:

            instance of Telemetry

    join(*args, **kwargs)[source]#

        Wraps pandas.DataFrame.join() and adds metadata propagation.

        When calling self.join metadata will be propagated from self to
        the joined dataframe.

    merge(*args, **kwargs)[source]#

        Wraps pandas.DataFrame.merge() and adds metadata propagation.

        When calling self.merge metadata will be propagated from self to
        the merged dataframe.

    get_telemetry(*, frequency=None)[source]#

        Telemetry data for all laps in self

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
        by TELEMETRY_FREQUENCY.

        Note

        Telemetry can only be returned if self contains laps of one
        driver only.

        Parameters:

            frequency (Union[int, Literal['original'], None]) – Optional
            frequency to overwrite the default value set by
            TELEMETRY_FREQUENCY. (Either string ‘original’ or integer
            for a frequency in Hz)

        Return type:

            Telemetry

        Returns:

            instance of Telemetry

    get_car_data(**kwargs)[source]#

        Car data for all laps in self

        Slices the car data in Session.car_data using this set of laps
        and returns the result.

        The data returned by this method does not contain computed
        telemetry channels. The can be added by calling the appropriate
        add_*() method on the returned telemetry object..

        Note

        Car data can only be returned if self contains laps of one
        driver only.

        Parameters:

            **kwargs – Keyword arguments are passed to
            Telemetry.slice_by_lap()

        Return type:

            Telemetry

        Returns:

            instance of Telemetry

    get_pos_data(**kwargs)[source]#

        Pos data for all laps in self

        Slices the position data in Session.pos_data using this set of
        laps and returns the result.

        Note

        Position data can only be returned if self contains laps of one
        driver only.

        Parameters:

            **kwargs – Keyword arguments are passed to
            Telemetry.slice_by_lap()

        Return type:

            Telemetry

        Returns:

            instance of Telemetry

    get_weather_data()[source]#

        Return weather data for each lap in self.

        Weather data is updated once per minute. This means that there
        are usually one or two data points per lap. This function will
        always return only one data point per lap:

          - The first value within the duration of a lap

        or

          - the last known value before the end of the lap if there are
            no values within the duration of a lap

        Note

        The returned DataFrame will have one row for each lap in self.
        If self contains laps from multiple drivers, these may overlap
        and the returned DataFrame may contain duplicate rows with
        duplicate index values.

        See fastf1.api.weather_data() for available data channels.

        If you wish to have more control over the data, you can access
        the weather data directly in Session.weather_data.

        Return type:

            DataFrame

        Returns:

            pandas.DataFrame

            >>> session = fastf1.get_session(2019, 'Monza', 'Q')
            >>> session.load(telemetry=False)
            >>> weather_data = session.laps.get_weather_data()
            >>> print(weather_data)
                                 Time AirTemp  ... WindDirection WindSpeed
            20 0 days 00:20:14.613000    22.5  ...           212       2.0
            21 0 days 00:21:15.001000    22.5  ...           207       2.7
            23 0 days 00:23:14.854000    22.7  ...           210       2.3
            24 0 days 00:24:14.430000    23.2  ...           207       3.2
            26 0 days 00:26:14.315000    23.6  ...           238       1.8
            ..                    ...     ...  ...           ...       ...
            36 0 days 00:36:14.426000    23.0  ...           192       0.9
            37 0 days 00:37:14.391000    23.3  ...           213       0.9
            28 0 days 00:28:14.324000    23.5  ...           183       1.3
            34 0 days 00:34:14.385000    23.0  ...           272       0.8
            35 0 days 00:35:14.460000    23.2  ...           339       1.1

            [275 rows x 8 columns]

        Joining weather data with lap timing data:

            >>> import pandas as pd  # needed additionally to fastf1

            # prepare the data for joining
            >>> laps = session.laps
            >>> laps = laps.reset_index(drop=True)
            >>> weather_data = weather_data.reset_index(drop=True)

            # exclude the 'Time' column from weather data when joining
            >>> joined = pd.concat([laps, weather_data.loc[:, ~(weather_data.columns == 'Time')]], axis=1)
            >>> print(joined)
                                  Time Driver  ... WindDirection WindSpeed
            0   0 days 00:21:01.358000    LEC  ...           212       2.0
            1   0 days 00:22:21.775000    LEC  ...           207       2.7
            2   0 days 00:24:03.991000    LEC  ...           210       2.3
            3   0 days 00:25:24.117000    LEC  ...           207       3.2
            4   0 days 00:27:09.461000    LEC  ...           238       1.8
            ..                     ...    ...  ...           ...       ...
            270 0 days 00:36:38.150000    KUB  ...           192       0.9
            271 0 days 00:38:37.508000    KUB  ...           213       0.9
            272 0 days 00:33:27.227000    VER  ...           183       1.3
            273 0 days 00:35:05.865000    VER  ...           272       0.8
            274 0 days 00:36:47.787000    VER  ...           339       1.1

            [275 rows x 38 columns]

    pick_lap(lap_number)[source]#

        Return all laps of a specific LapNumber in self based on
        LapNumber.

        Deprecated since version 3.1.0: pick_lap is deprecated and will
        be removed in a future release. Use pick_laps() instead.

        lap_1 = session_laps.pick_lap(1) lap_25 =
        session_laps.pick_lap(25)

        Parameters:

            lap_number (int) – Lap number

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_laps(lap_numbers)[source]#

        Return all laps of a specific LapNumber or a list of LapNumbers
        in self.

            lap_1 = session_laps.pick_laps(1)
            lap_10_to_20 = session_laps.pick_lap(range(10, 21))

        Parameters:

            lap_numbers (int | Iterable[int]) – int for matching a
            single lap, an iterable of ints for matching multiple laps

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_driver(identifier)[source]#

        Return all laps of a specific driver in self based on the
        driver’s three letters identifier or based on the driver number.

        Deprecated since version 3.1.0: pick_driver is deprecated and
        will be removed in a future release. Use pick_drivers() instead.

        perez_laps = session_laps.pick_drivers(‘PER’) bottas_laps =
        session_laps.pick_drivers(77) kimi_laps =
        session_laps.pick_drivers(‘RAI’)

        Parameters:

            identifier (str or int) – Driver abbreviation or number

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_drivers(identifiers)[source]#

        Return all laps of the specified driver or drivers in self based
        on the drivers’ three letters identifier or the driver number.

            ver_laps = session_laps.pick_drivers("VER")
            some_drivers_laps = session_laps.pick_drivers([5, 'BOT', 7])

        Parameters:

            identifiers (int | str | Iterable[int | str]) – Multiple
            driver abbreviations or driver numbers (can be mixed)

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_team(name)[source]#

        Return all laps of a specific team in self based on the team’s
        name.

        Deprecated since version 3.1.0: pick_team is deprecated and will
        be removed in a future release. Use pick_teams() instead.

        mercedes = session_laps.pick_team(‘Mercedes’) alfa_romeo =
        session_laps.pick_team(‘Alfa Romeo’)

        Parameters:

            name (str) – Team name

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_teams(names)[source]#

        Return all laps of the specified team or teams in self based on
        the team names.

            rbr_laps = session_laps.pick_teams("Red Bull")
            some_drivers_laps = session_laps.pick_teams(['Haas', 'Alpine'])

        Parameters:

            names (str | Iterable[str]) – A single team name or team
            names

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_fastest(only_by_time=False)[source]#

        Return the lap with the fastest lap time.

        This method will by default return the quickest lap out of self,
        that is also marked as personal best lap of a driver.

        If the quickest lap by lap time is not marked as personal best,
        this means that it was not counted. This can be the case for
        example, if the driver exceeded track limits and the lap time
        was deleted.

        If no lap is marked as personal best lap or self contains no
        laps, None is returned instead.

        The check for personal best lap can be disabled, so that any
        quickest lap will be returned.

        Parameters:

            only_by_time (bool) – Ignore whether any laps are marked as
            personal best laps and simply return the lap that has the
            lowest lap time.

        Return type:

            Optional[Lap]

        Returns:

            instance of Lap or None

    pick_quicklaps(threshold=None)[source]#

        Return all laps with LapTime faster than a certain limit. By
        default, the threshold is 107% of the best LapTime of all laps
        in self.

        Parameters:

            threshold (float | None) – custom threshold coefficient
            (e.g. 1.05 for 105%)

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_tyre(compound)[source]#

        Return all laps in self which were done on a specific compound.

        Deprecated since version 3.1.0: pick_tyre is deprecated and will
        be removed in a future release. Use pick_compounds() instead.

        Parameters:

            compound (str) – may be “SOFT”, “MEDIUM”, “HARD”,
            “INTERMEDIATE”, “WET”, “UNKNOWN”, or “TEST_UNKNOWN”

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_compounds(compounds)[source]#

        Return all laps in self which were done on some specific
        compounds.

            soft_laps = session_laps.pick_compounds("SOFT")
            slick_laps = session_laps.pick_compounds(['SOFT', 'MEDIUM', "HARD])

        Parameters:

            compounds (str | Iterable[str]) – may be “SOFT”, “MEDIUM”,
            “HARD”, “INTERMEDIATE”, “WET”, “UNKNOWN”, or “TEST_UNKNOWN”

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_track_status(status, how='equals')[source]#

        Return all laps set under a specific track status.

        Parameters:

            - status (str) – The track status as a string, e.g. ‘1’

            - how (str) –

              one of ‘equals’/’contains’/’excludes’/’any’/’none’

              - how=’equals’: status=’2’ will only match ‘2’.

              - how=’contains’: status=’2’ will also match ‘267’ and
                similar

              - how=’excludes’: status=’26’ will not match ‘267’ but
                will match ‘27’

              - how=’any’: status=’26’ will match both ‘2’ and ‘6’

              - how=’none’: status=’26’ will not match either ‘12’ or
                ‘16’

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_wo_box()[source]#

        Return all laps which are NOT in laps or out laps.

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_box_laps(which='both')[source]#

        Return all laps which are either in-laps, out-laps, or both.
        Note: a lap could be an in-lap and an out-lap at the same time.
        In that case, it will get returned regardless of the ‘which’
        parameter.

        Parameters:

            which (str) –

            one of ‘in’/’out’/’both’

            - which=’in’: only laps in which the driver entered the pit
              lane are returned

            - which=’out’: only laps in which the driver exited the pit
              lane are returned

            - which=’both’: both in-laps and out-laps are returned

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_not_deleted()[source]#

        Return all laps whose lap times are NOT deleted.

        Return type:

            Laps

        Returns:

            instance of Laps

    pick_accurate()[source]#

        Return all laps which pass the accuracy validation check
        (lap[‘IsAccurate’] is True).

        Return type:

            Laps

        Returns:

            instance of Laps

    split_qualifying_sessions()[source]#

        Splits a lap object into individual laps objects for each
        qualifying session.

        This method only works for qualifying sessions and requires that
        session status data is loaded.

        Example:

            q1, q2, q3 = laps.split_qualifying_sessions()

        Return type:

            list[Optional[Laps]]

        Returns: Three Laps objects, one for Q1, Q2 and Q3

            each. If any of these sessions was cancelled, None will be
            returned instead of Laps.

    iterlaps(require=None)[source]#

        Iterator for iterating over all laps in self.

        This method wraps pandas.DataFrame.iterrows(). It additionally
        provides the require keyword argument.

        Parameters:

            require (Iterable | None) – Require is a list of
            column/telemetry channel names. All names listed in require
            must exist in the data and have a non-null value (tested
            with pandas.is_null()). The iterator only yields laps for
            which this is true. If require is left empty, the iterator
            will yield all laps.

        Yields:

            (index, lap) – label and an instance of Lap

        Return type:

            Iterable[tuple[int, Lap]]

previous

Timing Data

next

Lap

Choose version

On this page

- Laps
  - Laps.QUICKLAP_THRESHOLD
  - Laps.telemetry
  - Laps.join()
  - Laps.merge()
  - Laps.get_telemetry()
  - Laps.get_car_data()
  - Laps.get_pos_data()
  - Laps.get_weather_data()
  - Laps.pick_lap()
  - Laps.pick_laps()
  - Laps.pick_driver()
  - Laps.pick_drivers()
  - Laps.pick_team()
  - Laps.pick_teams()
  - Laps.pick_fastest()
  - Laps.pick_quicklaps()
  - Laps.pick_tyre()
  - Laps.pick_compounds()
  - Laps.pick_track_status()
  - Laps.pick_wo_box()
  - Laps.pick_box_laps()
  - Laps.pick_not_deleted()
  - Laps.pick_accurate()
  - Laps.split_qualifying_sessions()
  - Laps.iterlaps()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
