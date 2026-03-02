import React from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const location = useLocation();
  
  // 检查是否是游戏页面之间的切换（/game/level-1 -> /game/level-2）
  const isGameRoute = location.pathname.startsWith('/game/');
  
  // 为游戏页面使用不同的 key 策略
  // 游戏页面使用固定的 key，这样关卡切换时不会触发路由动画
  const animationKey = isGameRoute ? 'game' : location.pathname;
  
  return (
    <motion.div
      key={animationKey}
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        rotateX: 10,
        filter: 'blur(20px)',
        y: 50
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        y: 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 1.1,
        rotateX: -10,
        filter: 'blur(20px)',
        y: -50
      }}
      transition={{ 
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      style={{ 
        transformPerspective: 1200,
        transformStyle: 'preserve-3d'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
