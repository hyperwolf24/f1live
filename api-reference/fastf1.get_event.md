- 
- API Reference
- Loading Data
- get_event

get_event#

fastf1.get_event(year, gp, *, backend=None, force_ergast=False, strict_search=False, exact_match=False)[source]#

    Create an Event object for a specific season and gp.

    To get a testing event, use get_testing_event().

    Parameters:

        - year (int) – Championship year

        - gp (int | str) – Name as str or round number as int. If gp is
          a string, a fuzzy match will be performed on all events and
          the closest match will be selected. Fuzzy matching uses
          country, location, name and officialName of each event as
          reference. Note that the round number cannot be used to get a
          testing event, as all testing event are round 0!

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

        - strict_search (bool) – This argument is deprecated and planned
          for removal, use the equivalent exact_match instead

        - exact_match (bool) – Match precisely the query, or default to
          fuzzy search. If no event is found with exact_match=True, the
          function will return None

    Return type:

        Event

    Added in version 2.2.

previous

get_testing_session

next

get_events_remaining

Choose version

On this page

- get_event()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
