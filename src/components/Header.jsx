import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const quotes = [
  { text: "时间是一条从不停歇的河流，而我们是河床上短暂的涟漪", author: "博尔赫斯" },
  { text: "每一个不曾起舞的日子，都是对生命的辜负", author: "尼采" },
  { text: "过去与未来之间，有一扇旋转门，叫做此刻", author: "佩索阿" },
  { text: "我们不是在时间中旅行，而是时间在我们之中流淌", author: "圣奥古斯丁" },
  { text: "刹那即永恒，永恒即刹那", author: "禅语" },
  { text: "记忆是我们唯一的时间旅行方式", author: "卡尔维诺" },
]

function Header({ onNewMemo, memoCount, isLeaving = false }) {
  const quote = quotes[Math.floor(Date.now() / 86400000) % quotes.length]

  return (
    <motion.header 
      className="relative pt-20 pb-24 px-6"
      animate={isLeaving ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* 顶部装饰线 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="w-8 h-px bg-muted-foreground/10" />
        <div className="w-1 h-1 rounded-full bg-primary/30" />
        <div className="w-8 h-px bg-muted-foreground/10" />
      </div>
      
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* 主标题 */}
          <div className="relative inline-block mb-3">
            <h1 className="font-serif text-3xl md:text-4xl font-light tracking-[0.2em] text-foreground/85">
              须臾
            </h1>
            <span className="absolute -right-12 top-0 font-display italic text-[10px] text-muted-foreground/30 tracking-wider">
              Ephemera
            </span>
          </div>
          
          <p className="text-[11px] text-muted-foreground/30 tracking-[0.4em] uppercase mb-12">
            fragments of time
          </p>

          {/* 引言 */}
          <div className="max-w-lg mx-auto">
            <p className="font-serif text-sm md:text-base text-muted-foreground/40 font-light leading-relaxed tracking-wide">
              "{quote.text}"
            </p>
            <p className="mt-3 text-[10px] text-muted-foreground/25 tracking-[0.3em]">
              — {quote.author}
            </p>
          </div>
        </motion.div>

        {/* 统计与操作 */}
        <motion.div 
          className="flex justify-center items-center gap-16 mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* 记忆数量 */}
          <div className="text-center">
            <div className="relative h-16 flex items-center justify-center">
              <span className="font-display text-5xl md:text-6xl font-light text-foreground/[0.06] absolute">
                {String(memoCount).padStart(2, '0')}
              </span>
              <span className="font-display text-2xl text-foreground/50 relative">
                {String(memoCount).padStart(2, '0')}
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground/25 tracking-[0.4em] uppercase mt-2">moments</p>
          </div>

          {/* 分隔 */}
          <div className="h-12 w-px bg-gradient-to-b from-transparent via-muted-foreground/10 to-transparent" />

          {/* 新建 */}
          <button 
            onClick={onNewMemo}
            className="group text-center"
          >
            <div className="relative h-16 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-muted-foreground/10 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-500">
                <Plus className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary/60 transition-colors duration-500" />
              </div>
            </div>
            <p className="text-[9px] text-muted-foreground/25 tracking-[0.4em] uppercase mt-2 group-hover:text-muted-foreground/40 transition-colors">capture</p>
          </button>
        </motion.div>
      </div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="w-px h-16 bg-gradient-to-b from-muted-foreground/10 to-transparent" />
      </div>
    </motion.header>
  )
}

export default Header
