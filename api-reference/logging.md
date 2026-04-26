- 
- API Reference
- Logging

Logging#

Configure Logging Verbosity#

All parts of FastF1 generally log at the log level ‘INFO’. The reason
for this is that many data loading processes take multiple seconds to
complete. Logging is used to give progress information here as well as
for showing warnings and non-terminal errors.

The logging level for FastF1 can be easily customized:

    import fastf1

    fastf1.set_log_level('WARNING')

    # ... your code  here ... #

The available levels are (in order of increasing severity): DEBUG, INFO,
WARNING, ERROR and CRITICAL.

fastf1.set_log_level(level)[source]#

    Set the log level for all parts of FastF1.

    When setting the log level for FastF1, only messages with this level
    or with a higher level will be shown.

    Parameters:

        level (str | int) – Either a log level from the logging module
        (e.g. logging.INFO) or the level as a string (e.g. ‘WARNING’).

Advanced Logging API#

This section is usually only relevant for developers and contains
information that is useful for debugging and for implementing logging in
FastF1 internal code.

FastF1 uses loggers for each submodule. All loggers are child loggers of
FastF1’s base logger. The log level is usually configured equally for
all parts of FastF1. The LoggingManager or the direct access functions
should commonly be used for this.

Note to developers: some parts of FastF1’s data loading are wrapped in
generic catch-all error handling to prevent errors in individual data
loading tasks to make FastF1 completely unusable. Instead, unhandled
exceptions will be caught, short error message is logged in level INFO,
the full traceback is logged on level DEBUG and execution will continue
as good as possible. This system can make debugging more difficult
because errors are not raised. To circumvent this, there are two
possible ways to disable the catch-all error handling for data loading:

- explicitly set fastf1.logger.LoggingManager.debug to True

- set the environment variable FASTF1_DEBUG=1

Logging Manager#

class fastf1.logger.LoggingManager[source]#

    Interface for configuring logging in FastF1.

    All parts of FastF1 generally log at the log level ‘INFO’. The
    reason for this is that many data loading processes take multiple
    seconds to complete. Logging is used to give progress information as
    well as for showing warnings and non-terminal errors.

    All submodule loggers in FastF1 are child loggers of the base
    logger. This class acts as an interface to set the log level for
    FastF1 and get child loggers.

    debug = False#

        Flag for enabling debug mode. This will disable catch-all error
        handling for data loading methods.

    classmethod get_child(name)[source]#

        Return a logger with the given name that is child of the base
        logger.

        Parameters:

            name (str) – name of the child logger

    classmethod set_level(level)[source]#

        Set the log level for FastF1.

        Parameters:

            level (int) – log level, for example logging.INFO

Functions for direct access#

logger.set_log_level()#

    Set the log level for all parts of FastF1.

    When setting the log level for FastF1, only messages with this level
    or with a higher level will be shown.

    Parameters:

        level (str | int) – Either a log level from the logging module
        (e.g. logging.INFO) or the level as a string (e.g. ‘WARNING’).

logger.get_logger()#

    Return a logger with the given name that is a child of FastF1’s base
    logger.

logger.soft_exceptions(msg, logger)#

    Wrapper method for wrapping any function into catch-all error
    handling that can be disabled by setting debug to True.

    Parameters:

        - descr_name (str) – descriptive name for the type of data that
          should have been loaded by the wrapped function

        - msg (str) – Short message that is shown as error message to
          users

        - logger (Logger) – the logger that should be used to log errors
          (a logger instance as returned by get_logger(), for example).

previous

Exceptions

next

Live Timing Client

Choose version

On this page

- Configure Logging Verbosity
  - set_log_level()
- Advanced Logging API
  - Logging Manager
    - LoggingManager
      - LoggingManager.debug
      - LoggingManager.get_child()
      - LoggingManager.set_level()
  - Functions for direct access
    - logger.set_log_level()
    - logger.get_logger()
    - logger.soft_exceptions()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
