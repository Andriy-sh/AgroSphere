export function getAvatarFallback(name?: string, surname?: string) {
  const nameChar = name?.charAt(0) || '';
  const surnameChar = surname?.charAt(0) || '';
  return `${surnameChar}${nameChar}`;
}
