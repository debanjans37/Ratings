import { TextProperties } from "powerbi-visuals-utils-formattingutils/lib/src/textMeasurementService";
import * as React from "react";
import ShapePolygon from "./ShapePolygon";
import { textMeasurementService as tms } from "powerbi-visuals-utils-formattingutils";
import textMeasurementService = tms.textMeasurementService;
import { CSSTransition, TransitionGroup } from "react-transition-group";
import powerbi from "powerbi-visuals-api";
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import { Constants } from "./Constants";
import { CardState, ColorRGB, ShapePolygonProps } from "./interfaces";
import { hexToRgb, fullColorHex } from "./colorHelper";
let constants = new Constants();

export const initialState: CardState = {
  shapePathPoints: constants.starPathPoints, // default setting the shape to star,
  shapeIndicatorNumber: constants.defaultIndicatorNumber, // default setting the number of indicators to 5
  shapeFillColor: constants.defaultColor,
  shapeClipPath: constants.starClipPath,
  value: 0,
  showValue: true,
  showGradient: false,
  valuePosition: constants.down,
  valueFontColor: constants.defaultLabelColor,
  valueFontSize: constants.defaultFontSize,
  valueFontFamily: constants.defaultFontFamily,
  emptyStarFill: constants.defaultEmptyStarFill,
  symbolBorderWidth: 0,
  showAnimation: true,
};

export class RatingsCardComponent extends React.Component<{}, CardState> {
  private static updateCallback: (data: object) => void = null;
  public selectionManager: ISelectionManager;
  public ref = null;

  public static UPDATE(newState: CardState) {
    RatingsCardComponent.updateCallback?.(newState);
  }

  /**
   * Life cycle method of React componentDidMount
   */
  public componentDidMount() {
    RatingsCardComponent.updateCallback = (newState: CardState): void => {
      let shape = newState.shapePathPoints;
      let copyState = { ...newState };
      switch (shape) {
        case constants.star:
          copyState.shapeClipPath = constants.starClipPath;
          copyState.shapePathPoints = constants.starPathPoints;
          break;
        case constants.triangle:
          copyState.shapeClipPath = constants.triangleClipPath;
          copyState.shapePathPoints = constants.trianglePathPoints;
          break;
        case constants.invertedTriangle:
          copyState.shapeClipPath = constants.invertedTriangleClipPath;
          copyState.shapePathPoints = constants.invertedTrianglePathPoints;
          break;
        case constants.circle:
          copyState.shapeClipPath = constants.circleClipPath;
          break;
        default:
          copyState.shapeClipPath = constants.starClipPath;
          copyState.shapePathPoints = constants.starPathPoints;
      }
      this.setState(copyState);
      this.selectionManager = newState.selectionManager;
    };
  }

  /**
   * Life cycle method of React componentWillUnmount
   */
  public componentWillUnmount() {
    RatingsCardComponent.updateCallback = null;
  }

  constructor(props: any) {
    super(props);
    this.state = initialState;
    this.ref = React.createRef();
  }

  showContextMenuInVisual = (e) => {
    e.preventDefault();
    this.selectionManager.showContextMenu(this.ref.currentTarget, {
      x: e.clientX,
      y: e.clientY,
    });
  };

  /**
   * To get translation value according to index
   * @param index
   */
  getTranslationValue = (index: number): number => {
    // Construct a text label field to calculate data label width
    const labelProps: TextProperties = {
      fontFamily: this.state.valueFontFamily,
      fontSize: `${this.state.valueFontSize}px`,
      text: this.state.value.toFixed(1).toString(),
    };

    const labelWidth: number = textMeasurementService.measureSvgTextWidth(
      labelProps
    );

    return (
      index *
        (constants.symbolWidth +
          (this.state.shapeClipPath.indexOf(constants.star) != -1
            ? constants.symbolMarginRight
            : constants.starMarginRight)) +
      (this.state.valuePosition === constants.left
        ? labelWidth +
          (this.state.shapeClipPath.indexOf(constants.star) != -1
            ? constants.labelPadding
            : constants.labelPadding / 2)
        : 0)
    );
  };

