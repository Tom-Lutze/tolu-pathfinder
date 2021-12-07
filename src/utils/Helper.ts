export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomNumberExcept(
  min: number,
  max: number,
  except: number
) {
  if (except > max) {
    throw new Error('The excepted number is bigger than the maximum');
  }
  const number = getRandomNumber(min, max - 1);
  if (number < except) return number;
  else return number + 1;
}

export function capitalizeFirstLetter(str: string) {
  return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}
