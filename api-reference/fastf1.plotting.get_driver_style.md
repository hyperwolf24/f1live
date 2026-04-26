- 
- API Reference
- Plotting Data
- get_driver_style

get_driver_style#

fastf1.plotting.get_driver_style(identifier, style, session, *, colormap='default', additional_color_kws=(), exact_match=False)[source]#

    Get a plotting style that is unique for a driver based on the
    driver’s abbreviation or based on a recognizable and identifiable
    part of the driver’s name.

    This function simplifies the task of generating unique and easily
    distinguishable visual styles for multiple drivers in a plot.
    Primarily, the focus is on plotting with Matplotlib, but it is
    possible to customize the behaviour for compatibility with other
    plotting libraries.

    The general idea for creating visual styles is as follows:

    1.  Set the primary color of the style to the color of the team for
        which a driver is driving. This may be the line color in a line
        plot, the marker color in a scatter plot, and so on.

    2.  Use one or multiple other styling options (line style, markers,
        …) to differentiate drivers in the same team.

    Note

    It cannot be guaranteed that the styles are consistent throughout a
    full season, especially in case of driver changes within a team.

    Option 1: Rely on built-in styling options

    By default, this function supports the following Matplotlib plot
    arguments: linestyle, marker, color, facecolor, edgecolor as well as
    almost all other color-related arguments.

    The styling options include one color for each team and up to four
    different line styles and marker styles within a team. That means
    that no more than four different drivers are supported for a team in
    a single session. This should be sufficient in almost all scenarios.

    The following example obtains the driver style for Alonso and Stroll
    in a race in the 2023 season. The drivers should be represented
    using the color and marker arguments, as may be useful in a scatter
    plot. Both drivers were driving for the Aston Martin team,
    therefore, both automatically get assigned the same color, which is
    the Aston Martin team color. But both drivers get assigned a
    different marker style, so they can be uniquely identified in the
    plot.

    Example:

        >>> from fastf1 import get_session
        >>> from fastf1.plotting import get_driver_style
        >>> session = get_session(2023, 10, 'R')
        >>> get_driver_style('ALO', ['color', 'marker'], session)
        {'color': '#00665e', 'marker': 'x'}
        >>> get_driver_style('STR', ['color', 'marker'], session)
        {'color': '#00665e', 'marker': 'o'}

    Option 2: Provide a custom list of styling variants

    To allow for almost unlimited styling options, it is possible to
    specify custom styling variants. These are not tied to any specific
    plotting library.

    In the following example, a list with two custom styles is defined
    that are then used to generate driver specific styles. Each style is
    represented by a dictionary of keywords and values.

    The first driver in a team gets assigned the first style, the second
    driver the second style and so on (if there are more than two
    drivers). It is necessary to define at least as many styles as there
    are drivers in a team.

    The following things need to be noted:

    1. The notion of first or second driver does not refer to any
    particular reference and no specific order for drivers within a team
    is intended or guaranteed.

    2. Any color-related key can make use of the “magic” 'auto' value as
    shown with Alonso in this example. When the color value is set to
    'auto' it will automatically be replaced with the team color for
    this driver. All color keywords that are used in Matplotlib should
    be recognized automatically. You can define custom arguments as
    color arguments through the additional_color_kws argument. The
    replacement is done recursively so it will also work if your custom
    style dictionaries contain nested dictionaries as values.

    3. Each style dictionary can contain arbitrary keys and value.
    Therefore, you are not limited to any particular plotting library.

    Example:

        >>> from fastf1 import get_session
        >>> from fastf1.plotting import get_driver_style
        >>> session = get_session(2023, 10, 'R')
        >>> my_styles = [
        ...     {'linestyle': 'solid', 'color': 'auto', 'custom_arg': True},
        ...     {'linestyle': 'dotted', 'color': '#FF0060', 'other_arg': 10}
        ... ]
        >>> get_driver_style('ALO', my_styles, session)
        {'linestyle': 'solid', 'color': '#00665e', 'custom_arg': True}
        >>> get_driver_style('STR', my_styles, session)
        {'linestyle': 'dotted', 'color': '#FF0060', 'other_arg': 10}

    Parameters:

        - identifier (str) – driver abbreviation or recognizable part of
          the driver name

        - style (str | Sequence[str] | Sequence[dict]) – list of
          matplotlib plot arguments that should be used for styling or a
          list of custom style dictionaries

        - session (Session) – the session for which the data should be
          obtained

        - colormap (str) – one of 'default', 'fastf1' or 'official'. The
          default colormap is 'fastf1'. Use set_default_colormap() to
          change it.

        - additional_color_kws (list | tuple) – A list of keys that
          should additionally be treated as colors. This is most useful
          for making the magic 'auto' color work with custom styling
          options.

        - exact_match (bool) – match the identifier exactly
          (case-insensitive, special characters are converted to their
          nearest ASCII equivalent)

    Return type:

        dict[str, Any]

    Returns: a dictionary of plot style arguments that can be directly passed

        to a matplotlib plot function using the ** expansion operator

    Examples using fastf1.plotting.get_driver_style#

    []
    Driver specific plot styling

    Driver specific plot styling

    []
    Position changes during a race

    Position changes during a race

previous

get_driver_names_by_team

next

get_team_color

Choose version

On this page

- get_driver_style()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
