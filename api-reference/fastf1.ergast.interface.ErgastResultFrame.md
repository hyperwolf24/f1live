- 
- API Reference
- Jolpica-F1 API Interface
- ErgastResultFrame

ErgastResultFrame#

class fastf1.ergast.interface.ErgastResultFrame(data=None, *, category=None, response=None, auto_cast=True, **kwargs)[source]#

    Bases: BaseDataFrame

    Wraps a Pandas DataFrame. Additionally, this class can be
    initialized from Ergast response data with automatic flattening and
    type casting of the data.

    Parameters:

        - data – Passed through to the DataFrame constructor (must be
          None if response is provided)

        - category (dict | None) – Reference to a category from
          fastf1.ergast.structure that describes the result data

        - response (list | None) – JSON-like response data from Ergast;
          used to generate data from an Ergast response (must be None if
          data is provided)

        - auto_cast (bool) – Determines if values are automatically cast
          to the most appropriate data type from their original string
          representation

previous

ErgastMultiResponse

next

ErgastResponseMixin

Choose version

On this page

- ErgastResultFrame

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
