import { getStateClient } from "../client/stateClient";

type State = {
  passedTime: number;
};

export const throttle = (
  key: string,
  deltaTime: number,
  fn: () => void,
  waitSecond: number,
) => {
  const stateClient = getStateClient<State>(`throttle_${key}`);
  const currentPassedTime = stateClient.getState("passedTime") ?? 0;
  const nextPassedTime = currentPassedTime + deltaTime;
  stateClient.setState("passedTime", nextPassedTime);
  if (nextPassedTime >= waitSecond) {
    stateClient.setState("passedTime", 0);
    fn();
  }
};
