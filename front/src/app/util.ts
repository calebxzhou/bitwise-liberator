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
