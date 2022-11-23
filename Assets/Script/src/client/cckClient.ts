type StateCompat = {
  signal: Date;
  boolean: boolean;
  float: number;
  double: number;
  integer: number;
  vector2: Vector2;
  vector3: Vector3;
};

export const getCckClient = <T extends string>() => ({
  sendSignal: (key: T): void => {
    $.sendSignalCompat("this", key);
  },
  setStateCompat: (key: T, value: CompatSendable): void => {
    $.setStateCompat("this", key, value);
  },
  getStateCompat: <C extends CompatParamType>(
    key: T,
    type: C,
  ): StateCompat[C] | undefined => {
    const stateCompat = $.getStateCompat("this", key, type);

    switch (type) {
      case "signal": {
        if (stateCompat instanceof Date && stateCompat.getTime() > 0) {
          return stateCompat as StateCompat[C];
        }
        return undefined;
      }
      default: {
        return stateCompat as StateCompat[C] | undefined;
      }
    }
  },
});
