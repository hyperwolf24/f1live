- 
- API Reference
- Jolpica-F1 API Interface
- ErgastMultiResponse

ErgastMultiResponse#

class fastf1.ergast.interface.ErgastMultiResponse(*args, response_description, response_data, category, subcategory, auto_cast, **kwargs)[source]#

    Bases: ErgastResponseMixin

    Provides complex Ergast result data in the form of multiple Pandas
    DataFrames.

    This class additionally offers response information and paging (see
    ErgastResponseMixin).

    Note: This object is usually not instantiated by the user. Instead,
    you should use one of the API endpoint methods that are provided by
    Ergast get data from the API.

    Example:

        >>> from fastf1.ergast import Ergast
        >>> ergast = Ergast(result_type='pandas', auto_cast=True)
        >>> result = ergast.get_race_results(season=2022)

        # The description shows that the result includes data from two
        # grand prix.
        >>> result.description
           season  round  ... locality       country
        0    2022      1  ...   Sakhir       Bahrain
        1    2022      2  ...   Jeddah  Saudi Arabia

        [2 rows x 13 columns]

        # As expected, ``result.content`` contains two elements, one for each
        # row of the description
        >>> len(result.content)
        2

        # The first element contains all results from the first of the two
        # grand prix.
        >>> result.content[0]
            number  position  ... fastestLapAvgSpeedUnits  fastestLapAvgSpeed
        0       16         1  ...                     kph             206.018
        1       55         2  ...                     kph             203.501
        2       44         3  ...                     kph             202.469
        ...
        17      11        18  ...                     kph             202.762
        18       1        19  ...                     kph             204.140
        19      10        20  ...                     kph             200.189

        [20 rows x 26 columns]

        # The second element is incomplete and only contains the first 10
        # positions of the second Grand Prix. This is because by default,
        # every query on Ergast is limited to 30 result values. You can
        # manually change this limit for each request though.
        >>> result.content[1]
           number  position  ... fastestLapAvgSpeedUnits  fastestLapAvgSpeed
        0       1         1  ...                     kph             242.191
        1      16         2  ...                     kph             242.556
        2      55         3  ...                     kph             241.841
        ...
        7      10         8  ...                     kph             237.796
        8      20         9  ...                     kph             239.562
        9      44        10  ...                     kph             239.001

        [10 rows x 26 columns]

    Parameters:

        - response_description (dict) – Ergast response containing only
          the “descriptive” information (only data that is available in
          description)

        - response_data (list) – A list of the “content” data that has
          been split from the Ergast response (data that is available in
          content)

        - category (dict) – A category object from
          fastf1.ergast.structure that defines the main category.

        - subcategory (dict) – A category object from
          fastf1.ergast.structure that defines the subcategory which is
          the content data.

        - auto_cast (bool) – Flag that enables or disables automatic
          casting from the original string representation to the most
          suitable data type.

    Attributes:

      ------------- ------------------------------------------------------------------
      description   An ErgastResultFrame that describes the data in content.
      content       A list of ErgastResultFrame that contain the main response data.
      ------------- ------------------------------------------------------------------

    property description: ErgastResultFrame#

        An ErgastResultFrame that describes the data in content.

        Each row of this ErgastResultFrame contains the descriptive
        information for one element in content.

    property content: list[ErgastResultFrame]#

        A list of ErgastResultFrame that contain the main response data.

        Descriptive data for each ErgastResultFrame is given in the
        corresponding row of description.

previous

ErgastSimpleResponse

next

ErgastResultFrame

Choose version

On this page

- ErgastMultiResponse
  - ErgastMultiResponse.description
  - ErgastMultiResponse.content

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
