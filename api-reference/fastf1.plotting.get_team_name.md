- 
- API Reference
- Plotting Data
- get_team_name

get_team_name#

fastf1.plotting.get_team_name(identifier, session, *, short=False, exact_match=False)[source]#

    Get a full or shortened team name based on a recognizable and
    identifiable part of the team name.

    The short version of the team name is intended for saving space when
    annotating plots and may skip parts of the official team name, for
    example “Haas F1 Team” becomes just “Haas”.

    Parameters:

        - identifier (str) – a recognizable part of the team name

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

get_team_color

next

get_team_name_by_driver

Choose version

On this page

- get_team_name()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
