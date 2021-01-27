/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
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
import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class VisualSettings extends DataViewObjectsParser {
  public starproperties: starproperties = new starproperties();
  public starStyle: starStyle = new starStyle();
  public stroke: stroke = new stroke();
  public starAnimation: starAnimation = new starAnimation();
  public dataLabel: dataLabel = new dataLabel();
}

export class starproperties {
  // Default indicator shape
  public visualSymbol: string = "star";
  // Default number of indicators
  public numStars: number = 5;
}

export class starStyle {
  // Default gradient show
  public showGradient: boolean = false;
  // Default indicator fill
  public starFill: string = "#FBB040";
  // Default indicator empty fill
  public emptyStarFill: string = "#E6E7E8";
  // Default gradient start color
  public gradientStartColor: string = "#FF0000";
  // Default gradient end color
  public gradientEndColor: string = "#00FF00";
}

export class stroke {
  // Default stroke show flag
  public show: boolean = false;
  // Default stroke width
  public strokeWidth: number = 2;
  // Default stroke color
  public starStroke: string = "#000000";
}

export class starAnimation {
  // Default animation show flag
  public show: boolean = true;
}

export class dataLabel {
  // Deafult data label show flag
  public show: boolean = true;
  // Deafult data label direction
  public direction: string = "down";
  // Deafult data label font color
  public fontColor: string = "#000000";
  // Deafult data label font family
  public fontFamily: string = "Segoe UI";
  // Deafult data label font size
  public fontSize: number = 20;
}
