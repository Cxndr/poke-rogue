export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function ProperName(name: string) {
  let result = name.toLowerCase();
  result = result.replace(/[^a-z0-9]/g, " ");
  result = result.replace(/\b\w/g, (char) => char.toUpperCase());
  return result;
}