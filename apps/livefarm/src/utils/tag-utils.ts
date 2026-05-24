import { tagOptions } from "@/constants/overview/constants";

export function findTagOption(tagName: string) {
  const exactMatch = tagOptions.find(
    (option) => option.label.toLowerCase() === tagName.toLowerCase()
  );

  if (exactMatch) return exactMatch;

  return tagOptions.find(
    (option) =>
      option.label.toLowerCase().includes(tagName.toLowerCase()) ||
      tagName.toLowerCase().includes(option.label.toLowerCase())
  );
}

export function getTagValues(tags: string[]): string[] {
  return tags
    .map((tag) => {
      const tagOption = findTagOption(tag);
      return tagOption?.value;
    })
    .filter((value) => value !== undefined) as string[];
}
