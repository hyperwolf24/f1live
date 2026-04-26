- 
- API Reference
- Loading Data
- get_session

get_session#

fastf1.get_session(year, gp, identifier=None, *, backend=None, force_ergast=False)[source]#

    Create a Session object based on year, event name and session
    identifier.

    Note

    This function will return a Session object, but it will not load any
    session specific data like lap timing, telemetry, … yet. For this,
    you will need to call load() on the returned object.

    To get a testing session, use get_testing_session().

    Examples

    Get the second free practice of the first race of 2021 by its
    session name abbreviation:

        >>> get_session(2021, 1, 'FP2')

    Get the qualifying of the 2020 Austrian Grand Prix by full session
    name:

        >>> get_session(2020, 'Austria', 'Qualifying')

    Get the 3rd session of the 5th Grand Prix in 2021:

        >>> get_session(2021, 5, 3)

    Parameters:

        - year (int) – Championship year

        - gp (str | int) –

          Name as str or round number as int. If gp is a string, a fuzzy
          match will be performed on all events and the closest match
          will be selected. Fuzzy matching uses country, location, name
          and officialName of each event as reference.

          Some examples that will be correctly interpreted: ‘bahrain’,
          ‘australia’, ‘abudabi’, ‘monza’.

        - identifier (int | str | None) – session name, abbreviation or
          number, see Session identifiers

        - backend (Optional[Literal['fastf1', 'f1timing', 'ergast']]) –

          select a specific backend as data source, options: - 'fastf1':
          FastF1’s own backend, full support for 2018 to now

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

        Session

previous

Loading Data

next

get_testing_session

Choose version

On this page

- get_session()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
