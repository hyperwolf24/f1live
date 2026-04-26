- 
- API Reference
- Circuit Information

Circuit Information#

class fastf1.mvapi.CircuitInfo(corners, marshal_lights, marshal_sectors, rotation)[source]#

    Holds information about the circuit that is useful for visualizing
    and annotating data.

    corners, marshal_lights and marshal_sectors are track markers that
    all use a similar DataFrame format. Each set of these track markers
    has the following DataFrame columns:

      Columns:
      X <float>, Y <float>, Number <int>, Letter <str>, Angle <float>, Distance <float>

      - X and Y specify the position on the track map

      - Number is the number of the corner. Letter is optionally used to
        differentiate corners with the same number on some circuits,
        e.g. “2A”.

      - Angle is an angle in degrees, used to visually offset the
        marker’s placement on a track map in a logical direction
        (usually orthogonal to the track).

      - Distance is the location of the marker as a distance from the
        start/finish line. This value needs to be computed using car
        telemetry as a reference. It will therefore only be available,
        if telemetry data is loaded.

    Note

    This data has been manually created and is not highly accurate but
    sufficient for visualization. A big thanks to MultiViewer
    (https://multiviewer.app/) for providing this data to FastF1.

    corners: DataFrame#

        Location of corners.

        (DataFrame format described above)

    marshal_lights: DataFrame#

        Location of marshal lights.

        (DataFrame format described above)

    marshal_sectors: DataFrame#

        Location of marshal sectors.

        (DataFrame format described above)

    rotation: float#

        Rotation of the circuit in degrees. This can be used to rotate
        the coordinate system of the telemetry (position) data to match
        the orientation of the official track map.

previous

DriverResult

next

Jolpica-F1 API Interface

Choose version

On this page

- CircuitInfo
  - CircuitInfo.corners
  - CircuitInfo.marshal_lights
  - CircuitInfo.marshal_sectors
  - CircuitInfo.rotation

Support the Project

[]Contribute

[] Sponsor

[Buy Me A Coffee]
