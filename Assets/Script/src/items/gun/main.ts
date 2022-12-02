import { getCckClient } from "../../client/cckClient";
import { getStateClient } from "../../client/stateClient";
import {
  BULLET_MAX_COUNT,
  CHARGE_INTERVAL,
  SHOOT_INTERVAL,
} from "../../constants";
import { createThrottle } from "../../utils/throttle";

type State = {
  isUseDown: boolean;
  bulletChargeCount: number;
};

type Signal = "signal/action/shoot";

const stateClient = getStateClient<State>("gun");
const cckClient = getCckClient<Signal>();

const chargeThrottle = createThrottle("charge");
const shootThrottle = createThrottle("shoot");

const charge = (deltaTime: number) => {
  const isUseDown = stateClient.getState("isUseDown");
  if (!isUseDown) {
    return;
  }
  chargeThrottle(
    () => {
      const bulletChargeCount = stateClient.getState("bulletChargeCount") ?? 0;
      if (bulletChargeCount < BULLET_MAX_COUNT) {
        stateClient.setState("bulletChargeCount", bulletChargeCount + 1);
        $.log(`charge ${bulletChargeCount + 1}`);
      }
    },
    deltaTime,
    CHARGE_INTERVAL,
  );
};

const shoot = (deltaTime: number) => {
  const isUseDown = stateClient.getState("isUseDown");
  const bulletChargeCount = stateClient.getState("bulletChargeCount") ?? 0;
  if (isUseDown || bulletChargeCount <= 0) {
    return;
  }
  shootThrottle(
    () => {
      $.log(`shoot ${bulletChargeCount}`);
      cckClient.sendSignal("signal/action/shoot");
      stateClient.setState("bulletChargeCount", bulletChargeCount - 1);
    },
    deltaTime,
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
