export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntExcept(min: number, max: number, except: number) {
  if (except > max) {
    throw new Error('The excepted number is bigger than the maximum');
  }
  const number = getRandomInt(min, max - 1);
  if (number < except) return number;
  else return number + 1;
}
