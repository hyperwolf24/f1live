- 
- API Reference
- Car Telemetry

Car Telemetry#

The Telemetry object is used to provide car telemetry and position data.

class fastf1.core.Telemetry(*args, session=None, driver=None, drop_unknown_channels=False, **kwargs)[source]#

    Multi-channel time series telemetry data

    The object can contain multiple telemetry channels. Multiple
    telemetry objects with different channels can be merged on time.
    Each telemetry channel is one dataframe column. Partial telemetry
    (e.g. for one lap only) can be obtained through various methods for
    slicing the data. Additionally, methods for adding common computed
    data channels are available.

    The following telemetry channels existed in the original API data:

      - 

        Car data:

            - Speed (float): Car speed [km/h]

            - RPM (float): Car RPM

            - nGear (int): Car gear number

            - Throttle (float): 0-100 Throttle pedal pressure [%] (The
              value 104 is sometimes observed to indicate an error or
              unavailable data. Usually, this only happens outside
              actual running when the car is stationary in the pits or
              on the grid.)

            - Brake (bool): Brakes are applied or not.

            - DRS (int): DRS indicator (See fastf1.api.car_data() for
              more info)

      - 

        Position data:

            - X (float): X position [1/10 m]

            - Y (float): Y position [1/10 m]

            - Z (float): Z position [1/10 m]

            - Status (str): Flag - OffTrack/OnTrack

      - 

        For both of the above:

            - Time (timedelta): Time (0 is start of the data slice)

            - SessionTime (timedelta): Time elapsed since the start of
              the session

            - Date (datetime): The full date + time at which this sample
              was created

            - Source (str): Flag indicating how this sample was created:

                - ‘car’: sample from original api car data

                - ‘pos’: sample from original api position data

                - ‘interpolated’: this sample was artificially created;
                  all values are computed/interpolated

                Example:

                    A sample’s source is indicated as ‘car’. It contains
                    values for speed, rpm and x, y, z coordinates.
                    Originally, this sample (with its timestamp) was
                    received when loading car data. This means that the
                    speed and rpm value are original values as received
                    from the api. The coordinates are interpolated for
                    this sample.

                    All methods of Telemetry which resample or
                    interpolate data will preserve and adjust the source
                    flag correctly when modifying data.

      Through merging/slicing it is possible to obtain any combination
      of telemetry channels! The following additional computed data
      channels can be added:

        - Distance driven between two samples:
          add_differential_distance()

        - Distance driven since the first sample: add_distance()

        - Relative distance driven since the first sample:
          add_relative_distance()

        - Distance to driver ahead and car number of said driver:
          add_driver_ahead()

      Note

      See the separate explanation concerning the various definitions of
      ‘Time’ for more information on the three date and time related
      channels: Time, Date and Timing - Explanation

    Slicing this class will return Telemetry again for slices containing
    multiple rows. Single rows will be returned as pandas.Series.

    Parameters:

        - *args – passed through to pandas.DataFrame superclass

        - session (Session) – Instance of associated session object.
          Required for full functionality!

        - driver (str) – Driver number as string. Required for full
          functionality!

        - drop_unknown_channels (bool) – Remove all unknown data
          channels (i.e. columns) on initialization.

        - **kwargs – passed through to pandas.DataFrame superclass

    Attributes:

      --------------------- --------------------------------------------------------------------------------------------
      TELEMETRY_FREQUENCY   Defines the frequency used when resampling the telemetry data.
      base_class_view       For a nicer debugging experience; can view DataFrame through this property in various IDEs
      --------------------- --------------------------------------------------------------------------------------------

    Methods:

      ------------------------------------------------- ------------------------------------------------------------------------
      join(*args, **kwargs)                             Wraps pandas.DataFrame.join() and adds metadata propagation.
      merge(*args, **kwargs)                            Wraps pandas.DataFrame.merge() and adds metadata propagation.
      slice_by_mask(mask[, pad, pad_side])              Slice self using a boolean array as a mask.
      slice_by_lap(ref_laps[, pad, pad_side, ...])      Slice self to only include data from the provided lap or laps.
      slice_by_time(start_time, end_time[, pad, ...])   Slice self to only include data in a specific time frame.
      merge_channels(other[, frequency])                Merge telemetry objects containing different telemetry channels.
      resample_channels([rule, new_date_ref])           Resample telemetry data.
      fill_missing()                                    Calculate missing values in self.
      register_new_channel(name, signal_type[, ...])    Register a custom telemetry channel.
      get_first_non_zero_time_index()                   Return the first index at which the 'Time' value is not zero or NA/NaT
      add_differential_distance([drop_existing])        Add column 'DifferentialDistance' to self.
      add_distance([drop_existing])                     Add column 'Distance' to self.
      add_relative_distance([drop_existing])            Add column 'RelativeDistance' to self.
      add_track_status([drop_existing])                 Add column 'TrackStatus' to self.
      add_driver_ahead([drop_existing])                 Add column 'DriverAhead' and 'DistanceToDriverAhead' to self.
      calculate_differential_distance()                 Calculate the distance between subsequent samples of self.
      integrate_distance()                              Return the distance driven since the first sample of self.
      calculate_driver_ahead([return_reference])        Calculate driver ahead and distance to driver ahead.
      ------------------------------------------------- ------------------------------------------------------------------------

    TELEMETRY_FREQUENCY = 'original'#

        Defines the frequency used when resampling the telemetry data.
        Either the string 'original' or an integer to specify a
        frequency in Hz.

    property base_class_view#

        For a nicer debugging experience; can view DataFrame through
        this property in various IDEs

    join(*args, **kwargs)[source]#

        Wraps pandas.DataFrame.join() and adds metadata propagation.

        When calling self.join metadata will be propagated from self to
        the joined dataframe.

    merge(*args, **kwargs)[source]#

        Wraps pandas.DataFrame.merge() and adds metadata propagation.

        When calling self.merge metadata will be propagated from self to
        the merged dataframe.

    slice_by_mask(mask, pad=0, pad_side='both')[source]#

        Slice self using a boolean array as a mask.

        Parameters:

            - mask (list | Series | ndarray) – Array of boolean values
              with the same length as self

            - pad (int) – Number of samples used for padding the sliced
              data

            - pad_side (str) – Where to pad the data; possible options:
              ‘both’,

            - 'before'

            - 'after'

        Return type:

            Telemetry

    slice_by_lap(ref_laps, pad=0, pad_side='both', interpolate_edges=False)[source]#

        Slice self to only include data from the provided lap or laps.

        Note

        Self needs to contain a ‘SessionTime’ column.

        Note

        When slicing with an instance of Laps as a reference, the data
        will be sliced by first and last lap. Missing laps in between
        will not be considered and data for these will still be included
        in the sliced result.

        Parameters:

            - ref_laps (Union[Lap, Laps]) – The lap/laps by which to
              slice self

            - pad (int) – Number of samples used for padding the sliced
              data

            - pad_side (str) – Where to pad the data; possible options:
              ‘both’, ‘before’, ‘after

            - interpolate_edges (bool) – Add an interpolated sample at
              the beginning and end to exactly match the provided time
              window.

        Return type:

            Telemetry

    slice_by_time(start_time, end_time, pad=0, pad_side='both', interpolate_edges=False)[source]#

        Slice self to only include data in a specific time frame.

        Note

        Self needs to contain a ‘SessionTime’ column. Slicing by time
        use the ‘SessionTime’ as its reference.

        Parameters:

            - start_time (Timedelta) – Start of the section

            - end_time (Timedelta) – End of the section

            - pad (int) – Number of samples used for padding the sliced
              data

            - pad_side (str) – Where to pad the data; possible options:
              ‘both’, ‘before’, ‘after

            - interpolate_edges (bool) – Add an interpolated sample at
              the beginning and end to exactly match the provided time
              window.

        Return type:

            Telemetry

        Returns:

            Telemetry

    merge_channels(other, frequency=None)[source]#

        Merge telemetry objects containing different telemetry channels.

        The two objects don’t need to have a common time base. The data
        will be merged, optionally resampled and missing values will be
        interpolated.

        Telemetry.TELEMETRY_FREQUENCY determines if and how the data is
        resampled. This can be overridden using the frequency keyword
        for this method.

        Merging and resampling:

          If the frequency is ‘original’, data will not be resampled.
          The two objects will be merged and all timestamps of both
          objects are kept. Values will be interpolated so that all
          telemetry channels contain valid data for all timestamps. This
          is the default and recommended option.

          If the frequency is specified as an integer in Hz the data
          will be merged as before. After that, the merged time base
          will be resampled from the first value on at the specified
          frequency. Afterward, the data will be interpolated to fit the
          new time base. This means that usually most if not all values
          of the data will be interpolated values. This is detrimental
          for overall accuracy.

        Interpolation:

          Missing values after merging will be interpolated for all
          known telemetry channels using fill_missing(). Different
          interpolation methods are used depending on what kind of data
          the channel contains. For example, forward fill is used to
          interpolated ‘nGear’ while linear interpolation is used for
          ‘RPM’ interpolation.

        Note

        Unknown telemetry channels will be merged but missing values
        will not be interpolated. This can either be done manually or a
        custom telemetry channel can be added using
        register_new_channel().

        Note

        Do not resample data multiple times. Always resample based on
        the original data to preserve accuracy

        Parameters:

            - other (Union[Telemetry, DataFrame]) – Object to be merged
              with self

            - frequency (Union[int, Literal['original'], None]) –
              Optional frequency to overwrite the default value set by
              TELEMETRY_FREQUENCY. (Either string ‘original’ or integer
              for a frequency in Hz)

    resample_channels(rule=None, new_date_ref=None, **kwargs)[source]#

        Resample telemetry data.

        Convenience method for frequency conversion and resampling. Up
        and down sampling of data is supported. ‘Date’ and ‘SessionTime’
        need to exist in the data. ‘Date’ is used as the main time
        reference.

        There are two ways to use this method:

          - Usage like pandas.DataFrame.resample(): In this case you
            need to specify the ‘rule’ for resampling and any additional
            keywords will be passed on to pandas.Series.resample() to
            create a new time reference. See the pandas method to see
            which options are available.

          - using the ‘new_date_ref’ keyword a pandas.Series containing
            new values for date (dtype pandas.Timestamp) can be
            provided. The existing data will be resampled onto this new
            time reference.

        Parameters:

            - rule (str | None) – Resampling rule for
              pandas.Series.resample()

            - new_date_ref (Series | None) – New custom Series of
              reference dates

            - **kwargs (Any | None) – Only in combination with ‘rule’;
              additional parameters for pandas.Series.resample()

    fill_missing()[source]#

        Calculate missing values in self.

        Only known telemetry channels will be interpolated. Unknown
        channels are skipped and returned unmodified. Interpolation will
        be done according to the default mapping and according to
        options specified for registered custom channels. For example: |
        Linear interpolation will be used for continuous values (Speed,
        RPM) | Forward-fill will be used for discrete values (Gear, DRS,
        …)

        See register_new_channel() for adding custom channels.

    classmethod register_new_channel(name, signal_type, interpolation_method=None)[source]#

        Register a custom telemetry channel.

        Registered telemetry channels are automatically interpolated
        when merging or resampling data.

        Parameters:

            - name (str) – Telemetry channel/column name

            - signal_type (str) – One of three possible signal types: -
              ‘continuous’: Speed, RPM, Distance, … - ‘discrete’: DRS,
              nGear, status values, … - ‘excluded’: Data channel will be
              ignored during resampling

            - interpolation_method (str | None) – The interpolation
              method which should be used. Can only be specified and is
              required in combination with signal_type='continuous'. See
              pandas.Series.interpolate() for possible interpolation
              methods.

    get_first_non_zero_time_index()[source]#

        Return the first index at which the ‘Time’ value is not zero or
        NA/NaT

    add_differential_distance(drop_existing=True)[source]#

        Add column ‘DifferentialDistance’ to self.

        This column contains the distance driven between subsequent
        samples.

        Calls calculate_differential_distance() and joins the result
        with self.

        Parameters:

            drop_existing (bool) – Drop and recalculate column if it
            already exists

        Return type:

            Telemetry

        Returns:

            self joined with new column or self if column exists and
            drop_existing is False.

    add_distance(drop_existing=True)[source]#

        Add column ‘Distance’ to self.

        This column contains the distance driven since the first sample
        of self in meters.

        The data is produced by integrating the differential distance
        between subsequent laps. You should not apply this function to
        telemetry of many laps simultaneously to reduce integration
        error. Instead apply it only to single laps or few laps at a
        time!

        Calls integrate_distance() and joins the result with self.

        Parameters:

            drop_existing (bool) – Drop and recalculate column if it
            already exists

        Return type:

            Telemetry

        Returns:

            self joined with new column or self if column exists and
            drop_existing is False.

    add_relative_distance(drop_existing=True)[source]#

        Add column ‘RelativeDistance’ to self.

        This column contains the distance driven since the first sample
        as a floating point number where 0.0 is the first sample of self
        and 1.0 is the last sample.

        This is calculated the same way as ‘Distance’ (see:
        add_distance()). The same warnings apply.

        Parameters:

            drop_existing (bool) – Drop and recalculate column if it
            already exists

        Return type:

            Telemetry

        Returns:

            self joined with new column or self if column exists and
            drop_existing is False.

    add_track_status(drop_existing=True)[source]#

        Add column ‘TrackStatus’ to self.

        This column contains the Track Status for each event as a
        number.

        See fastf1.api.track_status_data() for more information.

        Parameters:

            drop_existing (bool) – Drop and recalculate column if it
            already exists.

        Returns:

            

            self joined with new column or self if column

                exists and drop_existing is False.

        Return type:

            Telemetry

    add_driver_ahead(drop_existing=True)[source]#

        Add column ‘DriverAhead’ and ‘DistanceToDriverAhead’ to self.

        DriverAhead: Driver number of the driver ahead as string
        DistanceToDriverAhead: Distance to next car ahead in meters

        Note

        Cars in the pit lane are currently not excluded from the data.
        They will show up when overtaken on pit straight even if they’re
        not technically in front of the car. A fix for this is TBD with
        other improvements.

        This should only be applied to data of single laps or few laps
        at a time to reduce integration error. For longer time spans it
        should be applied per lap and the laps should be merged
        afterwards. If you absolutely need to apply it to a whole
        session, use the legacy implementation. Note that data of the
        legacy implementation will be considerably less smooth. (see
        fastf1.legacy)

        Calls calculate_driver_ahead() and joins the result with self.

        Parameters:

            drop_existing (bool) – Drop and recalculate column if it
            already exists

        Return type:

            Telemetry

        Returns:

            self joined with new column or self if column exists and
            drop_existing is False.

    calculate_differential_distance()[source]#

        Calculate the distance between subsequent samples of self.

        Distance is in meters

        Return type:

            Series

    integrate_distance()[source]#

        Return the distance driven since the first sample of self.

        Distance is in meters. The data is produce by integration.
        Integration error will stack up when used for long slices of
        data. This should therefore only be used for data of single laps
        or few laps at a time.

        Returns:

            pd.Series

    calculate_driver_ahead(return_reference=False)[source]#

        Calculate driver ahead and distance to driver ahead.

        Driver ahead: Driver number of the driver ahead as string
        Distance to driver ahead: Distance to the car ahead in meters

        Note

        This gives a smoother/cleaner result than the legacy
        implementation but WILL introduce integration error when used
        over long distances (more than one or two laps may sometimes be
        considered a long distance). If in doubt, do sanity checks
        (against the legacy version or in another way).

        Parameters:

            return_reference (bool) – Additionally return the reference
            telemetry data slice that is used to calculate the new data.

        Returns:

            driver ahead (numpy.array), distance to driver ahead
            (numpy.array), [reference telemetry (optional, Telemetry)]

previous

Lap

next

Results Data

Choose version

On this page

- Telemetry
  - Telemetry.TELEMETRY_FREQUENCY
  - Telemetry.base_class_view
  - Telemetry.join()
  - Telemetry.merge()
  - Telemetry.slice_by_mask()
  - Telemetry.slice_by_lap()
  - Telemetry.slice_by_time()
  - Telemetry.merge_channels()
  - Telemetry.resample_channels()
  - Telemetry.fill_missing()
  - Telemetry.register_new_channel()
  - Telemetry.get_first_non_zero_time_index()
  - Telemetry.add_differential_distance()
  - Telemetry.add_distance()
  - Telemetry.add_relative_distance()
  - Telemetry.add_track_status()
  - Telemetry.add_driver_ahead()
  - Telemetry.calculate_differential_distance()
  - Telemetry.integrate_distance()
  - Telemetry.calculate_driver_ahead()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
