/**
 * Generates a Promise that resolves after a given timeout.
 * @param ms {Number} The timeout duration in milliseconds
 * @returns Promise object
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a random number within a given range.
 * @param min The lower limit
 * @param max The upper limit
 * @returns The generated number
 */
export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random number within a given range, excluding one other given number.
 * @param min The lower limit
 * @param max The upper limit
 * @param except The number to exclude
 * @returns The generated number
 */
export function getRandomNumberExcept(
  min: number,
  max: number,
  except: number
) {
  if (except > max) {
    throw new Error('The number to except is greater than the maximum');
  }
  const number = getRandomNumber(min, max - 1);
  if (number < except) return number;
  else return number + 1;
}

/**
 * Capitalize the first letter of a given string.
 * @param str The input string
 * @returns The capitalized string
 */
export function capitalizeFirstLetter(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}
