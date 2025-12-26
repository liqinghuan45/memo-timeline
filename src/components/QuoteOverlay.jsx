import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const quotes = [
  { text: "逝者如斯夫，不舍昼夜", author: "孔子", era: "公元前551年" },
  { text: "Time is the substance I am made of", author: "Borges", era: "1899-1986" },
  { text: "往事不可谏，来者犹可追", author: "《论语》", era: "" },
  { text: "人生天地之间，若白驹过隙", author: "庄子", era: "公元前369年" },
  { text: "We are such stuff as dreams are made on", author: "Shakespeare", era: "1564-1616" },
  { text: "盛年不重来，一日难再晨", author: "陶渊明", era: "365-427" },
  { text: "今人不见古时月，今月曾经照古人", author: "李白", era: "701-762" },
  { text: "此情可待成追忆，只是当时已惘然", author: "李商隐", era: "813-858" },
  { text: "人生到处知何似，应似飞鸿踏雪泥", author: "苏轼", era: "1037-1101" },
]

function splitText(text) {
  const result = []
  let i = 0
  while (i < text.length) {
    const char = text[i]
    if (/[a-zA-Z]/.test(char)) {
      let word = ''
      while (i < text.length && /[a-zA-Z']/.test(text[i])) {
        word += text[i]
        i++
      }
      result.push(word)
    } else {
      result.push(char)
      i++
    }
  }
  return result
}

// 逐字出现动画
function AnimatedText({ text, isLeaving }) {
  const chars = splitText(text)

  // 消失时整体模糊，不逐字
  if (isLeaving) {
    return <span>{text}</span>
  }

  return (
    <span>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(8px)', y: 4 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{
            duration: 0.5,
            delay: i * 0.08,
            ease: "easeOut"
          }}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

// 消散后的漂浮粒子 - 从文字区域散开
function DissipateParticles({ rect, onComplete }) {
  const particles = useRef(
    [...Array(12)].map(() => ({
      // 从文字区域内的随机位置开始
      startX: (Math.random() - 0.5) * (rect?.width || 100),
      startY: (Math.random() - 0.5) * (rect?.height || 30),
      // 向外飘散
      endX: (Math.random() - 0.5) * 200,
      endY: -30 - Math.random() * 80,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 0.8,
      duration: 4 + Math.random() * 3
    }))
  ).current

  useEffect(() => {
    const maxDuration = Math.max(...particles.map(p => p.delay + p.duration))
    const timer = setTimeout(onComplete, maxDuration * 1000 + 500)
    return () => clearTimeout(timer)
  }, [])

  if (!rect) return null

  return (
    <div 
      className="fixed pointer-events-none"
      style={{ left: rect.x, top: rect.y }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-foreground/25"
          initial={{ x: p.startX, y: p.startY, opacity: 0.6, scale: 1 }}
          animate={{ x: p.startX + p.endX, y: p.startY + p.endY, opacity: 0, scale: 0.1 }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.1, 0.25, 1]
          }}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  )
}

