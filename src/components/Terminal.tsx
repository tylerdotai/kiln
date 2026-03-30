'use client';

import { useEffect, useRef, useState } from 'react';

interface TerminalProps {
  lines: string[];
  typingSpeed?: number;
  lineDelay?: number;
  prefix?: string;
  showHeader?: boolean;
  className?: string;
  autoPlay?: boolean;
}

export default function Terminal({
  lines,
  typingSpeed = 40,
  lineDelay = 800,
  prefix = 'kiln',
  showHeader = true,
  className = '',
  autoPlay = true,
}: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(autoPlay);
  const [cursorVisible, setCursorVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (!autoPlay) {
      setVisibleLines(lines);
      setIsTyping(false);
      return;
    }

    let lineIndex = 0;

    const typeLine = () => {
      if (lineIndex >= lines.length) {
        setIsTyping(false);
        return;
      }

      const line = lines[lineIndex];
      let charIndex = 0;
      const currentLine = '';

      const typeChar = () => {
        if (charIndex <= line.length) {
          setVisibleLines(prev => {
            const newLines = [...prev];
            newLines[lineIndex] = line.slice(0, charIndex);
            return newLines;
          });
          charIndex++;
          setTimeout(typeChar, typingSpeed);
        } else {
          lineIndex++;
          setTimeout(typeLine, lineDelay);
        }
      };

      // Initialize the line in state
      setVisibleLines(prev => {
        const newLines = [...prev];
        newLines[lineIndex] = '';
        return newLines;
      });
      typeChar();
    };

    const startDelay = setTimeout(typeLine, 500);
    return () => clearTimeout(startDelay);
  }, [lines, typingSpeed, lineDelay, autoPlay]);

  return (
    <div
      className={className}
      style={{
        background: '#1A1816',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(26, 24, 22, 0.3)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {showHeader && (
        <div style={{
          background: '#2a2724',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28CA41' }} />
          <span style={{
            marginLeft: 12,
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-body)',
          }}>
            {prefix}
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          padding: '20px 24px',
          minHeight: 160,
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        {visibleLines.map((line, i) => (
          <div key={i} style={{ color: '#F9F7F4', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {line}
            {i === visibleLines.length - 1 && isTyping && (
              <span style={{
                display: 'inline-block',
                width: 8,
                height: 16,
                background: '#F9F7F4',
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                opacity: cursorVisible ? 1 : 0,
              }} />
            )}
          </div>
        ))}
        {!isTyping && visibleLines.length > 0 && (
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 16,
            background: '#F9F7F4',
            marginLeft: 2,
            verticalAlign: 'text-bottom',
            opacity: cursorVisible ? 1 : 0,
          }} />
        )}
      </div>
    </div>
  );
}
