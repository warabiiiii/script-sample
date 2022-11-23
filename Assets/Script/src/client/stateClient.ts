export const getStateClient = <T extends StateProxy>() => ({
  setState: <S extends keyof T>(key: S, value: T[S]): void => {
    $.state[key as string] = value;
  },
  getState: <S extends keyof T>(key: S): T[S] | undefined => {
    return $.state[key as string] as T[S] | undefined;
  },
});
