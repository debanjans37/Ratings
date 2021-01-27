import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { Constants } from "./Constants";
import { ShapePolygonProps } from "./interfaces";
let constants = new Constants();

export class ShapePolygon extends React.Component<ShapePolygonProps> {
  getTranslation = (value: number): string => {
    return `translate(${value})`;
  };

  private shapeClipPath = this.props.clipPath;

  getTranslateTextFromIndex(): string {
    let translationVal = 0;
    if (this.props.direction === constants.right) {
      translationVal =
        this.props.index *
        (constants.symbolWidth +
          (this.shapeClipPath.indexOf(constants.star) != -1
            ? constants.symbolMarginRight
            : constants.starMarginRight));
    } else {
      translationVal =
        this.props.index *
          (constants.symbolWidth +
            (this.shapeClipPath.indexOf(constants.star) != -1
              ? constants.symbolMarginRight
              : constants.starMarginRight)) +
        constants.symbolWidth +
        constants.labelPadding;
    }
    return `translate(${translationVal})`;
  }

  returnShapeOrCircle(): JSX.Element {
    let fillColor =
      this.props.showGradientColor && this.props.index < this.props.labelValue
        ? `url(#gradient${this.props.index})`
        : this.props.fillColor;

    if (this.shapeClipPath.indexOf(constants.circle) != -1) {
      return (
        <circle
          cx={constants.circleX}
          cy={constants.circleY}
          r={constants.circleX}
          fill={fillColor}
        />
      );
    } else {
      return (<polygon points={this.props.points} fill={fillColor} />);
    }
  }


  renderInnerShapeElements(): JSX.Element {
    const rectWidth =
    constants.symbolWidth *
    (1 -
      (this.props.valueInRatingsRange -
        Math.floor(this.props.valueInRatingsRange)));

    const fillColor =
    this.props.showGradientColor && this.props.index < this.props.labelValue
      ? `url(#gradient${this.props.index})`
      : this.props.fillColor;

      if(this.props.showPartialColor) {
        return (<>
            <g
              clipPath={`url(${window.location.href}${this.props.clipPath})`}
              transform={`translate(${this.props.translationValue})`}
            >
              {this.returnShapeOrCircle()}
              <rect
                height={constants.rectHeight}
                width={rectWidth}
                transform={this.getTranslation(
                  constants.symbolWidth - rectWidth
                )}
                fill={this.props.emptySymbolFill}
              />
            </g>
            {this.props.borderWidth > 0 &&
              (this.shapeClipPath.indexOf(constants.circle) === -1 ? (
                <polygon
                  points={this.props.points}
                  fill={constants.none}
                  stroke={this.props.borderColor}
                  strokeWidth={this.props.borderWidth}
                  transform={`translate(${this.props.translationValue})`}
                />
              ) : (
                <circle
                  cx={constants.circleX}
                  cy={constants.circleY}
                  r={constants.circleX}
                  fill={constants.none}
                  stroke={this.props.borderColor}
                  strokeWidth={this.props.borderWidth}
                  transform={`translate(${this.props.translationValue})`}
                />
              ))}
          </>)
      } else {
        return (this.shapeClipPath.indexOf(constants.circle) === -1 ? (
            <polygon
              transform={`translate(${this.props.translationValue})`}
              points={this.props.points}
              fill={fillColor}
              stroke={this.props.borderColor}
              strokeWidth={this.props.borderWidth}
            />
          ) : (
            <circle
              cx={constants.circleX}
              cy={constants.circleY}
              r={constants.circleX}
              fill={fillColor}
              stroke={this.props.borderColor}
              strokeWidth={this.props.borderWidth}
              transform={`translate(${this.props.translationValue})`}
            />
          ))
      }
  }

  render() {
    return this.props.showAnimation ?
      (<CSSTransition
        in={true}
        appear={true}
        timeout={constants.transitionTimeout}
        classNames="fade"
      >
        {this.renderInnerShapeElements()}
      </CSSTransition>) : this.renderInnerShapeElements();
  }
}

export default ShapePolygon;
