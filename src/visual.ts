/*
 *  Ratings custom visual
 *
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ''Software''), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
"use strict";
import * as d3 from "d3";
import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { RatingsCardComponent } from "./RatingsCardComponent";
import { Constants } from "./Constants";
import {
  createTooltipServiceWrapper,
  ITooltipServiceWrapper,
} from "powerbi-visuals-utils-tooltiputils";
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import DataViewValueColumn = powerbi.DataViewValueColumn;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;
import DataViewObjects = powerbi.DataViewObjects;
import DataViewObject = powerbi.DataViewObject;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import Fill = powerbi.Fill;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import { VisualSettings } from "./settings";
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import { getValue } from "powerbi-visuals-utils-dataviewutils/lib/dataViewObjects";
import { ISymbolColorConfig, IStarsData } from "./interfaces";

let constants = new Constants();

export class Visual implements IVisual {
  // Convert a DataView into a view model
  public static CONVERTER(dataView: DataView): IStarsData {
    const data: IStarsData = <IStarsData>{};
    const valueFormatSymbol: string = "";
    const dataViewCategorical = dataView.categorical;
    const dataViewCategoricalValues = dataViewCategorical.values;
    if (dataView && dataViewCategorical && dataViewCategoricalValues && dataView.metadata && dataView.metadata.columns) {
      dataViewCategoricalValues.forEach((val: DataViewValueColumn) => {
        if (val.source.roles.value) {
          data.value = Number(val.values[0]);
        } else if (val.source.roles.max) {
          data.max = Number(val.values[0]);
        }
      });
    } else {
      data.value = Visual.defaultValues.value;
      data.max = undefined;
    }
    data.visualSymbol = getValue(dataView.metadata.objects,
      Visual.properties.visualSymbol,
      Visual.defaultValues.visualSymbol
    );
    data.numStars = getValue(dataView.metadata.objects,
      Visual.properties.numStars,
      Visual.defaultValues.numStars
    );
    data.show = getValue(dataView.metadata.objects,
      Visual.properties.show,
      Visual.defaultValues.show
    );
    data.showStroke = getValue(dataView.metadata.objects,
      Visual.properties.showStroke,
      Visual.defaultValues.showStroke
    );
    data.starStroke = Visual.getStarStroke(dataView).solid.color;
    data.starFill = Visual.getStarFill(dataView).solid.color;
    data.emptyStarFill = getValue(dataView.metadata.objects,
      Visual.properties.emptyStarFill,
      {
        solid: {
          color: Visual.defaultValues.emptyStarFill,
        },
      }
    ).solid.color;
    data.fontSize = getValue(
      dataView.metadata.objects,
      Visual.properties.fontSize,
      Visual.defaultValues.fontSize
    );
    data.direction = getValue(
      dataView.metadata.objects,
      Visual.properties.direction,
      Visual.defaultValues.direction
    );
    data.fontFamily = getValue(
      dataView.metadata.objects,
      Visual.properties.fontFamily,
      Visual.defaultValues.fontFamily
    );
    data.fontColor = getValue(
      dataView.metadata.objects,
      Visual.properties.fontColor,
      { solid: { color: Visual.defaultValues.fontColor } }
    ).solid.color;
    data.valueAsPercent =
      valueFormatSymbol === constants.percentLiteral ? true : false;
    data.showAnimation = getValue(
      dataView.metadata.objects,
      Visual.properties.showAnimation,
      Visual.defaultValues.showAnimation
    );
    data.strokeWidth = Visual.getStrokeWidth(dataView);
    data.showGradient = getValue(
      dataView.metadata.objects,
      Visual.properties.showGradient,
      Visual.defaultValues.showGradient
    );
    data.gradientStartColor = getValue(
      dataView.metadata.objects,
      Visual.properties.gradientStartColor,
      { solid: { color: Visual.defaultValues.gradientStartColor } }
    ).solid.color;
    data.gradientEndColor = getValue(
      dataView.metadata.objects,
      Visual.properties.gradientEndColor,
      { solid: { color: Visual.defaultValues.gradientEndColor } }
    ).solid.color;
    let max: number = data.max || data.numStars;
    if (data.valueAsPercent) {
      max = data.max || 1;
      data.valueLabel = data.value * 100 + constants.percentLiteral;
    } else {
      data.valueLabel = data.value.toFixed(1);
      data.value = Number(data.valueLabel);
    }
    const rangeSize: number = max;
    const scale: number = data.numStars / rangeSize;
    data.value = data.value * scale;

    return data;
  }

  private static defaultValues: any = {
    defaultFill: "#FBB040",
    defaultStroke: "#000000",
    direction: "down",
    emptyStarFill: "#E6E7E8",
    fontColor: "#000000",
    fontSize: 20,
    fontFamily: "Segoe UI",
    gradientEndColor: "#00FF00",
    gradientStartColor: "#FF0000",
    max: undefined,
    numStars: 5,
    show: true,
    showAnimation: true,
    showGradient: false,
    showStroke: false,
    starStroke: "#000000",
    strokeWidth: 2,
    value: 0,
    visualSymbol: "star",
  };

  private static properties: any = {
    direction: { objectName: "dataLabel", propertyName: "direction" },
    emptyStarFill: { objectName: "starStyle", propertyName: "emptyStarFill" },
    fontColor: { objectName: "dataLabel", propertyName: "fontColor" },
    fontFamily: { objectName: "dataLabel", propertyName: "fontFamily" },
    fontSize: { objectName: "dataLabel", propertyName: "fontSize" },
    gradientEndColor: {
      objectName: "starStyle",
      propertyName: "gradientEndColor",
    },
    gradientStartColor: {
      objectName: "starStyle",
      propertyName: "gradientStartColor",
    },
    max: { objectName: "starproperties", propertyName: "max" },
    numStars: { objectName: "starproperties", propertyName: "numStars" },
    show: { objectName: "dataLabel", propertyName: "show" },
    showAnimation: { objectName: "starAnimation", propertyName: "show" },
    showGradient: { objectName: "starStyle", propertyName: "showGradient" },
    showStroke: { objectName: "stroke", propertyName: "show" },
    starFill: { objectName: "starStyle", propertyName: "starFill" },
    starStroke: { objectName: "stroke", propertyName: "starStroke" },
    strokeWidth: { objectName: "stroke", propertyName: "strokeWidth" },
    visualSymbol: {
      objectName: "starproperties",
      propertyName: "visualSymbol",
    },
  };

  private static getStarStroke(dataView: DataView): Fill {
    const defaultColorConfig: ISymbolColorConfig = {
      fill: Visual.defaultValues.defaultFill,
      stroke: Visual.defaultValues.defaultStroke,
    };

    return (
      dataView.metadata &&
      getValue(dataView.metadata.objects, Visual.properties.starStroke, {
        solid: {
          color: defaultColorConfig.stroke,
        },
      })
    );
  }

  private static getStarFill(dataView: DataView): Fill {
    const defaultColorConfig: ISymbolColorConfig = {
      fill: Visual.defaultValues.defaultFill,
      stroke: Visual.defaultValues.defaultStroke,
    };

    return (
      dataView.metadata &&
      getValue(dataView.metadata.objects, Visual.properties.starFill, {
        solid: {
          color: defaultColorConfig.fill,
        },
      })
    );
  }

  private static getStrokeWidth(dataView: DataView): number {
    let strokeWidth =
      dataView.metadata &&
      getValue(
        dataView.metadata.objects,
        Visual.properties.strokeWidth,
        Visual.defaultValues.strokeWidth
      );
    if (strokeWidth < constants.minStrokeWidthLimit) {
      strokeWidth = constants.minStrokeWidthLimit;
    } else if (strokeWidth > constants.maxStrokeWidthLimit) {
      strokeWidth = constants.maxStrokeWidthLimit;
    }
    return strokeWidth;
  }

  private dataView: DataView;
  private data: IStarsData;
  private tooltipServiceWrapper: ITooltipServiceWrapper;
  private host: IVisualHost;
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;
  private selectionManager: ISelectionManager;
  private settings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(RatingsCardComponent, {});
    this.target = options.element;
    ReactDOM.render(this.reactRoot, this.target);
    this.host = options.host;
    this.tooltipServiceWrapper = createTooltipServiceWrapper(
      this.host.tooltipService,
      options.element
    );
    this.selectionManager = options.host.createSelectionManager();
  }

  /**
   * Gets the tooltip data to be shown according to the values selected in tooltip format pane and default options value
   * @param values
   */
  getTooltipData = (values: any): VisualTooltipDataItem[] => {
    let tooltipData: VisualTooltipDataItem[] = [];
    if(values.length) {
      values.forEach((item) => {
        let datapointValue = item.values[0];
        let formattedValue = " ";
        if (datapointValue) {
          let decimalPlaces =
            datapointValue.toString().indexOf(".") === -1
              ? 0
              : datapointValue.toString().length -
                datapointValue.toString().indexOf(".") -
                1;
          formattedValue = (decimalPlaces <= constants.maxDecimalPlaces
            ? datapointValue.toFixed(decimalPlaces)
            : datapointValue.toFixed(constants.maxDecimalPlaces)
          ).toString();
        }
        let tooltipDataPoint: VisualTooltipDataItem = {
          displayName: item.source.displayName,
          value: formattedValue,
        };
        tooltipData.push(tooltipDataPoint);
      });
    }

    return tooltipData;
  };

  public update(options: VisualUpdateOptions): void {
    try {
      this.host.eventService.renderingStarted(options);

      const dataView: DataView = (this.dataView = options.dataViews[0]);
      if (dataView) {
        this.data = Visual.CONVERTER(dataView);
        this.settings = VisualSettings.parse<VisualSettings>(dataView);
        RatingsCardComponent.UPDATE({
          shapePathPoints:
            this.data.visualSymbol ?? this.settings.starproperties.visualSymbol,
          shapeIndicatorNumber:
            this.data.numStars ?? this.settings.starproperties.numStars,
          shapeFillColor:
            this.data.starFill ?? this.settings.starStyle.starFill,
          value: this.data.value,
          showValue: this.data.show,
          valuePosition: this.data.direction,
          valueFontColor: this.data.fontColor,
          valueFontSize: this.data.fontSize,
          valueFontFamily: this.data.fontFamily,
          emptyStarFill: this.data.emptyStarFill,
          symbolBorderColor: this.data.starStroke,
          symbolBorderWidth: this.data.showStroke ? this.data.strokeWidth : 0,
          height: options.viewport.height,
          width: options.viewport.width,
          showGradient: this.data.showGradient,
          gradientStartColor: this.data.gradientStartColor,
          gradientEndColor: this.data.gradientEndColor,
          showAnimation: this.data.showAnimation,
          selectionManager: this.selectionManager,
        });
      }
      this.tooltipServiceWrapper.addTooltip(d3.select(".mainDiv"), () =>
        this.getTooltipData(options.dataViews[0].categorical.values)
      );
      this.host.eventService.renderingFinished(options);
    } catch (exeption) {
      this.host.eventService.renderingFailed(options, exeption);
    }
  }

  /**
   * To parse the settings
   * @param dataView
   */
  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   * @param options
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    const settings: VisualSettings =
      this.settings || <VisualSettings>VisualSettings.getDefault();
    if (options.objectName === "starStyle") {
      let properties: any = {};
      if (this.data.showGradient) {
        properties = {
          showGradient: this.data.showGradient,
          gradientStartColor: this.data.gradientStartColor,
          gradientEndColor: this.data.gradientEndColor,
          emptyStarFill: this.data.emptyStarFill,
        };
      } else {
        properties = {
          showGradient: this.data.showGradient,
          starFill: this.data.starFill,
          emptyStarFill: this.data.emptyStarFill,
        };
      }
      const gradient: VisualObjectInstance = {
        displayName: "Indicator style",
        objectName: "starStyle",
        properties,
        selector: null,
      };
      const instances: VisualObjectInstance[] = [];
      instances.push(gradient);
      return <VisualObjectInstanceEnumeration>instances;
    } else {
      return VisualSettings.enumerateObjectInstances(
        settings || VisualSettings.getDefault(),
        options
      );
    }
  }
}
