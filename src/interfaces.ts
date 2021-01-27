import powerbi from "powerbi-visuals-api";
import ISelectionManager = powerbi.extensibility.ISelectionManager;

export interface ISymbolColorConfig {
  fill: string;
  stroke: string;
}

export interface ITooltipDataPoints {
  name: string;
  value: string;
}

export interface IStarsData {
  value: number;
  max: number;
  valueLabel: string;
  numStars: number;
  show: boolean;
  showStroke: boolean;
  starStroke: string;
  starFill: string;
  emptyStarFill: string;
  valueAsPercent: boolean;
  visualSymbol: string;
  fontSize: number;
  direction: string;
  fontColor: string;
  fontFamily: string;
  showAnimation: boolean;
  strokeWidth: number;
  tooltipData: ITooltipDataPoints[];
  showGradient: boolean;
  gradientStartColor: string;
  gradientEndColor: string;
}

export interface ShapePolygonProps {
  points: string;
  fillColor: string;
  showPartialColor: boolean;
  labelValue: number;
  valueInRatingsRange: number;
  emptySymbolFill: string;
  borderColor: string;
  borderWidth: number;
  index: number;
  clipPath: string;
  direction: string;
  translationValue: number;
  showGradientColor: boolean;
  showAnimation: boolean;
}

export interface ColorRGB {
  b: number;
  g: number;
  r: number;
}

export interface CardState {
  emptyStarFill: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  height?: number;
  selectionManager?: ISelectionManager;
  shapeClipPath?: string;
  shapeFillColor: any;
  shapeIndicatorNumber: number;
  shapePathPoints: string;
  showAnimation: boolean;
  showGradient: boolean;
  showValue: boolean;
  symbolBorderColor?: string;
  symbolBorderWidth: number;
  value: number;
  valueFontColor: string;
  valueFontFamily: string;
  valueFontSize: number;
  valuePosition: string;
  width?: number;
}
