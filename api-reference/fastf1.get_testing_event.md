- 
- API Reference
- Loading Data
- get_testing_event

get_testing_event#

fastf1.get_testing_event(year, test_number, *, backend=None)[source]#

    Create a fastf1.events.Event object for testing sessions based on
    year and test event number.

    Parameters:

        - year (int) – Championship year

        - test_number (int) – Number of the testing event (usually at
          most two)

        - backend (Optional[Literal['fastf1', 'f1timing']]) –

          select a specific backend as data source, options:

          - 'fastf1': FastF1’s own backend, full support for 2018 to now

          - 'f1timing': uses data from the F1 live timing API, sessions
            for which no timing data is available are not listed
            (supports 2018 to now)

          When no backend is specified, 'fastf1' is used as a default
          and f1timing is used as a fallback in case the default is not
          available.

    Return type:

        Event

    Added in version 2.2.

previous

get_event_schedule

next

Plotting Data

Choose version

On this page

- get_testing_event()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
