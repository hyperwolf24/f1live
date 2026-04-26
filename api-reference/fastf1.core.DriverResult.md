- 
- API Reference
- Results Data
- DriverResult

DriverResult#

class fastf1.core.DriverResult(*args, **kwargs)[source]#

    Bases: BaseSeries

    This class provides driver and result information for a single
    driver.

    This class subclasses a pandas.Series and the usual methods provided
    by pandas can be used to work with the data.

    For information on which data is available, see SessionResults.

    Note

    This class is usually not instantiated directly. You should create a
    session and access the driver result through Session.get_driver() or
    by slicing the session result.

    Parameters:

        - *args – passed through to pandas.Series superclass

        - **kwargs – passed through to pandas.Series superclass

    Added in version 2.2.

    Attributes:

      ----- -------------------------------
      dnf   True if driver did not finish
      ----- -------------------------------

    property dnf: bool#

        True if driver did not finish

previous

SessionResults

next

Circuit Information

Choose version

On this page

- DriverResult
  - DriverResult.dnf

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
