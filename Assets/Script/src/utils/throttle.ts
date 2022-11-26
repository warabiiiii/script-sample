import { getStateClient } from "../client/stateClient";

type State = {
  passedTime: number;
};

export const createThrottle = (
  key: string,
): ((fn: () => void, deltaTime: number, waitSecond: number) => void) => {
  const stateClient = getStateClient<State>(`throttle_${key}`);
  return (fn, deltaTime, waitSecond) => {
    const currentPassedTime = stateClient.getState("passedTime") ?? 0;
    const nextPassedTime = currentPassedTime + deltaTime;
    stateClient.setState("passedTime", nextPassedTime);
    if (nextPassedTime >= waitSecond) {
      stateClient.setState("passedTime", 0);
      fn();
    }
  };
};
