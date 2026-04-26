- 
- API Reference
- Plotting Data
- override_team_constants

override_team_constants#

fastf1.plotting.override_team_constants(identifier, session, *, short_name=None, official_color=None, fastf1_color=None)[source]#

    Override the default team constants for a specific team.

    This function is intended for advanced users who want to customize
    the default team constants. The changes are only applied for the
    current session and do not persist.

    Parameters:

        - identifier (str) – A part of the team name. Note that this
          function does not support fuzzy matching and will raise a
          KeyError if no exact and unambiguous match is found!

        - session (Session) – The session for which the override should
          be applied

        - short_name (str | None) – New value for the short name of the
          team

        - official_color (str | None) – New value for the team color in
          the “official” color map; must be a hexadecimal RGB color code

        - fastf1_color (str | None) – New value for the team color in
          the “fastf1” color map; must be a hexadecimal RGB color code

previous

set_default_colormap

next

Event Schedule

Choose version

On this page

- override_team_constants()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
