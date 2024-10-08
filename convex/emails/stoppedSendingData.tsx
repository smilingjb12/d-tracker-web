import * as React from "react";

interface Props {
  minutesSinceLastUpdate: number;
}

export const StoppedSendingData: React.FC<Readonly<Props>> = ({
  minutesSinceLastUpdate,
}) => (
  <div>
    <h1>
      Device stopped sending data. Minutes since last update:{" "}
      {minutesSinceLastUpdate}
    </h1>
  </div>
);
