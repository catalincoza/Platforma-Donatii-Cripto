import { useEffect, useState } from "react";

const FloatingParticles = ({ delay, duration, size, color, initialX, initialY }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const animateParticle = () => {
      setOpacity(1);
      setTimeout(() => {
        setPosition({
          x: Math.random() * window.innerWidth,
          y: -100
        });
        setOpacity(0);
      }, duration * 1000);
    };

    const interval = setInterval(animateParticle, (duration + delay) * 1000);
    setTimeout(animateParticle, delay * 1000);

    return () => clearInterval(interval);
  }, [delay, duration]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: opacity,
        transition: `all ${duration}s linear`,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default FloatingParticles