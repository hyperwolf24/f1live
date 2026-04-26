- 
- API Reference
- Plotting Data
- get_driver_abbreviation

get_driver_abbreviation#

fastf1.plotting.get_driver_abbreviation(identifier, session, *, exact_match=False)[source]#

    Get a driver’s abbreviation based on a recognizable and identifiable
    part of the driver’s name.

    Note that the driver’s abbreviation, if given exactly, is also a
    valid identifier. In this case the same value is returned as was
    given as the identifier.

    Parameters:

        - identifier (str) – recognizable part of the driver’s name (or
          the driver’s abbreviation)

        - session (Session) – the session for which the data should be
          obtained

        - exact_match (bool) – match the identifier exactly
          (case-insensitive, special characters are converted to their
          nearest ASCII equivalent)

    Return type:

        str

previous

get_compound_color

next

get_driver_abbreviations_by_team

Choose version

On this page

- get_driver_abbreviation()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
