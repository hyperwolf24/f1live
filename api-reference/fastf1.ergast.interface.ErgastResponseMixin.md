- 
- API Reference
- Jolpica-F1 API Interface
- ErgastResponseMixin

ErgastResponseMixin#

class fastf1.ergast.interface.ErgastResponseMixin(*args, response_headers, query_filters, metadata, selectors, **kwargs)[source]#

    Bases: object

    A Mixin class that adds support for pagination to Ergast response
    objects.

    All Ergast response objects provide the methods that are implemented
    by this Mixin.

    Attributes:

      --------------- ------------------------------------------------------------------------------------------------------
      total_results   Returns the total number of available results for the request associated with this response.
      is_complete     Indicates if the response contains all available results for the request that is associated with it.
      --------------- ------------------------------------------------------------------------------------------------------

    Methods:

      ------------------------ --------------------------------------------------------------------------------------------------------------------------------
      get_next_result_page()   Returns the next page of results within the limit that was specified in the request that is associated with this response.
      get_prev_result_page()   Returns the previous page of results within the limit that was specified in the request that is associated with this response.
      ------------------------ --------------------------------------------------------------------------------------------------------------------------------

    property total_results: int#

        Returns the total number of available results for the request
        associated with this response.

    property is_complete: bool#

        Indicates if the response contains all available results for the
        request that is associated with it.

    get_next_result_page()[source]#

        Returns the next page of results within the limit that was
        specified in the request that is associated with this response.

        Raises:

            ValueError – there is no result page after the current page

        Return type:

            Union[ErgastSimpleResponse, ErgastMultiResponse,
            ErgastRawResponse]

    get_prev_result_page()[source]#

        Returns the previous page of results within the limit that was
        specified in the request that is associated with this response.

        Raises:

            ValueError – there is no result page before the current page

        Return type:

            Union[ErgastSimpleResponse, ErgastMultiResponse,
            ErgastRawResponse]

previous

ErgastResultFrame

next

Ergast API Interface

Choose version

On this page

- ErgastResponseMixin
  - ErgastResponseMixin.total_results
  - ErgastResponseMixin.is_complete
  - ErgastResponseMixin.get_next_result_page()
  - ErgastResponseMixin.get_prev_result_page()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
