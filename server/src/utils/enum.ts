export function getEnumValue<T>(enumType: T, value: string): T[keyof T] {
  return enumType[value as keyof T];
}
