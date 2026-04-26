- 
- API Reference
- Jolpica-F1 API Interface
- Ergast

Ergast#

class fastf1.ergast.Ergast(result_type='pandas', auto_cast=True, limit=None)[source]#

    Bases: object

    The main object that acts as an interface to the Ergast API.

    For each API endpoint, there is a separate method implemented to
    request data.

    Parameters:

        - result_type (Literal['raw', 'pandas']) –

          Determines the default type of the returned result object

          - ’raw’: ErgastRawResponse

          - ’pandas’: ErgastSimpleResponse or ErgastMultiResponse
            depending on endpoint

        - auto_cast (bool) – Determines whether result values are cast
          from there default string representation to a better matching
          type

        - limit (int | None) – The maximum number of results returned by
          the API. Defaults to 30 if not set. Maximum: 1000. See also
          “Response Paging” on https://ergast.com/mrd/.

    Methods:

      --------------------------------------------------- -----------------------------------------------------------------
      get_seasons([circuit, constructor, driver, ...])    Get a list of seasons.
      get_race_schedule(season[, round, circuit, ...])    Get a list of races.
      get_driver_info([season, round, circuit, ...])      Get a list of drivers.
      get_constructor_info([season, round, ...])          Get a list of constructors.
      get_circuits([season, round, constructor, ...])     Get a list of circuits.
      get_finishing_status([season, round, ...])          Get a list of finishing status codes.
      get_race_results([season, round, circuit, ...])     Get race results for one or multiple races.
      get_qualifying_results([season, round, ...])        Get qualifying results for one or multiple qualifying sessions.
      get_sprint_results([season, round, circuit, ...])   Get sprint results for one or multiple sprints.
      get_driver_standings([season, round, ...])          Get driver standings at specific points of a season.
      get_constructor_standings([season, round, ...])     Get constructor standings at specific points of a season.
      get_lap_times(season, round[, lap_number, ...])     Get sprint results for one or multiple sprints.
      get_pit_stops(season, round[, stop_number, ...])    Get pit stop information for one or multiple sessions.
      --------------------------------------------------- -----------------------------------------------------------------

    get_seasons(circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get a list of seasons.

        See: https://ergast.com/mrd/methods/seasons/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    url: seasonUrl <str>
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic typecasting:

            season       <int>
            seasonUrl    <str>

        Parameters:

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastSimpleResponse | ErgastRawResponse

        Returns:

            ErgastSimpleResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_race_schedule(season, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get a list of races.

        See: https://ergast.com/mrd/methods/schedule/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    url: raceUrl <str>,
                    raceName: raceName <str>,
                    date: raceDate <datetime.datetime | None>,
                    time: raceTime <datetime.time | None>,
                    Circuit: {
                        circuitId: circuitId <str>,
                        url: circuitUrl <str>,
                        circuitName: circuitName <str>,
                        Location: {
                            lat: lat <float>,
                            long: long <float>,
                            locality: locality <str>,
                            country: country <str>
                        }
                    },
                    FirstPractice: {
                        date: fp1Date <datetime.datetime | None>,
                        time: fp1Time <datetime.time | None>
                    },
                    SecondPractice: {
                        date: fp2Date <datetime.datetime | None>,
                        time: fp2Time <datetime.time | None>
                    },
                    ThirdPractice: {
                        date: fp3Date <datetime.datetime | None>,
                        time: fp3Time <datetime.time | None>
                    },
                    Qualifying: {
                        date: qualifyingDate <datetime.datetime | None>,
                        time: qualifyingTime <datetime.time | None>
                    },
                    Sprint: {
                        date: sprintDate <datetime.datetime | None>,
                        time: sprintTime <datetime.time | None>
                    }
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic typecasting:

            season                                 <int>
            round                                  <int>
            raceUrl                                <str>
            raceName                               <str>
            raceDate          <datetime.datetime | None>
            raceTime              <datetime.time | None>
            circuitId                              <str>
            circuitUrl                             <str>
            circuitName                            <str>
            lat                                  <float>
            long                                 <float>
            locality                               <str>
            country                                <str>
            fp1Date           <datetime.datetime | None>
            fp1Time               <datetime.time | None>
            fp2Date           <datetime.datetime | None>
            fp2Time               <datetime.time | None>
            fp3Date           <datetime.datetime | None>
            fp3Time               <datetime.time | None>
            qualifyingDate    <datetime.datetime | None>
            qualifyingTime        <datetime.time | None>
            sprintDate        <datetime.datetime | None>
            sprintTime            <datetime.time | None>

        Parameters:

            - season (Union[Literal['current'], int]) – select a season
              by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastSimpleResponse | ErgastRawResponse

        Returns:

            ErgastSimpleResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_driver_info(season=None, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get a list of drivers.

        See: https://ergast.com/mrd/methods/drivers/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    driverId: driverId <str>,
                    permanentNumber: driverNumber <int>,
                    code: driverCode <str>,
                    url: driverUrl <str>,
                    givenName: givenName <str>,
                    familyName: familyName <str>,
                    dateOfBirth: dateOfBirth <datetime.datetime | None>,
                    nationality: driverNationality <str>
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic typecasting:

            driverId                                  <str>
            driverNumber                              <int>
            driverCode                                <str>
            driverUrl                                 <str>
            givenName                                 <str>
            familyName                                <str>
            dateOfBirth          <datetime.datetime | None>
            driverNationality                         <str>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastSimpleResponse | ErgastRawResponse

        Returns:

            ErgastSimpleResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_constructor_info(season=None, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get a list of constructors.

        See: https://ergast.com/mrd/methods/constructors/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    constructorId: constructorId <str>,
                    url: constructorUrl <str>,
                    name: constructorName <str>,
                    nationality: constructorNationality <str>
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic typecasting:

            constructorId             <str>
            constructorUrl            <str>
            constructorName           <str>
            constructorNationality    <str>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastSimpleResponse | ErgastRawResponse

        Returns:

            ErgastSimpleResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_circuits(season=None, round=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get a list of circuits.

        See: https://ergast.com/mrd/methods/circuits/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    circuitId: circuitId <str>,
                    url: circuitUrl <str>,
                    circuitName: circuitName <str>,
                    Location: {
                        lat: lat <float>,
                        long: long <float>,
                        locality: locality <str>,
                        country: country <str>
                    }
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic typecasting:

            circuitId        <str>
            circuitUrl       <str>
            circuitName      <str>
            lat            <float>
            long           <float>
            locality         <str>
            country          <str>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastSimpleResponse | ErgastRawResponse

        Returns:

            ErgastSimpleResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_finishing_status(season=None, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get a list of finishing status codes.

        See: https://ergast.com/mrd/methods/status/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    statusId: statusId <int>,
                    count: count <int>,
                    status: status <str>
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic typecasting:

            statusId    <int>
            count       <int>
            status      <str>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastSimpleResponse | ErgastRawResponse

        Returns:

            ErgastSimpleResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_race_results(season=None, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get race results for one or multiple races.

        See: https://ergast.com/mrd/methods/results/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    url: raceUrl <str>,
                    raceName: raceName <str>,
                    date: raceDate <datetime.datetime | None>,
                    time: raceTime <datetime.time | None>,
                    Circuit: {
                        circuitId: circuitId <str>,
                        url: circuitUrl <str>,
                        circuitName: circuitName <str>,
                        Location: {
                            lat: lat <float>,
                            long: long <float>,
                            locality: locality <str>,
                            country: country <str>
                        }
                    },
                    Results: [
                        {
                            number: number <int>,
                            position: position <int>,
                            positionText: positionText <str>,
                            points: points <float>,
                            grid: grid <int>,
                            laps: laps <int>,
                            status: status <str>,
                            Driver: {
                                driverId: driverId <str>,
                                permanentNumber: driverNumber <int>,
                                code: driverCode <str>,
                                url: driverUrl <str>,
                                givenName: givenName <str>,
                                familyName: familyName <str>,
                                dateOfBirth: dateOfBirth <datetime.datetime | None>,
                                nationality: driverNationality <str>
                            },
                            Constructor: {
                                constructorId: constructorId <str>,
                                url: constructorUrl <str>,
                                name: constructorName <str>,
                                nationality: constructorNationality <str>
                            },
                            Time: {
                                millis: totalRaceTimeMillis <int>,
                                time: totalRaceTime <datetime.timedelta | None>
                            },
                            FastestLap: {
                                rank: fastestLapRank <int>,
                                lap: fastestLapNumber <int>,
                                Time: {
                                    millis: fastestLapTimeMillis <int>,
                                    time: fastestLapTime <datetime.timedelta | None>
                                },
                                AverageSpeed: {
                                    units: fastestLapAvgSpeedUnits <str>,
                                    speed: fastestLapAvgSpeed <float>
                                }
                            },
                            AverageSpeed: {
                                units: fastestLapAvgSpeedUnits <str>,
                                speed: fastestLapAvgSpeed <float>
                            }
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season                              <int>
            round                               <int>
            raceUrl                             <str>
            raceName                            <str>
            raceDate       <datetime.datetime | None>
            raceTime           <datetime.time | None>
            circuitId                           <str>
            circuitUrl                          <str>
            circuitName                         <str>
            lat                               <float>
            long                              <float>
            locality                            <str>
            country                             <str>

        ErgastMultiResponse.content (contains data from subkey
        RaceResults)

            number                                           <int>
            position                                         <int>
            positionText                                     <str>
            points                                         <float>
            grid                                             <int>
            laps                                             <int>
            status                                           <str>
            driverId                                         <str>
            driverNumber                                     <int>
            driverCode                                       <str>
            driverUrl                                        <str>
            givenName                                        <str>
            familyName                                       <str>
            dateOfBirth                 <datetime.datetime | None>
            driverNationality                                <str>
            constructorId                                    <str>
            constructorUrl                                   <str>
            constructorName                                  <str>
            constructorNationality                           <str>
            totalRaceTimeMillis                              <int>
            totalRaceTime              <datetime.timedelta | None>
            fastestLapRank                                   <int>
            fastestLapNumber                                 <int>
            fastestLapTimeMillis                             <int>
            fastestLapTime             <datetime.timedelta | None>
            fastestLapAvgSpeedUnits                          <str>
            fastestLapAvgSpeed                             <float>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_qualifying_results(season=None, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, fastest_rank=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get qualifying results for one or multiple qualifying sessions.

        See: https://ergast.com/mrd/methods/qualifying/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    url: raceUrl <str>,
                    raceName: raceName <str>,
                    date: raceDate <datetime.datetime | None>,
                    time: raceTime <datetime.time | None>,
                    Circuit: {
                        circuitId: circuitId <str>,
                        url: circuitUrl <str>,
                        circuitName: circuitName <str>,
                        Location: {
                            lat: lat <float>,
                            long: long <float>,
                            locality: locality <str>,
                            country: country <str>
                        }
                    },
                    QualifyingResults: [
                        {
                            number: number <int>,
                            position: position <int>,
                            Q1: Q1 <datetime.timedelta | None>,
                            Q2: Q2 <datetime.timedelta | None>,
                            Q3: Q3 <datetime.timedelta | None>,
                            Driver: {
                                driverId: driverId <str>,
                                permanentNumber: driverNumber <int>,
                                code: driverCode <str>,
                                url: driverUrl <str>,
                                givenName: givenName <str>,
                                familyName: familyName <str>,
                                dateOfBirth: dateOfBirth <datetime.datetime | None>,
                                nationality: driverNationality <str>
                            },
                            Constructor: {
                                constructorId: constructorId <str>,
                                url: constructorUrl <str>,
                                name: constructorName <str>,
                                nationality: constructorNationality <str>
                            }
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season                              <int>
            round                               <int>
            raceUrl                             <str>
            raceName                            <str>
            raceDate       <datetime.datetime | None>
            raceTime           <datetime.time | None>
            circuitId                           <str>
            circuitUrl                          <str>
            circuitName                         <str>
            lat                               <float>
            long                              <float>
            locality                            <str>
            country                             <str>

        ErgastMultiResponse.content (contains data from subkey
        QualifyingResults)

            number                                          <int>
            position                                        <int>
            Q1                        <datetime.timedelta | None>
            Q2                        <datetime.timedelta | None>
            Q3                        <datetime.timedelta | None>
            driverId                                        <str>
            driverNumber                                    <int>
            driverCode                                      <str>
            driverUrl                                       <str>
            givenName                                       <str>
            familyName                                      <str>
            dateOfBirth                <datetime.datetime | None>
            driverNationality                               <str>
            constructorId                                   <str>
            constructorUrl                                  <str>
            constructorName                                 <str>
            constructorNationality                          <str>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - fastest_rank (int | None) – select fastest by rank number
              (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_sprint_results(season=None, round=None, circuit=None, constructor=None, driver=None, grid_position=None, results_position=None, status=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get sprint results for one or multiple sprints.

        See: https://ergast.com/mrd/methods/sprint/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    url: raceUrl <str>,
                    raceName: raceName <str>,
                    date: raceDate <datetime.datetime | None>,
                    time: raceTime <datetime.time | None>,
                    Circuit: {
                        circuitId: circuitId <str>,
                        url: circuitUrl <str>,
                        circuitName: circuitName <str>,
                        Location: {
                            lat: lat <float>,
                            long: long <float>,
                            locality: locality <str>,
                            country: country <str>
                        }
                    },
                    SprintResults: [
                        {
                            number: number <int>,
                            position: position <int>,
                            positionText: positionText <str>,
                            points: points <float>,
                            grid: grid <int>,
                            laps: laps <int>,
                            status: status <str>,
                            Driver: {
                                driverId: driverId <str>,
                                permanentNumber: driverNumber <int>,
                                code: driverCode <str>,
                                url: driverUrl <str>,
                                givenName: givenName <str>,
                                familyName: familyName <str>,
                                dateOfBirth: dateOfBirth <datetime.datetime | None>,
                                nationality: driverNationality <str>
                            },
                            Constructor: {
                                constructorId: constructorId <str>,
                                url: constructorUrl <str>,
                                name: constructorName <str>,
                                nationality: constructorNationality <str>
                            },
                            Time: {
                                millis: totalRaceTimeMillis <int>,
                                time: totalRaceTime <datetime.timedelta | None>
                            },
                            FastestLap: {
                                rank: fastestLapRank <int>,
                                lap: fastestLapNumber <int>,
                                Time: {
                                    millis: fastestLapTimeMillis <int>,
                                    time: fastestLapTime <datetime.timedelta | None>
                                },
                                AverageSpeed: {
                                    units: fastestLapAvgSpeedUnits <str>,
                                    speed: fastestLapAvgSpeed <float>
                                }
                            },
                            AverageSpeed: {
                                units: fastestLapAvgSpeedUnits <str>,
                                speed: fastestLapAvgSpeed <float>
                            }
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season                              <int>
            round                               <int>
            raceUrl                             <str>
            raceName                            <str>
            raceDate       <datetime.datetime | None>
            raceTime           <datetime.time | None>
            circuitId                           <str>
            circuitUrl                          <str>
            circuitName                         <str>
            lat                               <float>
            long                              <float>
            locality                            <str>
            country                             <str>

        ErgastMultiResponse.content (contains data from subkey
        SprintResults)

            number                                           <int>
            position                                         <int>
            positionText                                     <str>
            points                                         <float>
            grid                                             <int>
            laps                                             <int>
            status                                           <str>
            driverId                                         <str>
            driverNumber                                     <int>
            driverCode                                       <str>
            driverUrl                                        <str>
            givenName                                        <str>
            familyName                                       <str>
            dateOfBirth                 <datetime.datetime | None>
            driverNationality                                <str>
            constructorId                                    <str>
            constructorUrl                                   <str>
            constructorName                                  <str>
            constructorNationality                           <str>
            totalRaceTimeMillis                              <int>
            totalRaceTime              <datetime.timedelta | None>
            fastestLapRank                                   <int>
            fastestLapNumber                                 <int>
            fastestLapTimeMillis                             <int>
            fastestLapTime             <datetime.timedelta | None>
            fastestLapAvgSpeedUnits                          <str>
            fastestLapAvgSpeed                             <float>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - circuit (str | None) – select a circuit by its circuit id
              (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - grid_position (int | None) – select a grid position by its
              number (default: all)

            - results_position (int | None) – select a finishing result
              by its position (default: all)

            - status (str | None) – select by finishing status (default:
              all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_driver_standings(season=None, round=None, driver=None, standings_position=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get driver standings at specific points of a season.

        See: https://ergast.com/mrd/methods/standings/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    DriverStandings: [
                        {
                            position: position <int>,
                            positionText: positionText <str>,
                            points: points <float>,
                            wins: wins <int>,
                            Driver: {
                                driverId: driverId <str>,
                                permanentNumber: driverNumber <int>,
                                code: driverCode <str>,
                                url: driverUrl <str>,
                                givenName: givenName <str>,
                                familyName: familyName <str>,
                                dateOfBirth: dateOfBirth <datetime.datetime | None>,
                                nationality: driverNationality <str>
                            },
                            Constructors: [
                                {
                                    constructorId: constructorIds <str>,
                                    url: constructorUrls <str>,
                                    name: constructorNames <str>,
                                    nationality: constructorNationalities <str>
                                }
                            ]
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season    <int>
            round     <int>

        ErgastMultiResponse.content (contains data from subkey
        DriverStandings)

            position                                         <int>
            positionText                                     <str>
            points                                         <float>
            wins                                             <int>
            driverId                                         <str>
            driverNumber                                     <int>
            driverCode                                       <str>
            driverUrl                                        <str>
            givenName                                        <str>
            familyName                                       <str>
            dateOfBirth                 <datetime.datetime | None>
            driverNationality                                <str>
            constructorIds                                 [<str>]
            constructorUrls                                [<str>]
            constructorNames                               [<str>]
            constructorNationalities                       [<str>]

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - standings_position (int | None) – select a result by
              position in the standings (default: all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_constructor_standings(season=None, round=None, constructor=None, standings_position=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get constructor standings at specific points of a season.

        See: https://ergast.com/mrd/methods/standings/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    ConstructorStandings: [
                        {
                            position: position <int>,
                            positionText: positionText <str>,
                            points: points <float>,
                            wins: wins <int>,
                            Constructor: {
                                constructorId: constructorId <str>,
                                url: constructorUrl <str>,
                                name: constructorName <str>,
                                nationality: constructorNationality <str>
                            }
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season    <int>
            round     <int>

        ErgastMultiResponse.content (contains data from subkey
        ConstructorStandings)

            position                    <int>
            positionText                <str>
            points                    <float>
            wins                        <int>
            constructorId               <str>
            constructorUrl              <str>
            constructorName             <str>
            constructorNationality      <str>

        Parameters:

            - season (Union[Literal['current'], int, None]) – select a
              season by its year (default: all, oldest first)

            - round (Union[Literal['last'], int, None]) – select a round
              by its number (default: all)

            - constructor (str | None) – select a constructor by its
              constructor id (default: all)

            - standings_position (int | None) – select a result by
              position in the standings (default: all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_lap_times(season, round, lap_number=None, driver=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get sprint results for one or multiple sprints.

        See: https://ergast.com/mrd/methods/laps/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    url: raceUrl <str>,
                    raceName: raceName <str>,
                    date: raceDate <datetime.datetime | None>,
                    time: raceTime <datetime.time | None>,
                    Circuit: {
                        circuitId: circuitId <str>,
                        url: circuitUrl <str>,
                        circuitName: circuitName <str>,
                        Location: {
                            lat: lat <float>,
                            long: long <float>,
                            locality: locality <str>,
                            country: country <str>
                        }
                    },
                    Laps: [
                        {
                            number: number <int>,
                            Timings: [
                                {
                                    driverId: driverId <str>,
                                    position: position <int>,
                                    time: time <datetime.timedelta | None>
                                }
                            ]
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season                              <int>
            round                               <int>
            raceUrl                             <str>
            raceName                            <str>
            raceDate       <datetime.datetime | None>
            raceTime           <datetime.time | None>
            circuitId                           <str>
            circuitUrl                          <str>
            circuitName                         <str>
            lat                               <float>
            long                              <float>
            locality                            <str>
            country                             <str>

        ErgastMultiResponse.content (contains data from subkey Laps)

            number                            <int>
            driverId                          <str>
            position                          <int>
            time        <datetime.timedelta | None>

        Parameters:

            - season (Union[Literal['current'], int]) – select a season
              by its year (default: all, oldest first)

            - round (Union[Literal['last'], int]) – select a round by
              its number (default: all)

            - lap_number (int | None) – select lap times by a specific
              lap number (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

    get_pit_stops(season, round, stop_number=None, lap_number=None, driver=None, result_type=None, auto_cast=None, limit=None, offset=None)[source]#

        Get pit stop information for one or multiple sessions.

        See: https://ergast.com/mrd/methods/standings/

        API Mapping

        Structure of the raw response, renamed key names for flattening
        and dtypes for automatic type casting:

            [
                {
                    season: season <int>,
                    round: round <int>,
                    url: raceUrl <str>,
                    raceName: raceName <str>,
                    date: raceDate <datetime.datetime | None>,
                    time: raceTime <datetime.time | None>,
                    Circuit: {
                        circuitId: circuitId <str>,
                        url: circuitUrl <str>,
                        circuitName: circuitName <str>,
                        Location: {
                            lat: lat <float>,
                            long: long <float>,
                            locality: locality <str>,
                            country: country <str>
                        }
                    },
                    PitStops: [
                        {
                            driverId: driverId <str>,
                            stop: stop <int>,
                            lap: lap <int>,
                            time: time <datetime.time | None>,
                            duration: duration <datetime.timedelta | None>,
                            Driver: {
                                driverId: driverId <str>,
                                permanentNumber: driverNumber <int>,
                                code: driverCode <str>,
                                url: driverUrl <str>,
                                givenName: givenName <str>,
                                familyName: familyName <str>,
                                dateOfBirth: dateOfBirth <datetime.datetime | None>,
                                nationality: driverNationality <str>
                            },
                            Constructors: [
                                {
                                    constructorId: constructorIds <str>,
                                    url: constructorUrls <str>,
                                    name: constructorNames <str>,
                                    nationality: constructorNationalities <str>
                                }
                            ]
                        }
                    ]
                }
            ]

        DataFrame Description

        DataFrame column names and dtypes for automatic
        typecasting:ErgastMultiResponse.description

            season                              <int>
            round                               <int>
            raceUrl                             <str>
            raceName                            <str>
            raceDate       <datetime.datetime | None>
            raceTime           <datetime.time | None>
            circuitId                           <str>
            circuitUrl                          <str>
            circuitName                         <str>
            lat                               <float>
            long                              <float>
            locality                            <str>
            country                             <str>

        ErgastMultiResponse.content (contains data from subkey PitStops)

            driverId                                          <str>
            stop                                              <int>
            lap                                               <int>
            time                             <datetime.time | None>
            duration                    <datetime.timedelta | None>
            driverNumber                                      <int>
            driverCode                                        <str>
            driverUrl                                         <str>
            givenName                                         <str>
            familyName                                        <str>
            dateOfBirth                  <datetime.datetime | None>
            driverNationality                                 <str>
            constructorIds                                  [<str>]
            constructorUrls                                 [<str>]
            constructorNames                                [<str>]
            constructorNationalities                        [<str>]

        Parameters:

            - season (Union[Literal['current'], int]) – select a season
              by its year (default: all, oldest first)

            - round (Union[Literal['last'], int]) – select a round by
              its number (default: all)

            - lap_number (int | None) – select pit stops by a specific
              lap number (default: all)

            - stop_number (int | None) – select pit stops by their stop
              number (default: all)

            - driver (str | None) – select a driver by its driver id
              (default: all)

            - result_type (Optional[Literal['pandas', 'raw']]) –
              Overwrites the default result type

            - auto_cast (bool | None) – Overwrites the default value for
              auto_cast

            - limit (int | None) – Overwrites the default value for
              limit

            - offset (int | None) – An offset into the result set for
              response paging. Defaults to 0 if not set. See also
              “Response Paging”, https://ergast.com/mrd/.

        Return type:

            ErgastMultiResponse | ErgastRawResponse

        Returns:

            ErgastMultiResponse or ErgastRawResponse, depending on the
            result_type parameter

previous

Jolpica-F1 API Interface

next

ErgastRawResponse

Choose version

On this page

- Ergast
  - Ergast.get_seasons()
  - Ergast.get_race_schedule()
  - Ergast.get_driver_info()
  - Ergast.get_constructor_info()
  - Ergast.get_circuits()
  - Ergast.get_finishing_status()
  - Ergast.get_race_results()
  - Ergast.get_qualifying_results()
  - Ergast.get_sprint_results()
  - Ergast.get_driver_standings()
  - Ergast.get_constructor_standings()
  - Ergast.get_lap_times()
  - Ergast.get_pit_stops()

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
