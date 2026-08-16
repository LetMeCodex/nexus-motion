import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animFrame;

    const handleMouseMove = (e) => {
      setVisible(true);
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.getAttribute('data-cursor') === 'hover'
      ) {
        setCursorState('hover');
      } else if (target.getAttribute('data-cursor') === 'drag') {
        setCursorState('drag');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const updateTrailing = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22,
      }));
      animFrame = requestAnimationFrame(updateTrailing);
    };

    animFrame = requestAnimationFrame(updateTrailing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, [pos.x, pos.y]);

  if (!visible) return null;

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      <div
        className={`custom-cursor-ring ${
          cursorState === 'hover'
            ? 'cursor-hover'
            : cursorState === 'drag'
            ? 'cursor-drag'
            : ''
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  );
}
