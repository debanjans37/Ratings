"use strict";
export class Constants {
  public zeroLiteral = "0";
  public percentLiteral = "%";
  public zeroPercentLiteral = "0%";
  public hundredPercentLiteral = "100%";

  // paths
  public starPathPoints =
    "30,8 38,31 62,34 45,47 52,70 30,57 8,70 16,47 -2,34 22,31 30,8";
  public trianglePathPoints = "2,62 32,12 62,62";
  public invertedTrianglePathPoints = "2,12 32,62 62,12";

  public maxDecimalPlaces: number = 2;
  public none = "none";
  // shapes
  public circle = "circle";
  public star = "star";
  public triangle = "triangle";
  public invertedTriangle = "invertedTriangle";

  // clip path ids
  public starClipPath = "#starClipPath";
  public triangleClipPath = "#triangleClipPath";
  public invertedTriangleClipPath = "#invertedTriangleClipPath";
  public circleClipPath = "#circleClipPath";

  // directions
  public right = "right";
  public left = "left";
  public top = "top";
  public down = "down";

  public circleX: number = 30;
  public circleY: number = 37;
  public viewBoxHeight: number = 80;
  public defaultFontSize: number = 20;
  public defaultFontFamily = "Segoe UI";
  public defaultLabelColor = "#000000";
  public defaultColor = "#FBB040";
  public defaultEmptyStarFill = "#E6E7E8";
  public defaultIndicatorNumber: number = 5;

  public symbolWidth: number = 62;
  public symbolMarginRight: number = 8;
  public starMarginRight: number = 5;
  public labelPadding: number = 10;
  public rectHeight: number = 70;
  public transitionTimeout: number = 1000;
  public valueLabelHeight: number = 53;
  public starValueLabelHeight: number = 46;

  public minStrokeWidthLimit: number = 1;
  public maxStrokeWidthLimit: number = 4;
}