  /**
   * To render the text data label
   */
  renderDataLabel = (): JSX.Element => {
    const value = this.state.value;
    // Construct a text label field to calculate data label width
    const labelProps: TextProperties = {
      fontFamily: this.state.valueFontFamily,
      fontSize: `${this.state.valueFontSize}px`,
      text: value.toFixed(1).toString(),
    };

    const textStyles = {
      fontSize: this.state.valueFontSize,
      fontFamily: this.state.valueFontFamily,
      fill: this.state.valueFontColor,
    };

    const labelWidth: number = textMeasurementService.measureSvgTextWidth(
      labelProps
    );

    const valueHeight =
      this.state.shapeClipPath.indexOf(constants.star) != -1
        ? constants.valueLabelHeight
        : constants.starValueLabelHeight;
    const rightPosition =
      this.state.shapeIndicatorNumber *
      (constants.symbolWidth +
        (this.state.shapeClipPath.indexOf(constants.star) != -1
          ? constants.symbolMarginRight
          : constants.starMarginRight));

    if (this.state.valuePosition === constants.left) {
      return (
        <text transform={`translate(0, ${valueHeight})`} style={textStyles}>
          {value.toFixed(1)}
        </text>
      );
    } else if (this.state.valuePosition === constants.right) {
      return (
        <text x={rightPosition} y={valueHeight} style={textStyles}>
          {value.toFixed(1)}
        </text>
      );
    } else {
      const yPos =
        this.state.valuePosition === constants.top
          ? constants.zeroPercentLiteral
          : "80%";
      const xPos = (rightPosition - labelWidth) / 2;
      return (
        <text x={xPos} y={yPos} style={textStyles}>
          {value.toFixed(1)}
        </text>
      );
    }
  };

  /**
   * To calculate and set viewbox values - x, y, width, height
   */
  getViewBoxValues = (): string => {
    const shapeClipPath = this.state.shapeClipPath;
    const valuePosition = this.state.valuePosition;
    // Construct a text label field to calculate data label height and width
    const labelProps: TextProperties = {
      fontFamily: this.state.valueFontFamily,
      fontSize: `${this.state.valueFontSize}px`,
      text: this.state.value.toFixed(1).toString(),
    };
    const labelHeight: number = textMeasurementService.measureSvgTextHeight(
      labelProps
    );
    const labelWidth: number = textMeasurementService.measureSvgTextWidth(
      labelProps
    );

    const totalWidth =
      this.state.shapeIndicatorNumber *
      (constants.symbolWidth +
        (shapeClipPath.indexOf(constants.star) != -1
          ? constants.symbolMarginRight
          : constants.starMarginRight));
    const labelGap =
      shapeClipPath.indexOf(constants.star) !== -1
        ? constants.labelPadding
        : constants.labelPadding / 2;
    const widthSet = totalWidth + labelWidth + labelGap;

    if (!this.state.showValue) {
      return `0 0 ${totalWidth} ${constants.viewBoxHeight}`;
    } else {
      if (valuePosition === constants.right) {
        return `0 0 ${widthSet} ${constants.viewBoxHeight}`;
      } else if (valuePosition === constants.top) {
        return `0 -30 ${totalWidth} ${constants.viewBoxHeight + labelHeight}`;
      } else if (valuePosition === constants.left) {
        return `0 0 ${widthSet} ${constants.viewBoxHeight}`;
      } else {
        return `0 0 ${totalWidth} ${constants.viewBoxHeight + labelHeight}`;
      }
    }
  };

  

  /**
   * To render the linear gradient colors
   */
  getLinearGradients = (): JSX.Element | JSX.Element[] => {
    if (!this.state.showGradient) {
      // No gradient line
      return <linearGradient />;
    } else if (this.state.gradientStartColor && this.state.gradientEndColor) {
      const gradientStartColor = this.state.gradientStartColor;
      const gradientEndColor = this.state.gradientEndColor;

      let linearGradientContainer = [];
      const startRGB = hexToRgb(gradientStartColor);
      const endRGB = hexToRgb(gradientEndColor);
      const filledStars = this.state.shapeIndicatorNumber;
      let startHex: string = gradientStartColor;
      let endHex: string;

      for (let loopVar = 0; loopVar < filledStars; loopVar++) {
        const interRGB: ColorRGB = {
          b: Number(
            (
              startRGB.b +
              ((endRGB.b - startRGB.b) * loopVar) / filledStars
            ).toFixed(0)
          ),
          g: Number(
            (
              startRGB.g +
              ((endRGB.g - startRGB.g) * loopVar) / filledStars
            ).toFixed(0)
          ),
          r: Number(
            (
              startRGB.r +
              ((endRGB.r - startRGB.r) * loopVar) / filledStars
            ).toFixed(0)
          ),
        };
        // Logic to break the color gradient
        if (loopVar !== 0) {
          startHex = endHex;
        } else {
          startHex = gradientStartColor;
        }
        if (loopVar === filledStars - 1) {
          endHex = gradientEndColor;
        } else {
          endHex = fullColorHex(interRGB);
        }

        let startColorRGB = hexToRgb(startHex);
        let endColorRGB = hexToRgb(endHex);

        linearGradientContainer.push(
          <linearGradient
            id={`gradient${loopVar}`}
            x1={constants.zeroPercentLiteral}
            y1={constants.zeroPercentLiteral}
            x2={constants.hundredPercentLiteral}
            y2={constants.zeroPercentLiteral}
          >
            <stop
              offset={constants.zeroPercentLiteral}
              stop-color={`rgb(${startColorRGB.r}, ${startColorRGB.g}, ${startColorRGB.b})`}
              stop-opacity="1"
            ></stop>
            <stop
              offset={constants.hundredPercentLiteral}
              stop-color={`rgb(${endColorRGB.r}, ${endColorRGB.g}, ${endColorRGB.b})`}
              stop-opacity="1"
            ></stop>
          </linearGradient>
        );
      }
      return linearGradientContainer;
    }
  };

