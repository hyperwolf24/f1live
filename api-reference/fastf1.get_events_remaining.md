- 
- API Reference
- Loading Data
- get_events_remaining

get_events_remaining#

fastf1.get_events_remaining(dt=None, *, include_testing=True, backend=None, force_ergast=False)[source]#

    Create an EventSchedule object for remaining season.

    Parameters:

        - dt (datetime | None) – Optional DateTime to get events after.

        - include_testing (bool) – Include or exclude testing sessions
          from the event schedule.

        - backend (Optional[Literal['fastf1', 'f1timing', 'ergast']]) –

          select a specific backend as data source, options:

          - 'fastf1': FastF1’s own backend, full support for 2018 to now

          - 'f1timing': uses data from the F1 live timing API, sessions
            for which no timing data is available are not listed
            (supports 2018 to now)

          - 'ergast': uses data from Ergast, no local times are
            available, no information about availability of f1 timing
            data is available (supports 1950 to now)

          When no backend is specified, 'fastf1' is used as a default
          and the other backends are used as a fallback in case the
          default is not available.

          For seasons older than 2018 'ergast' is always used.

        - force_ergast (bool) – [Deprecated, use backend='ergast']
          Always use data from the ergast database to create the event
          schedule

    Return type:

        EventSchedule

    Added in version 2.3.

previous

get_event

next

get_event_schedule

Choose version

On this page

- get_events_remaining()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
