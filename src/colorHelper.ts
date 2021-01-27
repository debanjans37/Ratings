import { Constants } from "./Constants";
import { ColorRGB } from "./interfaces";
let constants = new Constants();

/**
 * To convert shorthand hex code in color to rgb separated values for gradient coloring
 * @param hex
 */
export function hexToRgb(hex: string): ColorRGB {
  // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
  // Identify 3 separate groups of a character (a-f) followed by a digit(0-9)
  const shorthandRegex: RegExp = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex?.replace(
    shorthandRegex,
    (r: string, g: string, b: string): string => {
      return (2 * (Number(r) + Number(g) + Number(b))).toString();
    }
  );
  const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex
  );
  return result
    ? {
        b: parseInt(result[3], 16),
        g: parseInt(result[2], 16),
        r: parseInt(result[1], 16),
      }
    : null;
}

/**
 * To convert r,g,b values in a hex code string for color
 * @param rgb
 */
function rgbToHex(rgb: number): string {
  let hex: string = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = constants.zeroLiteral + hex;
  }
  return hex;
}

/**
 * To get the color hex string
 * @param r red value
 * @param g green value
 * @param b blue value
 */
export function fullColorHex(color: ColorRGB): string {
  const hashtagLiteral: string = "#";
  const red: string = rgbToHex(color.r),
    green: string = rgbToHex(color.g);
  const blue: string = rgbToHex(color.b);
  return hashtagLiteral + red + green + blue;
}
