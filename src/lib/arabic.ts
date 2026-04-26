const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function formatArabicDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  return `${toArabicDigits(d.getDate())} ${ARABIC_MONTHS[d.getMonth()]} ${toArabicDigits(d.getFullYear())}`;
}