function FloatingQuote({ quote, position, depth, onRemove, isRemoving, onParticles }) {
  const containerRef = useRef(null)
  const isLeft = position.x < 50
  const size = depth === 'near' ? 'text-sm md:text-base' : depth === 'mid' ? 'text-xs md:text-sm' : 'text-[11px]'
  const maxOpacity = depth === 'near' ? 0.85 : depth === 'mid' ? 0.65 : 0.45
  
  const textChars = splitText(quote.text)
  const textDuration = textChars.length * 0.08 + 0.5

  // 消失动画完成后，从文字区域生成粒子
  useEffect(() => {
    if (isRemoving && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setTimeout(() => {
        onParticles({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        })
      }, 1200)
    }
  }, [isRemoving])
  
  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "absolute max-w-[280px] md:max-w-[320px] cursor-pointer select-none",
        isLeft ? "text-left" : "text-right"
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isRemoving ? 0 : maxOpacity,
        filter: isRemoving ? 'blur(16px)' : 'blur(0px)',
        scale: isRemoving ? 0.95 : 1
      }}
      transition={{ duration: isRemoving ? 1.5 : 0.5, ease: "easeOut" }}
      onClick={onRemove}
    >
      <motion.div
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        animate={{ x: [0, isLeft ? 6 : -6, 0], y: [0, -4, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <motion.span 
          className={cn("font-serif text-foreground/30 mr-1", size)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isRemoving ? 0 : 1 }}
          transition={{ duration: 0.3, delay: isRemoving ? 0 : 0 }}
        >
          「
        </motion.span>
        
        <span className={cn("font-serif leading-relaxed text-foreground", size)}>
          <AnimatedText text={quote.text} isLeaving={isRemoving} />
        </span>
        
        <motion.span 
          className={cn("font-serif text-foreground/30 ml-1", size)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isRemoving ? 0 : 1 }}
          transition={{ duration: 0.3, delay: isRemoving ? 0 : textDuration }}
        >
          」
        </motion.span>
        
        <motion.div 
          className={cn("mt-3 flex items-center gap-2", isLeft ? "justify-start" : "justify-end")}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ 
            opacity: isRemoving ? 0 : 1, 
            filter: isRemoving ? 'blur(6px)' : 'blur(0px)'
          }}
          transition={{ duration: 0.6, delay: isRemoving ? 0 : textDuration + 0.2, ease: "easeOut" }}
        >
          <span className="text-[9px] text-muted-foreground/40 tracking-wider">— {quote.author}</span>
          {quote.era && <span className="text-[8px] text-muted-foreground/25">{quote.era}</span>}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function QuoteOverlay({ isLeaving = false, isActive = false }) {
  const [activeQuotes, setActiveQuotes] = useState([])
  const [removingIds, setRemovingIds] = useState(new Set())
  const [particles, setParticles] = useState([])
  const usedIndices = useRef(new Set())
  const timersRef = useRef(new Map())
  
  const generatePosition = () => {
    const isLeft = Math.random() > 0.5
    return {
      x: isLeft ? 8 + Math.random() * 22 : 70 + Math.random() * 22,
      y: 20 + Math.random() * 60
    }
  }

  const addQuote = () => {
    let index
    if (usedIndices.current.size >= quotes.length) usedIndices.current.clear()
    do { index = Math.floor(Math.random() * quotes.length) } while (usedIndices.current.has(index))
    usedIndices.current.add(index)
    
    const depths = ['near', 'mid', 'far']
    setActiveQuotes(prev => [...prev, {
      id: Date.now() + Math.random(),
      quote: quotes[index],
      position: generatePosition(),
      depth: depths[Math.floor(Math.random() * depths.length)]
    }].slice(-4))
  }

  const startRemoveQuote = (id) => {
    const quote = activeQuotes.find(q => q.id === id)
    if (!quote || removingIds.has(id)) return
    
    setRemovingIds(prev => new Set([...prev, id]))
    
    // 等模糊消失动画 + 粒子动画完成后移除
    setTimeout(() => {
      setActiveQuotes(prev => prev.filter(q => q.id !== id))
      setRemovingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 8000)
  }

  const handleParticles = (id, rect) => {
    setParticles(prev => [...prev, { id: id + '-particles', rect }])
  }

  const removeParticles = (id) => {
    setParticles(prev => prev.filter(p => p.id !== id))
  }

  useEffect(() => {
    if (!isActive || isLeaving) {
      activeQuotes.forEach(q => startRemoveQuote(q.id))
      usedIndices.current.clear()
      return
    }
    const timer1 = setTimeout(addQuote, 500)
    const interval = setInterval(addQuote, 8000)
    return () => { clearTimeout(timer1); clearInterval(interval) }
  }, [isActive, isLeaving])

  // 每条名言独立的自动消散定时器
  useEffect(() => {
    activeQuotes.forEach(q => {
      if (!timersRef.current.has(q.id) && !removingIds.has(q.id)) {
        const timer = setTimeout(() => startRemoveQuote(q.id), 20000)
        timersRef.current.set(q.id, timer)
      }
    })
    
    timersRef.current.forEach((timer, id) => {
      if (!activeQuotes.find(q => q.id === id)) {
        clearTimeout(timer)
        timersRef.current.delete(id)
      }
    })
  }, [activeQuotes, removingIds])

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {activeQuotes.map(({ id, quote, position, depth }) => (
        <div key={id} className="pointer-events-auto">
          <FloatingQuote 
            quote={quote} 
            position={position} 
            depth={depth} 
            onRemove={() => startRemoveQuote(id)}
            isRemoving={removingIds.has(id)}
            onParticles={(rect) => handleParticles(id, rect)}
          />
        </div>
      ))}
      
      {particles.map(({ id, rect }) => (
        <DissipateParticles 
          key={id} 
          rect={rect} 
          onComplete={() => removeParticles(id)}
        />
      ))}
    </div>
  )
}

export default QuoteOverlay
