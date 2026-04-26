- 
- API Reference
- Plotting Data
- get_driver_color

get_driver_color#

fastf1.plotting.get_driver_color(identifier, session, *, colormap='default', exact_match=False)[source]#

    Get the color that is associated with a driver based on the driver’s
    abbreviation or based on a recognizable and identifiable part of the
    driver’s name.

    Note

    This will simply return the team color of the team that the driver
    participated for in this session. Contrary to older versions of
    FastF1, there are no separate colors for each driver. You should use
    styling options other than color if you need to differentiate
    drivers of the same team. The function get_driver_style() can help
    you to customize the plot styling for each driver.

    Parameters:

        - identifier (str) – driver abbreviation or recognizable part of
          the driver name

        - session (Session) – the session for which the data should be
          obtained

        - colormap (str) – one of 'default', 'fastf1' or 'official'. The
          default colormap is 'fastf1'. Use set_default_colormap() to
          change it.

        - exact_match (bool) – match the identifier exactly
          (case-insensitive, special characters are converted to their
          nearest ASCII equivalent)

    Return type:

        str

    Returns:

        A hexadecimal RGB color code

previous

get_driver_abbreviations_by_team

next

get_driver_name

Choose version

On this page

- get_driver_color()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
