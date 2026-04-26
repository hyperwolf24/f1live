- 
- API Reference
- Rate Limits and Caching

Rate Limits and Caching#

All HTTP requests that are performed by FastF1 go through its caching
and rate limiting system.

Caching is enabled by default in FastF1 and most of the time, you do not
need to worry about caching at all. It will simply happen automatically
in the background and speed up your programs. Disabling the cache is
highly discouraged and will generally slow down your programs.

Rate limits are applied at all times. Requests that can be served from
the cache do not count towards any rate limits. Having the cache enabled
can therefore virtually increase the rate limits.

When rate limits are exceeded, FastF1 will either…

- throttle the rate of requests, if small delays are sufficient to stay
  within the limit (soft rate limit)

- raise a fastf1.exceptions.RateLimitExceededError (hard rate limit)

Rate Limits#

ToDo explain rate limits

Cache Configuration#

class fastf1.Cache[source]#

    Pickle and requests based API cache.

    Fast-F1 will per default enable caching. While this can be disabled,
    it should almost always be left enabled to speed up the runtime of
    your scripts and to prevent exceeding the rate limit of api servers.

    The default cache directory is defined, in order of precedence, in
    one of the following ways:

    1.  A call to enable_cache()

    2.  The value of the environment variable FASTF1_CACHE

    3.  An OS dependent default cache directory

    See below for more information on default cache directories.

    The following class-level functions are used to set up, enable and
    (temporarily) disable caching.

      ------------------------------------------------ ---------------------------------------------------------------------------------------------------------
      enable_cache(cache_dir[, ignore_version, ...])   Enables the API cache.
      clear_cache([cache_dir, deep])                   Clear all cached data.
      get_cache_info()                                 Returns information about the cache directory and its size.
      disabled()                                       Returns a context manager object that creates a context within which the cache is temporarily disabled.
      set_disabled()                                   Disable the cache while keeping the configuration intact.
      set_enabled()                                    Enable the cache after it has been disabled with set_disabled().
      offline_mode(enabled)                            Enable or disable offline mode.
      ------------------------------------------------ ---------------------------------------------------------------------------------------------------------

    The parsed API data will be saved as a pickled object. Raw GET and
    POST requests are cached in a sqlite db using the ‘requests-cache’
    module.

    Requests that can be served from the cache do not count towards any
    API rate limits.

    The cache has two “stages”:

    - Stage 1: Caching of raw GET requests. This works for all requests.
      Cache control is employed to refresh the cached data periodically.

    - Stage 2: Caching of the parsed data. This saves a lot of time when
      running your scripts, as parsing of the data is computationally
      expensive. Stage 2 caching is only used for some api functions.

    You can explicitly configure right at the beginning of your script:

        >>> import fastf1
        >>> fastf1.Cache.enable_cache('path/to/cache')
        # change cache directory to an existing empty directory on your machine
        >>> session = fastf1.get_session(2021, 5, 'Q')
        >>> # ...

    When doing this, enable_cache() must be called right after your
    imports and before any other FastF1 related functionality is called
    to ensure that the cache is configured correctly.

    An alternative way to set the cache directory is to configure an
    environment variable FASTF1_CACHE. However, this value will be
    ignored if Cache.enable_cache() is called.

    If no explicit location is provided, Fast-F1 will use a default
    location depending on operating system.

    - Windows: %LOCALAPPDATA%\Temp\fastf1

    - macOS: ~/Library/Caches/fastf1

    - Linux: ~/.cache/fastf1 if ~/.cache exists otherwise ~/.fastf1

    Cached data can be deleted at any time to reclaim disk space.
    However, this also means you will have to redownload the same data
    again if you need which will lead to reduced performance.

    Methods:

      ------------------------------------------------ ---------------------------------------------------------------------------------------------------------
      enable_cache(cache_dir[, ignore_version, ...])   Enables the API cache.
      requests_get(url, **kwargs)                      Wraps requests.Session().get() with caching if enabled.
      requests_post(url, **kwargs)                     Wraps requests.Session().post() with caching if enabled.
      delete_response(url)                             Deletes a single cached response from the cache, if caching is enabled.
      clear_cache([cache_dir, deep])                   Clear all cached data.
      api_request_wrapper(func)                        Wrapper function for adding stage 2 caching to api functions.
      disabled()                                       Returns a context manager object that creates a context within which the cache is temporarily disabled.
      set_disabled()                                   Disable the cache while keeping the configuration intact.
      set_enabled()                                    Enable the cache after it has been disabled with set_disabled().
      offline_mode(enabled)                            Enable or disable offline mode.
      ci_mode(enabled)                                 Enable or disable CI mode.
      get_cache_info()                                 Returns information about the cache directory and its size.
      ------------------------------------------------ ---------------------------------------------------------------------------------------------------------

    classmethod enable_cache(cache_dir, ignore_version=False, force_renew=False, use_requests_cache=True)[source]#

        Enables the API cache.

        Parameters:

            - cache_dir (str) – Path to the directory which should be
              used to store cached data. Path needs to exist.

            - ignore_version (bool) – Ignore if cached data was created
              with a different version of the API parser (not
              recommended: this can cause crashes or unrecognized errors
              as incompatible data may be loaded)

            - force_renew (bool) – Ignore existing cached data. Download
              data and update the cache instead.

            - use_requests_cache (bool) – Do caching of the raw GET and
              POST requests.

    classmethod requests_get(url, **kwargs)[source]#

        Wraps requests.Session().get() with caching if enabled.

        All GET requests that require caching should be performed
        through this wrapper. Caching will be done if the module-wide
        cache has been enabled. Else, requests.Session().get() will be
        called without any caching.

    classmethod requests_post(url, **kwargs)[source]#

        Wraps requests.Session().post() with caching if enabled.

        All POST requests that require caching should be performed
        through this wrapper. Caching will be done if the module-wide
        cache has been enabled. Else, requests.Session().get() will be
        called without any caching.

    classmethod delete_response(url)[source]#

        Deletes a single cached response from the cache, if caching is
        enabled. If caching is not enabled, this call is ignored.

    classmethod clear_cache(cache_dir=None, deep=False)[source]#

        Clear all cached data.

        Deletes all files in the cache directory. By default, it will
        clear the default cache directory. However, if a cache directory
        is provided as an argument this will be cleared instead.
        Optionally, the requests cache can be cleared too.

        Can be called without enabling the cache first.

        Deleting specific events or sessions is not supported but can be
        done manually (stage 2 cache). The cached data is structured by
        year, event and session. The structure is more or less
        self-explanatory. To delete specific events or sessions delete
        the corresponding folder within the cache directory. Deleting
        specific requests from the requests cache (stage 1) is not
        possible. To delete the requests cache only, delete the sqlite
        file in the root of the cache directory.

        Parameters:

            - cache_dir (str) – Path to the directory which is used to
              store cached data.

            - deep (bool) – Clear the requests cache (stage 1) too.

    classmethod api_request_wrapper(func)[source]#

        Wrapper function for adding stage 2 caching to api functions.

        Parameters:

            func – function to be wrapped

        Returns:

            The wrapped function

    classmethod disabled()[source]#

        Returns a context manager object that creates a context within
        which the cache is temporarily disabled.

        Example:

            with Cache.disabled():
                # no caching takes place here
                ...

        Note

        The context manager is not multithreading-safe

    classmethod set_disabled()[source]#

        Disable the cache while keeping the configuration intact.

        This disables stage 1 and stage 2 caching!

        You can enable the cache at any time using set_enabled()

        Note

        You may prefer to use disabled() to get a context manager object
        and disable the cache only within a specific context.

        Note

        This function is not multithreading-safe

    classmethod set_enabled()[source]#

        Enable the cache after it has been disabled with set_disabled().

        Warning

        To enable the cache it needs to be configured properly. You need
        to call :func`enable_cache` once to enable the cache initially.
        set_enabled() and set_disabled() only serve to (temporarily)
        disable the cache for specific parts of code that should be run
        without caching.

        Note

        This function is not multithreading-safe

    classmethod offline_mode(enabled)[source]#

        Enable or disable offline mode.

        In this mode, no actual requests will be sent and only cached
        data is returned. This can be useful for freezing the state of
        the cache or working with an unstable internet connection.

        Note

        This function must be called after enable_cache() when using a
        custom cache directory.

        Parameters:

            enabled (bool) – sets the state of offline mode to ‘enabled’
            (True) or ‘disabled’ (False)

    classmethod ci_mode(enabled)[source]#

        Enable or disable CI mode.

        In this mode, cached requests will be reused even if they are
        expired. Only uncached data will actually be requested and is
        then cached. This means, as long as CI mode is enabled, every
        request is only ever made once and reused indefinitely.

        This serves two purposes. First, reduce the number of requests
        that is sent on when a large number of tests is run in parallel,
        potentially in multiple environments simultaneously. Second,
        make test runs more predictable because data usually does not
        change between runs.

        Additionally, the pickle cache (stage 2) is disabled completely,
        so no parsed data is cached. This means that the API parser code
        is always executed and not skipped due to caching.

        Note

        This function must be called after enable_cache() when using a
        custom cache directory.

    classmethod get_cache_info()[source]#

        Returns information about the cache directory and its size.

        If the cache is not configured, None will be returned for both
        the cache path and the cache size.

        Return type:

            tuple[str | None, int | None]

        Returns:

            A tuple of (path, size) if the cache is configured, else
            (None, None). The cache size is given in bytes.

previous

F1TV Account Authentication

next

Exceptions

Choose version

On this page

- Rate Limits
- Cache Configuration
  - Cache
    - Cache.enable_cache()
    - Cache.requests_get()
    - Cache.requests_post()
    - Cache.delete_response()
    - Cache.clear_cache()
    - Cache.api_request_wrapper()
    - Cache.disabled()
    - Cache.set_disabled()
    - Cache.set_enabled()
    - Cache.offline_mode()
    - Cache.ci_mode()
    - Cache.get_cache_info()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
