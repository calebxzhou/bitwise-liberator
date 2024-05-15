import { ValidatorFn, AbstractControl } from '@angular/forms';
import { NumberAlias } from '@svgdotjs/svg.js';
import RandExp from 'randexp';

export function isValidMongoId(id: string) {
  const regex = new RegExp('^[0-9a-fA-F]{24}$');
  return regex.test(id);
}
export function getMongoIdValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = isValidMongoId(control.value);
    return isValid ? null : { invalid: 'id invalid' };
  };
}
export async function getImageDimensions(imgSrc: string) {
  const imgLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imgSrc;
  });

  try {
    const img = await imgLoadPromise;
    return { width: img.width, height: img.height };
  } catch (error) {
    console.error('Error loading image:', error);
    throw error;
  }
}

//空格分割 1/+空格
export function splitBySpaces(inputStr: string) {
  return inputStr.split(/\s+/);
}
export function splitByReturn(inputStr: string) {
  return inputStr
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
export function removeEmptyLines(input: string): string {
  // Split the input string into lines
  const lines = input.split('\n');

  // Filter out lines that are empty or contain only whitespace
  const filteredLines = lines.filter((line) => line.trim().length > 0);

  // Join the filtered lines back into a single string
  return filteredLines.join('\n');
}

//字符串居中填充
export function centerString(
  input: string,
  totalLength: number,
  fillChar: string = ' '
): string[] {
  // Function to calculate the display length of a string considering Chinese characters as double length
  const getDisplayLength = (str: string): number => {
    let displayLength = 0;
    for (const char of str) {
      // Assuming that Chinese characters fall into the Unicode range 0x4e00 to 0x9fff
      displayLength += char.match(/[\u4e00-\u9fff]/) ? 2 : 1;
    }
    return displayLength;
  };

  const inputDisplayLength = getDisplayLength(input);
  if (inputDisplayLength > totalLength) {
    // If the input display length is longer than the total length, we'll truncate it
    // This part of the function needs to be adjusted to handle Chinese characters properly
    return [input.substring(0, totalLength)];
  }

  const padding = totalLength - inputDisplayLength;
  const paddingLeft = Math.floor(padding / 2);
  const paddingRight = padding - paddingLeft;
  return [fillChar.repeat(paddingLeft), input, fillChar.repeat(paddingRight)];
}
export function trimBase64(b64: string) {
  return b64
    .replaceAll('data:image/jpeg;base64,', '')
    .replaceAll('data:image/png;base64,', '');
}
export function numberToCircle(num: number) {
  if (num < 1 || num > 10) {
    return 'Input should be a number between 1 and 10';
  }
  const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
  return circledNumbers[num - 1];
}
export function base64ToUint8Array(b64: string) {
  return Uint8Array.from(atob(trimBase64(b64)), (c) => c.charCodeAt(0));
}
export function extractChineseChars(inputString: string) {
  let chineseCharacters = inputString.match(/[\p{Script=Han}]/gu);
  return chineseCharacters ? chineseCharacters.join('') : '';
}
//[135][246] => [123456]
export function interleaveArrays<T>(array1: T[], array2: T[]) {
  // Create a new array to hold the result
  let result: T[] = [];

  // Use forEach to iterate over array1 and array2 simultaneously
  array1.forEach((element, index) => {
    // Add the current element from array1
    result.push(element);

    // Check if there's an element in array2 to add in the next odd position
    if (array2[index]) {
      // Add the element from array2 into the next odd position
      result.push(array2[index]);
    }
  });

  return result;
}

export function extractEnglishChars(inputString: string) {
  let englishCharacters = inputString.match(/[a-z_A-Z\s]/g);
  return englishCharacters ? englishCharacters.join('') : '';
}

export function extractNumbers(inputString: string) {
  let numbers = inputString.match(/\d+/g);
  return numbers ? numbers.join('') : '';
}
/**
 * 分离中英文 name id
 * @param input {string}
 * @returns {{name: (string|null), id: (string|null)}}
 */
export function matchIdName(input: string): {
  name: string | null;
  id: string | null;
} {
  let regex = /([\u4e00-\u9fa5]+)([a-zA-Z0-9.-_]+)/; // Matches Chinese characters followed by English characters
  let match = input.match(regex);

  return {
    name: match ? match[1] : null,
    id: match ? match[2] : null,
  };
}
export function centerOf(x: NumberAlias, y: NumberAlias) {
  return (Number(x) + Number(y)) / 2;
}
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
