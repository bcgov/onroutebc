export type Optional<T> = T | undefined;
export type RequiredOrNull<T> = T | null;
export type Nullable<T> = Optional<RequiredOrNull<T>>;
export type NullableFields<T> = {
  [P in keyof T]?: Nullable<T[P]>;
};