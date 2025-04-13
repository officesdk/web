/**
 * 将对象的 path 上的属性值替换为指定值，
 * 并返回原来的值。
 * @param obj - 要替换的对象
 * @param path - 属性路径，使用点分隔符表示
 * @param value - 要替换的值
 * @returns - 原来的值
 */
export function swap(obj: any, path: string, value: any): any {
  let current = obj;

  const keys = path.split('.');

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  const originalValue = current[lastKey];
  current[lastKey] = value;

  return originalValue;
}
