- 
- API Reference
- Jolpica-F1 API Interface
- ErgastRawResponse

ErgastRawResponse#

class fastf1.ergast.interface.ErgastRawResponse(*, query_result, category, auto_cast, **kwargs)[source]#

    Bases: ErgastResponseMixin, list

    Provides the raw JSON-like response data from Ergast.

    This class wraps a list and adds response information and paging
    (see ErgastResponseMixin).

    This “raw” response does not actually contain the complete JSON
    response that the API provides. Instead, only the actual data part
    of the response is returned while metadata (version, query
    parameters, response length, …) are not included. But metadata is
    used internally to provide pagination and information that are
    implemented by the ErgastResponseMixin.

    Parameters:

        - category – Reference to a category from
          fastf1.ergast.structure that describes the result data

        - auto_cast – Determines if values are automatically cast to the
          most appropriate data type from their original string
          representation

previous

Ergast

next

ErgastSimpleResponse

Choose version

On this page

- ErgastRawResponse

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
