- 
- API Reference
- Plotting Data
- add_sorted_driver_legend

add_sorted_driver_legend#

fastf1.plotting.add_sorted_driver_legend(ax, session, *args, **kwargs)[source]#

    Adds a legend to the axis where drivers are grouped by team and
    within each team they are shown in the same order that is used for
    selecting plot styles.

    This function is a drop-in replacement for calling Matplotlib’s
    ax.legend() method. It can only be used when driver names or driver
    abbreviations are used as labels for the legend.

    This function supports the same *args and **kwargs as Matplotlib’s
    ax.legend(), including the handles and labels arguments. Check the
    Matplotlib documentation for more information.

    There is no particular need to use this function except to make the
    legend more visually pleasing.

    Parameters:

        - ax (Axes) – An instance of a Matplotlib Axes object

        - session (Session) – the session for which the data should be
          obtained

        - *args – Matplotlib legend args

        - **kwargs –

          Matplotlib legend kwargs

          Returns:

              matplotlib.legend.Legend

    Examples using fastf1.plotting.add_sorted_driver_legend#

    []
    Driver specific plot styling

    Driver specific plot styling

previous

list_team_names

next

set_default_colormap

Choose version

On this page

- add_sorted_driver_legend()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
