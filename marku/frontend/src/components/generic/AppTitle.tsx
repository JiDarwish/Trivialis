import type { FC } from "react";

const AppTitle: FC = () => {
  return (
    <div className="pt-20 md:pt-24 lg:pt-32">
      <div className="font-dm-serif-display text-center text-6xl md:text-8xl lg:text-8xl soft-glow">meedle</div>
      <div className="font-dm-serif-display text-center md:text-lg lg:text-xl soft-glow">
        travel, together
      </div>
    </div>
  );
};

export default AppTitle;
