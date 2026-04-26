- 
- API Reference
- Plotting Data

Plotting Data#

The fastf1.plotting submodule contains helper functions for creating
data plots.

This submodule mainly offers:

    - team names and colors

    - driver names and driver abbreviations

    - Matplotlib integration and helper functions

FastF1 focuses on plotting with Matplotlib or related libraries like
Seaborn. If you wish to use these libraries, it is highly recommended to
enable extend support for these by calling setup_mpl().

Team Colormaps#

Currently, two team colormaps are supported. Each colormap provides one
color for each team. All functions that return colors for teams or
drivers accept an optional colormap argument. If this argument is not
provided, the default colormap is used. The default colormap can be
changed by using set_default_colormap().

The 'fastf1' colormap is FastF1’s default colormap. These colors are
teams’ primary colors or accent colors as they are used by the teams on
their website or in promotional material. The colors are chosen to
maximize readability in plots by creating a stronger contrast while
still being associated with the team. Colors are constant over the
course of a season.

The 'official' colormap contains the colors exactly as they are used by
F1 in official graphics and in the TV broadcast. Those colors are often
slightly muted. While that makes them more pleasing to look at in some
graphics, it also reduces the contrast between colors which is often bad
for readability of plots. These colors may change during the season if
they are updated by F1.

See here for a complete list of all colors: Overview over Team Colormaps

Note

Driver Colors

Previously, individual colors for each driver were provided. This is no
longer the case. The driver color is now equivalent to the team color,
meaning that drivers from the same team have the exact same color. This
change was made because different colors for 20 drivers end up looking
very similar in a lot of cases. Therefore, it is not a good solution to
use driver specific colors to distinguish between different drivers.
Other means of plot styling should be used instead.

API Summary#

Configuration and Setup#

  -------------------------------------------------- ---------------------------------------
  setup_mpl([mpl_timedelta_support, color_scheme])   Setup matplotlib for use with fastf1.
  -------------------------------------------------- ---------------------------------------

Get Colors, Names and Abbreviations for Drivers or Teams#

  --------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------
  get_compound_color(compound, session)               Get the compound color as hexadecimal RGB color code for a given compound.
  get_driver_abbreviation(identifier, session, *)     Get a driver's abbreviation based on a recognizable and identifiable part of the driver's name.
  get_driver_abbreviations_by_team(identifier, ...)   Get a list of abbreviations of all drivers that drove for a team in a given session based on a recognizable and identifiable part of the team name.
  get_driver_color(identifier, session, *[, ...])     Get the color that is associated with a driver based on the driver's abbreviation or based on a recognizable and identifiable part of the driver's name.
  get_driver_name(identifier, session, *[, ...])      Get a full driver name based on the driver's abbreviation or based on a recognizable and identifiable part of the driver's name.
  get_driver_names_by_team(identifier, session, *)    Get a list of full names of all drivers that drove for a team in a given session based on a recognizable and identifiable part of the team name.
  get_driver_style(identifier, style, session, *)     Get a plotting style that is unique for a driver based on the driver's abbreviation or based on a recognizable and identifiable part of the driver's name.
  get_team_color(identifier, session, *[, ...])       Get a team color based on a recognizable and identifiable part of the team name.
  get_team_name(identifier, session, *[, ...])        Get a full or shortened team name based on a recognizable and identifiable part of the team name.
  get_team_name_by_driver(identifier, session, *)     Get a full team name based on a driver's abbreviation or based on a recognizable and identifiable part of a driver's name.
  --------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------

List all Names and Abbreviations for Drivers/Teams in a Session#

  -------------------------------------------------- ---------------------------------------------------------------------------------
  get_compound_mapping(session)                      Returns a dictionary that maps compound names to their associated colors.
  get_driver_color_mapping(session, *[, colormap])   Returns a dictionary that maps driver abbreviations to their associated colors.
  list_compounds(session)                            Returns a list of all compound names for this season (not session).
  list_driver_abbreviations(session)                 Returns a list of abbreviations of all drivers in the session.
  list_driver_names(session)                         Returns a list of full names of all drivers in the session.
  list_team_names(session, *[, short])               Returns a list of team names of all teams in the session.
  -------------------------------------------------- ---------------------------------------------------------------------------------

Plot Styling#

  --------------------------------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------
  add_sorted_driver_legend(ax, session, *args, ...)   Adds a legend to the axis where drivers are grouped by team and within each team they are shown in the same order that is used for selecting plot styles.
  set_default_colormap(colormap)                      Set the default colormap that is used for color lookups.
  --------------------------------------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------

Advanced Functionality#

  ------------------------------------------------- ----------------------------------------------------------
  override_team_constants(identifier, session, *)   Override the default team constants for a specific team.
  ------------------------------------------------- ----------------------------------------------------------

previous

get_testing_event

next

setup_mpl

Choose version

On this page

- Team Colormaps
- API Summary
  - Configuration and Setup
  - Get Colors, Names and Abbreviations for Drivers or Teams
  - List all Names and Abbreviations for Drivers/Teams in a Session
  - Plot Styling
  - Advanced Functionality

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
