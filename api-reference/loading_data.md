- 
- API Reference
- Loading Data

Loading Data#

Accessing Events and Sessions#

When using FastF1, you usually start by loading an event or a session.
This can be done with one of the following functions.

  --------------------------------------------------- ---------------------------------------------------------------------------------------------------
  get_session(year, gp[, identifier, backend, ...])   Create a Session object based on year, event name and session identifier.
  get_testing_session(year, test_number, ...)         Create a Session object for testing sessions based on year, test event number and session number.
  get_event(year, gp, *[, backend, ...])              Create an Event object for a specific season and gp.
  get_events_remaining([dt, include_testing, ...])    Create an EventSchedule object for remaining season.
  get_event_schedule(year, *[, ...])                  Create an EventSchedule object for a specific season.
  get_testing_event(year, test_number, *[, ...])      Create a fastf1.events.Event object for testing sessions based on year and test event number.
  --------------------------------------------------- ---------------------------------------------------------------------------------------------------

previous

API Reference

next

get_session

Choose version

On this page

- Accessing Events and Sessions

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
