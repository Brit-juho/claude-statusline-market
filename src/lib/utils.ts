export function getBase(): string {
  const b = import.meta.env.BASE_URL as string;
  return b.endsWith('/') ? b : b + '/';
}
