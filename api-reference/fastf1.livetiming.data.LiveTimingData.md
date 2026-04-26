- 
- API Reference
- Live Timing Client
- LiveTimingData

LiveTimingData#

class fastf1.livetiming.data.LiveTimingData(*files, **kwargs)[source]#

    Bases: object

    Live timing data object for using saved livetiming data as data
    source.

    This object is created from data that was recorded using
    SignalRClient. It can be passed to various api calling functions
    using the livedata keyword.

    Usually you will only instantiate this function and pass it to other
    functions.

    See Live Timing Client for more information.

    If you want to load data from multiple files you can simply pass
    multiple filenames:

        livedata = LiveTimingData('file1.txt', 'file2.txt', 'file3.txt')

    The files need to be in chronological order but may overlap. I.e. if
    the last five minutes of file1 are the same as the first 5 minutes
    of file2 this will be recognized while loading the data. No
    duplicate data will be loaded.

    Parameters:

        *files (str) – One or multiple file names

    Methods:

      ------------------- ----------------------------------------------------------
      load()              Read all files, parse the data and store it by category.
      get(name)           Return data for category name.
      has(name)           Check if data for a category name exists.
      list_categories()   List all available data categories.
      ------------------- ----------------------------------------------------------

    load()[source]#

        Read all files, parse the data and store it by category.

        Should usually not be called manually. This is called
        automatically the first time get(), has() or list_categories()
        are called.

    get(name)[source]#

        Return data for category name.

        Will load data on first call, this will take a bit.

        Parameters:

            name (str) – name of the category

    has(name)[source]#

        Check if data for a category name exists.

        Will load data on first call, this will take a bit.

        Parameters:

            name (str) – name of the category

    list_categories()[source]#

        List all available data categories.

        Will load data on first call, this will take a bit.

        Returns:

            list of category names

previous

messages_from_raw

next

Utils

Choose version

On this page

- LiveTimingData
  - LiveTimingData.load()
  - LiveTimingData.get()
  - LiveTimingData.has()
  - LiveTimingData.list_categories()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
