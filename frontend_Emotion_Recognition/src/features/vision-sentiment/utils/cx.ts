// vision-sentiment/utils/cx.ts
export const cx = (...a: Array<string | false | null | undefined>) =>
  a.filter(Boolean).join(" ");
