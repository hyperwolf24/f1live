- 
- API Reference
- Live Timing Client
- SignalRClient

SignalRClient#

class fastf1.livetiming.client.SignalRClient(filename, filemode='w', debug=False, timeout=60, logger=None, no_auth=False)[source]#

    Bases: object

    A client for receiving and saving F1 timing data which is streamed
    live over the SignalR protocol.

    During an F1 session, timing data and telemetry data are streamed
    live using the SignalR protocol. This class can be used to connect
    to the stream and save the received data into a file.

    The data will be saved in a raw text format without any
    postprocessing. It is not possible to use this data during a
    session. Instead, the data can be processed after the session by
    calling fastf1.core.Session.load() and providing a LiveTimingData
    object.

    Parameters:

        - filename (str) – filename (opt. with path) for the output file

        - filemode (str) – one of ‘w’ or ‘a’; append to or overwrite
          file content it the file already exists. Append-mode may be
          useful if the client is restarted during a session.

        - debug (bool) – When set to true, the complete SignalR message
          is saved. By default, only the actual data from a message is
          saved.

        - timeout (int) – Number of seconds after which the client will
          automatically exit when no message data is received. Set to
          zero to disable.

        - logger (Optional) – By default, errors are logged to the
          console. If you wish to customize logging, you can pass an
          instance of logging.Logger (see: logging).

        - no_auth (bool) – If set to true, the client will attempt to
          connect without authentication. This may only work for some
          sessions or may only return empty or partial data.

    Methods:

      --------- ------------------------------------------------------------------
      start()   Connect to the data stream and start writing the data to a file.
      --------- ------------------------------------------------------------------

    start()[source]#

        Connect to the data stream and start writing the data to a file.

previous

Live Timing Client

next

messages_from_raw

Choose version

On this page

- SignalRClient
  - SignalRClient.start()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
