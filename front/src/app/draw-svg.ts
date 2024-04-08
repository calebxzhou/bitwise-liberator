import { Svg, Rect, SVG, NumberAlias, Line } from '@svgdotjs/svg.js';

/**
 * 垂直文字高度
 * @param svg svg
 * @param text 文字
 * @returns 高度
 */
export function getVerticalTextHeight(text: string) {
  // Create a temporary SVG element and add it to the DOM
  const tempSvg = SVG().addTo('body').size(0, 0);
  tempSvg.style().rule('visibility', 'hidden');

  // Add text to the SVG
  const textElement = tempSvg.text((add) => {
    text.split('').forEach((char) => {
      add.tspan(char).newLine();
    });
  });

  // Calculate the height
  const height = textElement.bbox().height;

  // Remove the temporary SVG element from the DOM
  tempSvg.remove();

  return height;
}
/**
 * 水平文字宽度
 * @param svg svg
 * @param text 文字
 * @returns 宽度
 */
export function getHorizontalTextWidth(text: string) {
  // Create a temporary SVG element and add it to the DOM
  const tempSvg = SVG().addTo('body').size(0, 0);
  tempSvg.style().rule('visibility', 'hidden');

  // Add text to the SVG
  const textElement = tempSvg.text(text);

  // Calculate the height
  const width = textElement.bbox().width;

  // Remove the temporary SVG element from the DOM
  tempSvg.remove();

  return width;
}
/**
 * 文字矩形
 * @param svg
 * @param position 位置xy
 * @param size 矩形尺寸 宽高（未指定自动计算）
 * @param text 文字
 * @param isTextVertical 垂直文字
 * @returns 矩形
 */
export function drawRectangleWithText(
  svg: Svg,
  position: { x: number; y: number },
  size: { width: number | undefined; height: number | undefined } | undefined,
  text: string,
  isTextVertical: boolean
): Rect {
  // Create the text element with vertical alignment
  const textElement = svg
    .text((add) => {
      if (isTextVertical) {
        // Draw vertical text
        text.split('').forEach((char, index) => {
          add.tspan(char).newLine();
        });
      } else {
        // Draw horizontal text
        add.tspan(text);
      }
    })
    .move(position.x, position.y);

  // Calculate the bounding box of the text element
  const bbox = textElement.bbox();

  // Draw the rectangle based on the text element's bounding box
  let rectW = size?.width ?? bbox.width + 16;
  let rectH = size?.height ?? bbox.height + 14;

  const rect = svg
    .rect(rectW, rectH)
    .move(position.x - 8, position.y - 7)
    .fill('none')
    .stroke({ color: '#000', width: 1 });

  // Ensure the text is on top of the rectangle
  textElement.front();

  return rect;
}
//画线
export function drawLine(
  svg: Svg,
  x1: NumberAlias,
  y1: NumberAlias,
  x2: NumberAlias,
  y2: NumberAlias
) {
  return svg
    .line(Number(x1), Number(y1), Number(x2), Number(y2))
    .stroke({ width: 1, color: 'black' });
}
export function getLineStartPoint(line: Line) {
  const points = line.array().valueOf();
  // The x and y coordinates of the start point
  const startX = points[0][0];
  const startY = points[0][1];
  return { x: startX, y: startY };
}
export function getLineEndPoint(line: Line) {
  const points = line.array().valueOf();
  // The x and y coordinates of the end point
  const endX = points[1][0];
  const endY = points[1][1];
  return { x: endX, y: endY };
}
export interface EllipseShape {
  xLeft: number;
  xRight: number;
  yUp: number;
  yDown: number;
}
//画带字椭圆
function drawEllipse(
  svg: Svg,
  x: number,
  y: number,
  textString: string
): EllipseShape {
  // Create group to hold the ellipse and text
  const group = svg.group();

  // Create text element and add it to the group
  const text = group.text(textString).move(x, y);
  const textSize = text.bbox();

  // Calculate ellipse size based on text dimensions
  const padding = 10; // Adjust padding as needed
  const ellipseWidth = textSize.width + padding * 2;
  const ellipseHeight = textSize.height + padding * 2;

  // Draw the ellipse with no fill and add it to the group
  const ellipse = group
    .ellipse(ellipseWidth, ellipseHeight)
    .center(x, y)
    .fill('none')
    .stroke({ width: 1 });

  // Return the four points of the ellipse
  const bbox = ellipse.bbox();
  return {
    xLeft: bbox.x,
    xRight: bbox.x2,
    yUp: bbox.y,
    yDown: bbox.y2,
  };
}
//画带字小人
