import { useEffect, useState } from "react";
import FloatingParticles from "./FloatingParticles"

const Layout = ({children}) => {
      const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
        const [particles, setParticles] = useState([]);
      
    
      useEffect(() => {
    const particleArray = [];
    for (let i = 0; i < 15; i++) {
      particleArray.push({
        id: i,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 4,
        size: 4 + Math.random() * 8,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
        initialX: Math.random() * window.innerWidth,
        initialY: window.innerHeight + 100
      });
    }
    setParticles(particleArray);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

    return ( 
<div 
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
      }}
    >
        {particles?.map(particle => (
        <FloatingParticles
          key={particle.id}
          delay={particle.delay}
          duration={particle.duration}
          size={particle.size}
          color={particle.color}
          initialX={particle.initialX}
          initialY={particle.initialY}
        />
      ))}
      <div
        style={{
          position: 'fixed',
          left: mousePosition.x - 15,
          top: mousePosition.y - 15,
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'all 0.1s ease-out',
          mixBlendMode: 'overlay',
        }}
      />

      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          top: '10%',
          left: '5%',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          zIndex: 0,
          animation: 'rotate 20s linear infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          bottom: '5%',
          right: '5%',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          zIndex: 0,
          animation: 'counterRotate 15s linear infinite, pulse 4s ease-in-out infinite',
        }}
      />

      {/* Gradient overlay animat */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          zIndex: 1,
          animation: 'fadeInOut 4s ease-in-out infinite',
        }}
      />
      {children}
    </div>
    )
}

export default Layout