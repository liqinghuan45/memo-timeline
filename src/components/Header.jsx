import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const quotes = [
  { text: "人生到处知何似，应似飞鸿踏雪泥", author: "苏轼" },
]

function Header({ onNewMemo, memoCount, isLeaving = false, onQuoteClick }) {
  const quote = quotes[Math.floor(Date.now() / 86400000) % quotes.length]

  return (
    <>
      {/* 顶部留白 */}
      <div className="h-[20vh]" />

      {/* 底部居中横排名言 - 固定定位 */}
      <motion.div
        className="fixed bottom-8 left-0 right-0 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isLeaving ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          <div 
            className="cursor-pointer group text-center pointer-events-auto"
            onClick={onQuoteClick}
          >
            <p className="font-serif text-sm text-muted-foreground/35 font-light tracking-[0.08em] leading-relaxed transition-colors duration-500 group-hover:text-muted-foreground/50">
              「{quote.text}」
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground/20 tracking-[0.2em]">
              — {quote.author}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 右下角固定定位的统计与操作 */}
      <motion.div 
        className="fixed bottom-8 right-8 z-40 flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={isLeaving ? { opacity: 0, x: 30 } : { opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {/* 记忆数量 */}
        <div className="text-center">
          <div className="relative h-12 flex items-center justify-center">
            <span className="font-display text-4xl font-light text-foreground/[0.06] absolute">
              {String(memoCount).padStart(2, '0')}
            </span>
            <span className="font-display text-lg text-foreground/40 relative">
              {String(memoCount).padStart(2, '0')}
            </span>
          </div>
          <p className="text-[8px] text-muted-foreground/20 tracking-[0.3em] uppercase">moments</p>
        </div>

        {/* 分隔 */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-muted-foreground/10 to-transparent" />

        {/* 新建 */}
        <button 
          onClick={onNewMemo}
          className="group text-center"
        >
          <div className="relative h-12 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full border border-muted-foreground/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-500">
              <Plus className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/60 transition-colors duration-500" />
            </div>
          </div>
          <p className="text-[8px] text-muted-foreground/20 tracking-[0.3em] uppercase group-hover:text-muted-foreground/35 transition-colors">capture</p>
        </button>
      </motion.div>
    </>
  )
}

export default Header
