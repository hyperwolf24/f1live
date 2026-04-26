- 
- API Reference
- Plotting Data
- get_team_name_by_driver

get_team_name_by_driver#

fastf1.plotting.get_team_name_by_driver(identifier, session, *, short=False, exact_match=False)[source]#

    Get a full team name based on a driver’s abbreviation or based on a
    recognizable and identifiable part of a driver’s name.

    Alternatively, a shortened version of the team name can be returned.
    The short version is intended for saving as much space as possible
    when annotating plots and may skip parts of the official team name.

    Parameters:

        - identifier (str) – driver abbreviation or recognizable part of
          the driver name

        - session (Session) – the session for which the data should be
          obtained

        - short (bool) – if True, a shortened version of the team name
          will be returned

        - exact_match (bool) – match the identifier exactly
          (case-insensitive, special characters are converted to their
          nearest ASCII equivalent)

    Return type:

        str

previous

get_team_name

next

get_compound_mapping

Choose version

On this page

- get_team_name_by_driver()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
