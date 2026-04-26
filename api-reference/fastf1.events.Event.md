- 
- API Reference
- Event Schedule
- Event

Event#

class fastf1.events.Event(*args, year=None, **kwargs)[source]#

    Bases: BaseSeries

    This class represents a single event (race weekend or testing
    event).

    Each event consists of one or multiple sessions, depending on the
    type of event and depending on the event format.

    For detailed information about the information that is available for
    each event, see Event Schedule Data.

    This class is usually not instantiated directly. You should use
    fastf1.get_event() or similar to get a specific event.

    Parameters:

        year (int) – Championship year

    Methods:

      ------------------------------------- ---------------------------------------------------------------------------------------------------
      is_testing()                          Return True or False, depending on whether this event is a testing event.
      get_session_name(identifier)          Return the full session name of a specific session from this event.
      get_session_date(identifier[, utc])   Return the date and time (if available) at which a specific session of this event is or was held.
      get_session(identifier)               Return a session from this event.
      get_race()                            Return the race session.
      get_qualifying()                      Return the qualifying session.
      get_sprint()                          Return the sprint session.
      get_sprint_shootout()                 Return the sprint shootout session.
      get_sprint_qualifying()               Return the sprint qualifying session.
      get_practice(number)                  Return the specified practice session.
      ------------------------------------- ---------------------------------------------------------------------------------------------------

    is_testing()[source]#

        Return True or False, depending on whether this event is a
        testing event.

        Return type:

            bool

    get_session_name(identifier)[source]#

        Return the full session name of a specific session from this
        event.

        Examples

            >>> import fastf1
            >>> event = fastf1.get_event(2021, 1)
            >>> event.get_session_name(3)
            'Practice 3'
            >>> event.get_session_name('Q')
            'Qualifying'
            >>> event.get_session_name('praCtice 1')
            'Practice 1'

        Parameters:

            identifier – session name, abbreviation or number, see
            Session identifiers

        Raises:

            ValueError – No matching session or invalid identifier

        Return type:

            str

    get_session_date(identifier, utc=False)[source]#

        Return the date and time (if available) at which a specific
        session of this event is or was held.

        Parameters:

            - identifier (str | int) – session name, abbreviation or
              number, see Session identifiers

            - utc – return a non-timezone-aware UTC timestamp

        Raises:

            ValueError – No matching session or invalid identifier

        Return type:

            Timestamp

    get_session(identifier)[source]#

        Return a session from this event.

        Parameters:

            identifier (int | str) – session name, abbreviation or
            number, see Session identifiers

        Raises:

            ValueError – No matching session or invalid identifier

        Return type:

            Session

    get_race()[source]#

        Return the race session.

        Return type:

            Session

    get_qualifying()[source]#

        Return the qualifying session.

        Return type:

            Session

    get_sprint()[source]#

        Return the sprint session.

        Return type:

            Session

    get_sprint_shootout()[source]#

        Return the sprint shootout session.

        Return type:

            Session

    get_sprint_qualifying()[source]#

        Return the sprint qualifying session.

        Return type:

            Session

    get_practice(number)[source]#

        Return the specified practice session. :type number: int :param
        number: 1, 2 or 3 - Free practice session number

        Return type:

            Session

previous

EventSchedule

next

Session

Choose version

On this page

- Event
  - Event.is_testing()
  - Event.get_session_name()
  - Event.get_session_date()
  - Event.get_session()
  - Event.get_race()
  - Event.get_qualifying()
  - Event.get_sprint()
  - Event.get_sprint_shootout()
  - Event.get_sprint_qualifying()
  - Event.get_practice()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
