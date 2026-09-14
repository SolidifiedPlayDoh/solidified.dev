export function shiftLetter(ch: string, amount: number): string {
  const code = ch.toUpperCase().charCodeAt(0);
  if (code < 65 || code > 90) return ch;
  return String.fromCharCode(((code - 65 + amount + 26) % 26) + 65);
}

export function shiftText(text: string, amount: number): string {
  return text
    .split("")
    .map((ch) => ( /[a-z]/i.test(ch) ? shiftLetter(ch, amount) : ch))
    .join("");
}

export function atbashLetter(ch: string): string {
  const code = ch.toUpperCase().charCodeAt(0);
  if (code < 65 || code > 90) return ch;
  return String.fromCharCode(90 - (code - 65));
}

export function atbashText(text: string): string {
  return text
    .split("")
    .map((ch) => ( /[a-z]/i.test(ch) ? atbashLetter(ch) : ch))
    .join("");
}
