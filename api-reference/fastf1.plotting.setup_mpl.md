- 
- API Reference
- Plotting Data
- setup_mpl

setup_mpl#

fastf1.plotting.setup_mpl(mpl_timedelta_support=True, color_scheme=None, *args, **kwargs)[source]#

    Setup matplotlib for use with fastf1.

    This is optional but, at least partly, highly recommended.

    Parameters:

        - mpl_timedelta_support (bool) –

          Matplotlib itself offers very limited functionality for
          plotting timedelta values. (Lap times, sector times and other
          kinds of time spans are represented as timedelta.)

          Enabling this option will patch some internal matplotlib
          functions and register converters, formatters and locators for
          tick formatting. The heavy lifting for this is done by an
          external package called ‘Timple’. See theOehrly/Timple if you
          wish to customize the tick formatting for timedelta.

        - color_scheme (str, None) – This enables the Fast-F1 color
          scheme that you can see in all example images. Valid color
          scheme names are: [‘fastf1’, None]

previous

Plotting Data

next

get_compound_color

Choose version

On this page

- setup_mpl()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