  renderInnerSvgElements = (shapesContainer: React.CElement<ShapePolygonProps, any>[]): JSX.Element => {
    const svgHeight =
      this.state.valuePosition === constants.top || constants.down
        ? this.state.height
        : this.state.height - constants.labelPadding;
    const viewBoxValues = this.getViewBoxValues();

    return (
      <svg viewBox={viewBoxValues} width={this.state.width} height={svgHeight}>
        {/* Group for rendering gradient colors */}
        {this.getLinearGradients()}
        {/* Group for rendering indicators */}
        <g
          transform={`translate(${
            this.state.valuePosition === constants.right ? 6 : 0
          },0)`}
        >
          {shapesContainer}
        </g>
        {/* Add clip path defs for the 4 different indicator types */}
        <defs>
          <clipPath id="starClipPath">
            <polygon points={constants.starPathPoints} />
          </clipPath>
          <clipPath id="triangleClipPath">
            <polygon points={constants.trianglePathPoints} />
          </clipPath>
          <clipPath id="invertedTriangleClipPath">
            <polygon points={constants.invertedTrianglePathPoints} />
          </clipPath>
          <clipPath id="circleClipPath">
            <circle
              cx={constants.circleX}
              cy={constants.circleY}
              r={constants.circleX}
            />
          </clipPath>
        </defs>
        {/* Group for rendering data labels */}
        {this.state.showValue && (
          <g transform={`translate(0,0)`}>{this.renderDataLabel()}</g>
        )}
      </svg>
    );
  };

  render() {
    
    const valueInRatingsRange = this.state.value;
    const shapesContainer: React.CElement<ShapePolygonProps, any>[] = [];
    for (let i = 0; i < this.state.shapeIndicatorNumber; i++) {
      let fillColor =
        Number(i) < valueInRatingsRange
          ? this.state.shapeFillColor
          : this.state.emptyStarFill;
      let showPartialColor =
        Number(i) < valueInRatingsRange &&
        valueInRatingsRange < Number(i) + 1;
      let borderColor =
        this.state.symbolBorderWidth > 0
          ? this.state.symbolBorderColor
          : "none";

      shapesContainer.push(
        <ShapePolygon
          key={`indicator-${i}`}
          index={Number(i)}
          points={this.state.shapePathPoints}
          showAnimation={this.state.showAnimation}
          fillColor={fillColor}
          labelValue={this.state.value}
          emptySymbolFill={this.state.emptyStarFill}
          borderColor={borderColor}
          borderWidth={this.state.symbolBorderWidth}
          valueInRatingsRange={valueInRatingsRange}
          clipPath={this.state.shapeClipPath}
          direction={this.state.valuePosition}
          showGradientColor={this.state.showGradient}
          translationValue={this.getTranslationValue(Number(i))}
          showPartialColor={showPartialColor}
        />
      );
    }

    return this.state.showAnimation ? (
      <TransitionGroup
        ref={this.ref}
        className="mainDiv"
        onContextMenu={this.showContextMenuInVisual}
      >
        <CSSTransition
          key={`${this.state.shapeClipPath}_${this.state.shapeIndicatorNumber}_${this.state.valuePosition}`}
          timeout={1000}
          classNames="fade"
        >
          {this.renderInnerSvgElements(shapesContainer)}
        </CSSTransition>
      </TransitionGroup>
    ) : (
      <div
        className="mainDiv"
        ref={this.ref}
        key={`${this.state.shapeClipPath}_${this.state.shapeIndicatorNumber}_${this.state.valuePosition}`}
        onContextMenu={this.showContextMenuInVisual}
      >
        {this.renderInnerSvgElements(shapesContainer)}
      </div>
    );
  }
}

export default RatingsCardComponent;