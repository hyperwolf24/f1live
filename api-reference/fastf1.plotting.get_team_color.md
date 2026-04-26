- 
- API Reference
- Plotting Data
- get_team_color

get_team_color#

fastf1.plotting.get_team_color(identifier, session, *, colormap='default', exact_match=False)[source]#

    Get a team color based on a recognizable and identifiable part of
    the team name.

    The team color is returned as a hexadecimal RGB color code.

    Parameters:

        - identifier (str) – a recognizable part of the team name

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

get_driver_style

next

get_team_name

Choose version

On this page

- get_team_color()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
