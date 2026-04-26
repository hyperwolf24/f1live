- 
- API Reference
- Exceptions

Exceptions#

Generic Exceptions#

class fastf1.exceptions.FastF1CriticalError[source]#

    Bases: RuntimeError

    Base class for unrecoverable exceptions that occur during internal
    data processing. These exceptions are always raised to the user and
    data processing is terminated.

class fastf1.exceptions.RateLimitExceededError[source]#

    Bases: FastF1CriticalError

    Raised if a hard rate limit is exceeded for any API.

Data Loading Exceptions#

class fastf1.exceptions.DataNotLoadedError[source]#

    Bases: Exception

    Raised if an attempt is made to access data that has not been loaded
    yet.

class fastf1.exceptions.InvalidSessionError(*args)[source]#

    Bases: Exception

    Raised if no session for the specified event name, type, and year
    can be found.

class fastf1.exceptions.NoLapDataError(*args)[source]#

    Bases: Exception

    Raised if the API request does not fail, but there is no usable data
    after processing the result.

Jolpica-F1 (Ergast) Specific Exceptions#

class fastf1.exceptions.ErgastError[source]#

    Bases: Exception

    Base class for Ergast API errors.

class fastf1.exceptions.ErgastJsonError[source]#

    Bases: ErgastError

    The response returned by the server could not be parsed.

class fastf1.exceptions.ErgastInvalidRequestError[source]#

    Bases: ErgastError

    The server rejected the request because it was invalid.

Legacy Exceptions (deprecated)#

class fastf1._api.SessionNotAvailableError(*args)[source]#

    Raised if an api request returned no data for the requested session.
    A likely cause is that the session does not exist because it was
    cancelled.

    Warning

    This exception is provided by the fastf1.api submodule. It will be
    considered private in future releases and potentially be removed or
    changed.

previous

Rate Limits and Caching

next

Logging

Choose version

On this page

- Generic Exceptions
  - FastF1CriticalError
  - RateLimitExceededError
- Data Loading Exceptions
  - DataNotLoadedError
  - InvalidSessionError
  - NoLapDataError
- Jolpica-F1 (Ergast) Specific Exceptions
  - ErgastError
  - ErgastJsonError
  - ErgastInvalidRequestError
- Legacy Exceptions (deprecated)
  - SessionNotAvailableError

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
