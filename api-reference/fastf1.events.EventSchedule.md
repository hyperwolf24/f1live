- 
- API Reference
- Event Schedule
- EventSchedule

EventSchedule#

class fastf1.events.EventSchedule(*args, year=0, **kwargs)[source]#

    Bases: BaseDataFrame

    This class implements a per-season event schedule.

    For detailed information about the information that is available for
    each event, see Event Schedule Data.

    This class is usually not instantiated directly. You should use
    fastf1.get_event_schedule() to get an event schedule for a specific
    season.

    Parameters:

        - *args – passed on to pandas.DataFrame superclass

        - year (int) – Championship year

        - **kwargs – passed on to pandas.DataFrame superclass (except
          ‘columns’ which is unsupported for the event schedule)

    Added in version 2.2.

    Methods:

      -------------------------------------------------- ---------------------------------------------------------------------------
      is_testing()                                       Return True or False, depending on whether each event is a testing event.
      get_event_by_round(round)                          Get an Event by its round number.
      get_event_by_name(name, *[, strict_search, ...])   Get an Event by its name.
      -------------------------------------------------- ---------------------------------------------------------------------------

    is_testing()[source]#

        Return True or False, depending on whether each event is a
        testing event.

    get_event_by_round(round)[source]#

        Get an Event by its round number.

        Parameters:

            round (int) – The round number

        Raises:

            ValueError – The round does not exist in the event schedule

        Return type:

            Event

    get_event_by_name(name, *, strict_search=False, exact_match=False)[source]#

        Get an Event by its name.

        A fuzzy match is performed to find the event that best matches
        the given name. Fuzzy matching is performed using the country,
        location, name and officialName of each event. This is not
        guaranteed to return the correct result. You should therefore
        always check if the function actually returns the event you had
        wanted. To guarantee the function returns the event queried,
        toggle strict_search, which will only return an event if its
        event name matches (non case sensitive) the query string.

        Warning

        You should avoid adding common words to name to avoid false
        string matches. For example, you should rather use “Belgium”
        instead of “Belgian Grand Prix” as name.

        Parameters:

            - name (str) – The name of the event. For example,
              .get_event_by_name("british") and
              .get_event_by_name("silverstone") will both return the
              event for the British Grand Prix.

            - strict_search (bool) – This argument is deprecated and
              planned for removal. Use the equivalent exact_match
              instead

            - exact_match (bool) – Search only for exact query matches
              instead of using fuzzy search. For example,
              .get_event_by_name("British Grand Prix", exact_match=True)
              will return the event for the British Grand Prix, whereas
              .get_event_by_name("British", exact_match=True) will
              return None

        Return type:

            Event

previous

Event Schedule

next

Event

Choose version

On this page

- EventSchedule
  - EventSchedule.is_testing()
  - EventSchedule.get_event_by_round()
  - EventSchedule.get_event_by_name()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
