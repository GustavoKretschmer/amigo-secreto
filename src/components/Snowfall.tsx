import { useMemo, type CSSProperties } from 'react';

const SNOWFLAKE_COUNT = 40;

interface Snowflake {
  id: number;
  style: CSSProperties;
}

function createSnowflake(id: number): Snowflake {
  const size = 2 + Math.random() * 5;
  return {
    id,
    style: {
      left: `${Math.random() * 100}%`,
      width: size,
      height: size,
      opacity: 0.25 + Math.random() * 0.55,
      animationDuration: `${9 + Math.random() * 14}s`,
      animationDelay: `${-Math.random() * 20}s`,
    },
  };
}

export function Snowfall() {
  const snowflakes = useMemo(() => Array.from({ length: SNOWFLAKE_COUNT }, (_, id) => createSnowflake(id)), []);
  return (
    <div className="snowfall" aria-hidden="true">
      {snowflakes.map((snowflake) => (
        <span key={snowflake.id} className="snowflake" style={snowflake.style} />
      ))}
    </div>
  );
}
