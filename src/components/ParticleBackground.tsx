import React from 'react';
import { motion } from 'framer-motion';

const ParticleBackground: React.FC = () => {
  // Generate particles with different types and enhanced properties
  const particles = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 2,
    duration: Math.random() * 30 + 20,
    delay: Math.random() * 40,
    type: Math.random() > 0.6 ? 'glow' : Math.random() > 0.3 ? 'pulse' : 'normal',
    color: ['cyan', 'blue', 'purple', 'pink', 'teal'][Math.floor(Math.random() * 5)],
  }));

  // Enhanced DNA helix points with more complexity
  const dnaPoints = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 12 + Math.sin(i * 0.4) * 10,
    y: i * 3.5,
    size: Math.random() * 4 + 2,
    delay: i * 0.15,
    intensity: Math.random() * 0.5 + 0.5,
  }));

  const dnaPoints2 = Array.from({ length: 30 }, (_, i) => ({
    id: i + 30,
    x: 88 + Math.sin(i * 0.4 + Math.PI) * 10,
    y: i * 3.5,
    size: Math.random() * 4 + 2,
    delay: i * 0.15 + 0.7,
    intensity: Math.random() * 0.5 + 0.5,
  }));

  // Enhanced molecular clusters with more variety
  const molecularClusters = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: [15, 85, 30, 70, 8, 92, 45, 55][i],
    y: [20, 80, 65, 35, 90, 10, 50, 25][i],
    size: Math.random() * 50 + 30,
    rotation: Math.random() * 360,
    duration: Math.random() * 50 + 40,
    orbitals: Math.floor(Math.random() * 4) + 4,
  }));

  // Floating geometric shapes with enhanced variety
  const geometricShapes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 30 + 15,
    rotation: Math.random() * 360,
    duration: Math.random() * 60 + 30,
    shape: ['hexagon', 'triangle', 'diamond', 'circle'][Math.floor(Math.random() * 4)],
    color: ['cyan', 'blue', 'purple', 'pink', 'teal', 'green'][Math.floor(Math.random() * 6)],
  }));

  const getColorClasses = (color: string, type: 'bg' | 'border' | 'shadow') => {
    const colorMap = {
      cyan: { bg: 'bg-cyan-400', border: 'border-cyan-400', shadow: 'shadow-cyan-400' },
      blue: { bg: 'bg-blue-400', border: 'border-blue-400', shadow: 'shadow-blue-400' },
      purple: { bg: 'bg-purple-400', border: 'border-purple-400', shadow: 'shadow-purple-400' },
      pink: { bg: 'bg-pink-400', border: 'border-pink-400', shadow: 'shadow-pink-400' },
      teal: { bg: 'bg-teal-400', border: 'border-teal-400', shadow: 'shadow-teal-400' },
      green: { bg: 'bg-green-400', border: 'border-green-400', shadow: 'shadow-green-400' },
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || colorMap.cyan[type];
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Enhanced gradient background with more depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Multiple animated gradient orbs with enhanced effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
          x: [0, 80, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.8, 0.4],
          x: [0, -60, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 7,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-gradient-to-r from-teal-500/10 to-green-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
          x: [0, -40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 15,
        }}
      />

      {/* Enhanced floating particles with varied effects */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.type === 'glow' 
              ? `bg-gradient-to-r from-${particle.color}-400/60 to-${particle.color}-300/60 shadow-lg shadow-${particle.color}-400/30` 
              : particle.type === 'pulse'
              ? `${getColorClasses(particle.color, 'bg')}/40 shadow-md ${getColorClasses(particle.color, 'shadow')}/20`
              : 'bg-white/30 shadow-sm'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: particle.type === 'pulse' ? [0, 1, 0.3, 1, 0] : [0, 0.9, 0],
            scale: particle.type === 'glow' ? [0.5, 2, 0.5] : [0.3, 1.8, 0.3],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Enhanced DNA Helix Structures with connecting lines */}
      <div className="absolute left-0 top-0 w-full h-full">
        {/* DNA backbone connections */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {dnaPoints.slice(0, -1).map((point, i) => (
            <motion.line
              key={`line1-${i}`}
              x1={`${point.x}%`}
              y1={`${point.y}%`}
              x2={`${dnaPoints[i + 1].x}%`}
              y2={`${dnaPoints[i + 1].y}%`}
              stroke="url(#gradient1)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            />
          ))}
          {dnaPoints2.slice(0, -1).map((point, i) => (
            <motion.line
              key={`line2-${i}`}
              x1={`${point.x}%`}
              y1={`${point.y}%`}
              x2={`${dnaPoints2[i + 1].x}%`}
              y2={`${dnaPoints2[i + 1].y}%`}
              stroke="url(#gradient2)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 2, delay: i * 0.1 + 0.5 }}
            />
          ))}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* DNA points with enhanced glow */}
        {dnaPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute bg-cyan-400/50 rounded-full shadow-lg shadow-cyan-400/30"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: point.size,
              height: point.size,
            }}
            animate={{
              y: [0, -3, 0],
              opacity: [0.3 * point.intensity, 1 * point.intensity, 0.3 * point.intensity],
              scale: [0.8, 1.4, 0.8],
              boxShadow: [
                `0 0 10px rgba(6, 182, 212, ${0.3 * point.intensity})`,
                `0 0 20px rgba(6, 182, 212, ${0.6 * point.intensity})`,
                `0 0 10px rgba(6, 182, 212, ${0.3 * point.intensity})`
              ],
            }}
            transition={{
              duration: 4,
              delay: point.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {dnaPoints2.map((point) => (
          <motion.div
            key={point.id}
            className="absolute bg-blue-400/50 rounded-full shadow-lg shadow-blue-400/30"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: point.size,
              height: point.size,
            }}
            animate={{
              y: [0, -3, 0],
              opacity: [0.3 * point.intensity, 1 * point.intensity, 0.3 * point.intensity],
              scale: [0.8, 1.4, 0.8],
              boxShadow: [
                `0 0 10px rgba(59, 130, 246, ${0.3 * point.intensity})`,
                `0 0 20px rgba(59, 130, 246, ${0.6 * point.intensity})`,
                `0 0 10px rgba(59, 130, 246, ${0.3 * point.intensity})`
              ],
            }}
            transition={{
              duration: 4,
              delay: point.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Enhanced Molecular Clusters with more complex orbital patterns */}
      {molecularClusters.map((cluster) => (
        <motion.div
          key={cluster.id}
          className="absolute"
          style={{
            left: `${cluster.x}%`,
            top: `${cluster.y}%`,
            width: cluster.size,
            height: cluster.size,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: cluster.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Enhanced central atom with glow */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"
            animate={{
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 10px rgba(6, 182, 212, 0.5)',
                '0 0 20px rgba(6, 182, 212, 0.8)',
                '0 0 10px rgba(6, 182, 212, 0.5)'
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Enhanced orbital electrons with varied paths */}
          {Array.from({ length: cluster.orbitals }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full shadow-md shadow-blue-400/40"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                x: [
                  0, 
                  Math.cos(i * (360 / cluster.orbitals) * Math.PI / 180) * (cluster.size / 2.2),
                  Math.cos((i * (360 / cluster.orbitals) + 180) * Math.PI / 180) * (cluster.size / 2.2),
                  0
                ],
                y: [
                  0, 
                  Math.sin(i * (360 / cluster.orbitals) * Math.PI / 180) * (cluster.size / 2.2),
                  Math.sin((i * (360 / cluster.orbitals) + 180) * Math.PI / 180) * (cluster.size / 2.2),
                  0
                ],
                opacity: [0.4, 1, 0.4, 1],
                scale: [0.8, 1.2, 0.8, 1.2],
              }}
              transition={{
                duration: 6,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Enhanced floating geometric shapes */}
      {geometricShapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute opacity-15"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            rotate: shape.shape === 'circle' ? [0, 360] : [-180, 180],
            scale: [1, 1.3, 1],
            x: [0, Math.sin(shape.id) * 30, 0],
            y: [0, Math.cos(shape.id) * 20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {shape.shape === 'hexagon' && (
            <div className={`w-full h-full ${getColorClasses(shape.color, 'border')}/60 border-2 relative`} style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}>
              <div className={`absolute top-1 left-1 w-2 h-2 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
              <div className={`absolute bottom-1 right-1 w-2 h-2 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
            </div>
          )}
          {shape.shape === 'triangle' && (
            <div className={`w-full h-full ${getColorClasses(shape.color, 'border')}/60 border-2 relative`} style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}>
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
            </div>
          )}
          {shape.shape === 'diamond' && (
            <div className={`w-full h-full ${getColorClasses(shape.color, 'border')}/60 border-2 relative transform rotate-45`}>
              <div className={`absolute top-1 left-1 w-2 h-2 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
              <div className={`absolute bottom-1 right-1 w-2 h-2 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
            </div>
          )}
          {shape.shape === 'circle' && (
            <div className={`w-full h-full ${getColorClasses(shape.color, 'border')}/60 border-2 rounded-full relative`}>
              <div className={`absolute top-1 left-1 w-2 h-2 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
              <div className={`absolute bottom-1 right-1 w-2 h-2 ${getColorClasses(shape.color, 'bg')}/80 rounded-full`} />
            </div>
          )}
        </motion.div>
      ))}

      {/* Enhanced energy field lines with wave patterns */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`energy-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
            style={{
              top: `${(i + 1) * 8}%`,
              left: '0%',
              width: '100%',
            }}
            animate={{
              opacity: [0, 0.7, 0],
              scaleX: [0, 1.2, 0],
              x: ['-100%', '0%', '100%'],
            }}
            transition={{
              duration: 12,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Vertical energy lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={`energy-v-${i}`}
            className="absolute w-px bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"
            style={{
              left: `${(i + 1) * 12}%`,
              top: '0%',
              height: '100%',
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scaleY: [0, 1.3, 0],
              y: ['-100%', '0%', '100%'],
            }}
            transition={{
              duration: 15,
              delay: i * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Enhanced grid pattern with animated intersections */}
      <div className="absolute inset-0 opacity-8">
        <div className="w-full h-full relative" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}>
          {/* Animated grid intersections */}
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={`intersection-${i}`}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              style={{
                left: `${(i % 5) * 20 + 10}%`,
                top: `${Math.floor(i / 5) * 25 + 12.5}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 4,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Ambient light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
            style={{
              width: '200%',
              height: '2px',
              left: '-50%',
              top: `${20 + i * 15}%`,
              transformOrigin: 'center',
              transform: `rotate(${-30 + i * 12}deg)`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 20 + i * 5,
              delay: i * 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleBackground;