// Persian number conversion utility
const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianNumber(input: string | number): string {
  let str = input.toString();
  for (let i = 0; i < englishNumbers.length; i++) {
    str = str.replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i]);
  }
  return str;
}

export function toEnglishNumber(input: string): string {
  let str = input;
  for (let i = 0; i < persianNumbers.length; i++) {
    str = str.replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i]);
  }
  return str;
}

export function formatPersianNumber(num: number): string {
  return toPersianNumber(num.toLocaleString('fa-IR'));
}