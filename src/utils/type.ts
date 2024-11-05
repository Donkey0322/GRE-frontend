import type { JSXElementConstructor, Key } from "react";

export type NestedKeys<T> = T extends Record<string | number, object | string>
  ? {
      [K in keyof T]: K extends "route" // Check if K is "route"
        ? never
        :
            | Extract<K, string | number>
            | `${Extract<K, string | number>}.${NestedKeys<T[K]>}`;
    }[keyof T]
  : never;

export type AllKeys<T> = T extends Record<string | number, unknown>
  ? {
      [K in keyof T]: K extends "route"
        ? never
        : Extract<K, string | number> | AllKeys<T[K]>;
    }[keyof T]
  : never;

export type Type<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> = React.ComponentProps<T>;

export type TableItemType<T> = T & {
  key: Key;
};
