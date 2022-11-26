export const getStateClient = <T extends StateProxy>(base: string) => ({
  setState: <S extends keyof T>(key: S, value: T[S]): void => {
    $.state[`${base}_${key as string}`] = value;
  },
  getState: <S extends keyof T>(key: S): T[S] | undefined => {
    return $.state[`${base}_${key as string}`] as T[S] | undefined;
  },
});
