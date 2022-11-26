import { getCckClient } from "../../client/cckClient";
import { getStateClient } from "../../client/stateClient";
import {
  BULLET_MAX_COUNT,
  CHARGE_INTERVAL,
  SHOOT_INTERVAL,
} from "../../constants";
import { throttle } from "../../utils/throttle";

type State = {
  isUseDown: boolean;
  chargeCount: number;
};
type Signal = "signal/action/shoot";

const stateClient = getStateClient<State>("gun");
const cckClient = getCckClient<Signal>();

const charge = (deltaTime: number) => {
  const isUseDown = stateClient.getState("isUseDown");
  if (!isUseDown) {
    return;
  }
  throttle(
    "charge",
    deltaTime,
    () => {
      const currentCount = stateClient.getState("chargeCount") ?? 0;
      if (currentCount < BULLET_MAX_COUNT) {
        stateClient.setState("chargeCount", currentCount + 1);
        $.log(`charge ${currentCount + 1}`);
      }
    },
    CHARGE_INTERVAL,
  );
};
const shoot = (deltaTime: number) => {
  const isUseDown = stateClient.getState("isUseDown");
  const chargeCount = stateClient.getState("chargeCount") ?? 0;
  if (isUseDown || chargeCount <= 0) {
    return;
  }
  throttle(
    "shoot",
    deltaTime,
    () => {
      $.log(`shoot ${chargeCount}`);
      cckClient.sendSignal("signal/action/shoot");
      stateClient.setState("chargeCount", chargeCount - 1);
    },
    SHOOT_INTERVAL,
  );
};

$.onUpdate((deltaTime) => {
  charge(deltaTime);
  shoot(deltaTime);
});

$.onUse((isDown) => {
  stateClient.setState("isUseDown", isDown);
});
