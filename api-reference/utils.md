- 
- API Reference
- Utils

Utils#

This is a collection of various functions.

fastf1.utils.delta_time(reference_lap, compare_lap)[source]#

    Calculates the delta time of a given lap, along the ‘Distance’ axis
    of the reference lap.

    Deprecated since version 3.0.0.

    Warning

    This function should no longer be considered as a stable part of the
    API. Due to the reasons given below, this function will be modified
    or removed at a future point.

    Warning

    This is a nice gimmick but not actually very accurate which is an
    inherent problem from the way this is calculated currently (There
    may not be a better way though). In comparison with the sector times
    and the differences that can be calculated from these, there are
    notable differences! You should always verify the result against
    sector time differences or find a different way for verification.

    Here is an example that compares the quickest laps of Leclerc and
    Hamilton from Bahrain 2021 Qualifying:

        import fastf1 as ff1
        from fastf1 import plotting
        from fastf1 import utils
        from matplotlib import pyplot as plt

        plotting.setup_mpl(color_scheme='fastf1')

        session = ff1.get_session(2021, 'Emilia Romagna', 'Q')
        session.load()
        lec = session.laps.pick_drivers('LEC').pick_fastest()
        ham = session.laps.pick_drivers('HAM').pick_fastest()

        delta_time, ref_tel, compare_tel = utils.delta_time(ham, lec)
        # ham is reference, lec is compared

        fig, ax = plt.subplots()
        # use telemetry returned by .delta_time for best accuracy,
        # this ensures the same applied interpolation and resampling
        ax.plot(ref_tel['Distance'], ref_tel['Speed'],
                color=plotting.get_team_color(ham['Team'], session))
        ax.plot(compare_tel['Distance'], compare_tel['Speed'],
                color=plotting.get_team_color(lec['Team'], session))

        twin = ax.twinx()
        twin.plot(ref_tel['Distance'], delta_time, '--', color='white')
        twin.set_ylabel("<-- Lec ahead | Ham ahead -->")
        plt.show()

    (png, hires.png, pdf)

    []

    Parameters:

        - reference_lap (Lap) – The lap taken as reference

        - compare_lap (Lap) – The lap to compare

    Return type:

        tuple[Series, Telemetry, Telemetry]

    Returns:

        A tuple containing

        - pd.Series of type float64 with the delta in seconds.

        - Telemetry for the reference lap

        - Telemetry for the comparison lap

        Use the return telemetry for plotting to make sure you have
        telemetry data that was created with the same interpolation and
        resampling options!

fastf1.utils.recursive_dict_get(d, *keys, default_none=False)[source]#

    Recursive dict get. Can take an arbitrary number of keys and returns
    an empty dict if any key does not exist.
    https://stackoverflow.com/a/28225747

fastf1.utils.to_timedelta(x)[source]#

    Fast timedelta object creation from a time string

    Permissible string formats:

      For example: 13:24:46.320215 with:

        - optional hours and minutes

        - optional microseconds and milliseconds with arbitrary
          precision (1 to 6 digits)

      Examples of valid formats:

        - 24.3564 (seconds + milli/microseconds)

        - 36:54 (minutes + seconds)

        - 8:45:46 (hours, minutes, seconds)

    Parameters:

        x (str | timedelta) – timestamp

    Return type:

        timedelta | None

fastf1.utils.to_datetime(x)[source]#

    Fast datetime object creation from a date string.

    Permissible string formats:

      For example ‘2020-12-13T13:27:15.320000Z’ with:

        - optional milliseconds and microseconds with arbitrary
          precision (1 to 6 digits)

        - with optional trailing letter ‘Z’

      Examples of valid formats:

        - 2020-12-13T13:27:15.320000

        - 2020-12-13T13:27:15.32Z

        - 2020-12-13T13:27:15

    Parameters:

        x (str | datetime) – timestamp

    Return type:

        datetime | None

previous

LiveTimingData

next

Deprecated Legacy API

Choose version

On this page

- delta_time()
- recursive_dict_get()
- to_timedelta()
- to_datetime()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
