import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const quotes = [
  { text: "逝者如斯夫，不舍昼夜", author: "孔子", era: "公元前551年" },
  { text: "Time is the substance I am made of", author: "Borges", era: "1899-1986" },
  { text: "往事不可谏，来者犹可追", author: "《论语》", era: "" },
  { text: "The only reason for time is so that everything doesn't happen at once", author: "Einstein", era: "1879-1955" },
  { text: "人生天地之间，若白驹过隙，忽然而已", author: "庄子", era: "公元前369年" },
  { text: "We are such stuff as dreams are made on", author: "Shakespeare", era: "1564-1616" },
  { text: "盛年不重来，一日难再晨", author: "陶渊明", era: "365-427" },
  { text: "Memory is the diary we all carry about with us", author: "Oscar Wilde", era: "1854-1900" },
  { text: "今人不见古时月，今月曾经照古人", author: "李白", era: "701-762" },
  { text: "The past is never dead. It's not even past", author: "Faulkner", era: "1897-1962" },
  { text: "此情可待成追忆，只是当时已惘然", author: "李商隐", era: "813-858" },
  { text: "Time flies over us, but leaves its shadow behind", author: "Hawthorne", era: "1804-1864" },
]

function FloatingQuote({ quote, position, depth, onRemove }) {
  const isLeft = position.x < 50
  const size = depth === 'near' ? 'text-sm md:text-base' : depth === 'mid' ? 'text-xs md:text-sm' : 'text-[11px]'
  const maxOpacity = depth === 'near' ? 0.8 : depth === 'mid' ? 0.6 : 0.4
  
  return (
    <motion.div
      className={cn(
        "absolute max-w-[260px] md:max-w-[300px] cursor-pointer select-none",
        isLeft ? "text-left" : "text-right"
      )}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      initial={{ opacity: 0, filter: 'blur(12px)', scale: 0.9 }}
      animate={{ opacity: maxOpacity, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      onClick={onRemove}
    >
      <motion.div
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
        animate={{ x: [0, isLeft ? 6 : -6, 0], y: [0, -4, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <p className={cn("font-serif leading-relaxed text-foreground", size)}>
          "{quote.text}"
        </p>
        <div className={cn("mt-3 flex items-center gap-2", isLeft ? "justify-start" : "justify-end")}>
          <span className="text-[9px] text-muted-foreground/40 tracking-wider">— {quote.author}</span>
          {quote.era && <span className="text-[8px] text-muted-foreground/25">{quote.era}</span>}
        </div>
      </motion.div>
    </motion.div>
  )
}

function QuoteOverlay({ isLeaving = false }) {
  const [isActive, setIsActive] = useState(false)
  const [activeQuotes, setActiveQuotes] = useState([])
  const usedIndices = useRef(new Set())
  
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

  const removeQuote = (id) => setActiveQuotes(prev => prev.filter(q => q.id !== id))

  useEffect(() => {
    if (!isActive || isLeaving) {
      setActiveQuotes([])
      usedIndices.current.clear()
      return
    }
    const timer1 = setTimeout(addQuote, 500)
    const interval = setInterval(addQuote, 5000)
    return () => { clearTimeout(timer1); clearInterval(interval) }
  }, [isActive, isLeaving])

  useEffect(() => {
    if (activeQuotes.length === 0) return
    const oldest = activeQuotes[0]
    const timeout = setTimeout(() => removeQuote(oldest.id), 15000)
    return () => clearTimeout(timeout)
  }, [activeQuotes.length > 0 ? activeQuotes[0].id : null])

  return (
    <>
      <div className="fixed inset-0 z-30 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {activeQuotes.map(({ id, quote, position, depth }) => (
            <div key={id} className="pointer-events-auto">
              <FloatingQuote quote={quote} position={position} depth={depth} onRemove={() => removeQuote(id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-500 border",
          isActive ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/10" : "bg-card/80 border-border/50 hover:border-border"
        )}
        onClick={() => setIsActive(!isActive)}
        animate={isLeaving ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Sparkles className={cn("w-3.5 h-3.5 transition-colors duration-300", isActive ? "text-primary" : "text-muted-foreground/40")} />
        <span className={cn("text-[10px] tracking-[0.2em] uppercase transition-colors duration-300", isActive ? "text-primary/70" : "text-muted-foreground/40")}>
          {isActive ? "冥想中" : "召唤"}
        </span>
      </motion.button>
    </>
  )
}

export default QuoteOverlay
