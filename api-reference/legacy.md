- 
- API Reference
- Deprecated Legacy API
- Legacy Functionality - fastf1.legacy

Legacy Functionality - fastf1.legacy#

This module contains the legacy implementation for calculating distance
to driver ahead.

inject_driver_ahead() adds ‘DriverAhead’ and ‘DistanceToDriverAhead’ to
the position data for all laps of all drivers. This functionality has
been replaced with fastf1.core.Telemetry.add_driver_ahead(). The new
implementation provides smoother and more accurate results.
Additionally, it can be applied to arbitrary slices of data. But it
suffers from integration error when used over multiple laps. The legacy
implementation has no integration error issues.

It is recommended to use the new version. If necessary, it should be
applied lap by lap and the lap data should be concatenated afterwards.
Still, the old version can be used if so desired.

The following is an example comparison plot of the legacy version and
the new version. It also shows how the two versions can be used.

    import fastf1
    import fastf1.plotting
    import fastf1.legacy
    import numpy as np
    import matplotlib.pyplot as plt

    fastf1.plotting.setup_mpl(color_scheme='fastf1')

    session = fastf1.get_session(2020, 'Italy', 'R')
    session.load()

    DRIVER = 'VER'  # which driver; need to specify number and abbreviation
    DRIVER_NUMBER = '33'
    LAP_N = 10  # which lap number to plot

    drv_laps = session.laps.pick_drivers(DRIVER)
    drv_lap = drv_laps[(drv_laps['LapNumber'] == LAP_N)]  # select the lap

    # create a matplotlib figure
    fig = plt.figure()
    ax = fig.add_subplot()

    # ############### new
    df_new = drv_lap.get_car_data().add_driver_ahead()
    ax.plot(df_new['Time'], df_new['DistanceToDriverAhead'], label='new')

    # ############### legacy
    df_legacy = fastf1.legacy.inject_driver_ahead(session)[DRIVER_NUMBER].slice_by_lap(drv_lap)
    ax.plot(df_legacy['Time'], df_legacy['DistanceToDriverAhead'], label='legacy')

    plt.legend()
    plt.show()

(png, hires.png, pdf)

[]

fastf1.legacy.REFERENCE_LAP_RESOLUTION = 0.667#

    A distance in meters which indicates the resolution of the reference
    lap. This reference is used to project car positions and calculate
    things like distance between cars.

fastf1.legacy.inject_driver_ahead(session)[source]#

    Add ‘DistanceToDriverAhead’ and ‘DriverAhead’ column to position
    data of all drivers in session.

    Parameters:

        session – fastf1.core.Session

    Returns:

        A dictionary containing fastf1.core.Telemetry for each driver.
        The telemetry is the same as fastf1.core.Session.pos_data but
        with ‘DriverAhead’ and ‘DistanceToDriverAhead’ columns added to
        each drivers telemetry.

previous

F1 API - fastf1.api

next

Data Reference

Choose version

On this page

- REFERENCE_LAP_RESOLUTION
- inject_driver_ahead()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
