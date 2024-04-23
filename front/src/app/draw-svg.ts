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
export function drawEllipseWithText(
  svg: Svg,
  x: number,
  y: number,
  textString: string
): EllipseShape {
  // Create group to hold the ellipse and text
  const group = svg.group();

  // Create text element and add it to the group
  const text = group
    .text(textString)
    .move(x - getHorizontalTextWidth(textString) / 2, y - 8);
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
    .stroke({ width: 1, color: 'black' });

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

// Define the IActorShape interface
export interface ActorShape {
  armLx: number;
  armLy: number;
  armRx: number;
  armRy: number;
}

// Define constants for actor dimensions
const ACTOR_BODY_HEIGHT: number = 15;
const ACTOR_HEAD_DIAMETER: number = 20;
const ACTOR_ARM_LEN: number = 30;

// Function to draw the actor at the center
export function drawActorCenter(
  draw: Svg,
  text: string,
  cenX: number,
  cenY: number
): ActorShape {
  return drawActor(
    draw,
    text,
    cenX - ACTOR_ARM_LEN / 2,
    cenY - (ACTOR_BODY_HEIGHT + ACTOR_HEAD_DIAMETER) / 2
  );
}

// Function to draw the actor
export function drawActor(
  draw: Svg,
  text: string,
  x: number,
  y: number
): ActorShape {
  // Draw the head
  const headX = x - ACTOR_HEAD_DIAMETER / 2;
  const headY = y;
  draw
    .ellipse(ACTOR_HEAD_DIAMETER, ACTOR_HEAD_DIAMETER)
    .fill('white')
    .stroke({ width: 1, color: 'black' })
    .move(headX, headY);

  // Draw the body
  const bodyX = x;
  const bodyY = headY + ACTOR_HEAD_DIAMETER;
  draw
    .line(bodyX, bodyY, bodyX, bodyY + ACTOR_BODY_HEIGHT)
    .stroke({ width: 1, color: 'black' });

  // Draw the arms
  const leftArmX = bodyX - ACTOR_ARM_LEN / 2;
  const armY = bodyY + ACTOR_BODY_HEIGHT / 3;
  const rightArmX = bodyX + ACTOR_ARM_LEN / 2;
  draw
    .line(leftArmX, armY, rightArmX, armY)
    .stroke({ width: 1, color: 'black' });

  // Draw the legs
  const legY = bodyY + ACTOR_BODY_HEIGHT;
  const leftLegX = leftArmX;
  const rightLegX = rightArmX;
  draw
    .line(bodyX, legY, leftLegX, legY + ACTOR_ARM_LEN / 2)
    .stroke({ width: 1, color: 'black' });
  draw
    .line(bodyX, legY, rightLegX, legY + ACTOR_ARM_LEN / 2)
    .stroke({ width: 1, color: 'black' });

  // Draw the text
  draw
    .text(text)
    .move(
      bodyX - getHorizontalTextWidth(text) / 2,
      bodyY + ACTOR_BODY_HEIGHT + ACTOR_ARM_LEN
    );

  // Return the actor shape data
  return { armLx: leftArmX, armLy: armY, armRx: rightArmX, armRy: armY };
}
//设定字体 中文宋体 英文罗马
export function setupFont(svg: Svg) {
  svg.defs().element('style').words(`//中文宋体 英文罗马
    @font-face {
      font-family: 'MyFont';
      src: local('Times New Roman');
      unicode-range: U+30-39, U+41-5A, U+61-7A; 
  }
  
  @font-face {
      font-family: 'MyFont';
      src: local('SimSun');
      unicode-range: U+4E00-9FFF; 
  }`);
  svg.font('family', 'MyFont');
}
// Define the Point2D interface
export interface Point2D {
  x: number;
  y: number;
}

// Define the RhombusShape interface
export interface RhombusShape {
  width: number;
  height: number;
  xLeft: Point2D;
  xRight: Point2D;
  yUp: Point2D;
  yDown: Point2D;
}

// Function to create a point (helper function)
export function pointOf(x: number, y: number): Point2D {
  return { x, y };
}

// Function to draw a rhombus with text inside it
export function drawRhombusWithText(
  draw: Svg,
  text: string,
  centerX: number,
  centerY: number
): RhombusShape {
  const textWidth = getHorizontalTextWidth(text);
  const textHeight = 10; // Set a fixed text height or calculate it
  const padding = 20;

  const yUp = pointOf(centerX, centerY - textHeight / 2 - padding);
  const xLeft = pointOf(centerX - textWidth / 2 - padding, centerY);
  const yDown = pointOf(centerX, centerY + textHeight / 2 + padding);
  const xRight = pointOf(centerX + textWidth / 2 + padding, centerY);

  const width = xRight.x - xLeft.x;
  const height = yDown.y - yUp.y;

  // Create the rhombus shape using svg.js
  const rhombus = draw
    .polygon([
      [yUp.x, yUp.y],
      [xLeft.x, xLeft.y],
      [yDown.x, yDown.y],
      [xRight.x, xRight.y],
    ])
    .fill('white')
    .stroke({ color: 'black', width: 1 });

  // Add the text to the center of the rhombus
  draw.text(text).move(centerX - textWidth / 2, centerY - textHeight / 2);

  return {
    width,
    height,
    xLeft,
    xRight,
    yUp,
    yDown,
  };
}
export function drawTextAlongLine(
  draw: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  ...text: string[]
): void {
  // Calculate the line's length
  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  // Calculate the positions for the text
  const oneFifthLength = lineLength / 5;
  const fourFifthsLength = (4 * lineLength) / 5;

  // Calculate the direction vector of the line
  const directionVector = {
    x: (x2 - x1) / lineLength,
    y: (y2 - y1) / lineLength,
  };

  // Calculate the text positions
  const textPos1 = {
    x: x1 + oneFifthLength * directionVector.x,
    y: y1 + oneFifthLength * directionVector.y,
  };
  const textPos2 = {
    x: x1 + fourFifthsLength * directionVector.x,
    y: y1 + fourFifthsLength * directionVector.y,
  };

  // Draw the text at the 1/5 position
  draw.text(text[0]).move(textPos1.x, textPos1.y);

  // Draw the text at the 4/5 position
  draw.text(text[1]).move(textPos2.x, textPos2.y);
}
