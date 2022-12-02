type HandName = "hour" | "minute" | "second";

type ClockHand = {
  nodeName: string;
  size: number;
  now: () => number;
};

const hands: Record<HandName, ClockHand> = {
  second: {
    nodeName: "SecondHand",
    now: () => (Date.now() / 1000) % 60,
    size: 60,
  },
  minute: {
    nodeName: "MinuteHand",
    now: () => ((Date.now() / 1000) % (60 * 60)) / 60,
    size: 60,
  },
  hour: {
    nodeName: "HourHand",
    now: () =>
      ((Date.now() / 1000) % (24 * 60 * 60)) / 3600 -
      new Date().getTimezoneOffset() / 60,
    size: 12,
  },
};

const updateClockHand = (handName: HandName) => {
  const hand = hands[handName];
  const handNode = $.subNode(hand.nodeName);
  if (handNode) {
    const axis = new Vector3(0, 0, -1.0);
    const rad = hand.now() * (360 / hand.size);
    handNode.setRotation(new Quaternion().setFromAxisAngle(axis, rad));
  }
};

$.onUpdate(() => {
  updateClockHand("hour");
  updateClockHand("minute");
  updateClockHand("second");
});
