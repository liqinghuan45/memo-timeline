import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import MemoCard from './MemoCard'

function Timeline({ memos, onEdit, onDelete, isLeaving = false }) {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const lightY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const smoothLightY = useSpring(lightY, { stiffness: 50, damping: 20 })

  const groupedMemos = memos.reduce((groups, memo) => {
    const date = new Date(memo.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (!groups[key]) {
      groups[key] = {
        year: date.getFullYear(),
        month: date.toLocaleDateString('zh-CN', { month: 'long' }),
        memos: []
      }
    }
    groups[key].memos.push(memo)
    return groups
  }, {})

  const sortedGroups = Object.entries(groupedMemos).sort((a, b) => b[0].localeCompare(a[0]))
  let globalIndex = 0

  return (
    <motion.div 
      ref={containerRef} 
      className="relative py-12"
      animate={isLeaving ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 中央时间轴 */}
      <motion.div 
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
        animate={isLeaving ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ originY: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted-foreground/10 to-transparent" />
        
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-px h-32"
          style={{ 
            top: smoothLightY,
            background: 'linear-gradient(to bottom, transparent, rgba(100, 150, 255, 0.3), transparent)'
          }}
        />
        
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
          style={{ 
            top: smoothLightY,
            background: 'radial-gradient(circle, rgba(100, 150, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(4px)'
          }}
        />
      </motion.div>

      {sortedGroups.map(([key, group], groupIndex) => (
        <motion.div
          key={key}
          className="relative mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: groupIndex * 0.15 }}
        >
          {/* 月份标记 */}
          <motion.div 
            className="flex justify-center items-center mb-12 relative"
            animate={isLeaving ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: groupIndex * 0.05 }}
          >
            <motion.div 
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-primary/20 bg-background flex items-center justify-center"
              whileInView={{ borderColor: 'rgba(100, 150, 255, 0.4)', scale: 1.1 }}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-1 h-1 rounded-full bg-primary/40" />
            </motion.div>
            
            <div className="absolute right-[calc(50%+24px)] text-right">
              <span className="font-display text-4xl text-foreground/[0.04]">{group.year}</span>
            </div>
            
            <div className="absolute left-[calc(50%+24px)]">
              <span className="font-serif text-sm text-muted-foreground/40 tracking-widest">{group.month}</span>
            </div>
          </motion.div>

          {/* Memo 卡片 */}
          <div className="flex flex-col gap-10">
            {group.memos.map((memo, index) => {
              const position = globalIndex % 2 === 0 ? 'left' : 'right'
              globalIndex++
              return (
                <MemoCard
                  key={memo.id}
                  memo={memo}
                  index={index}
                  position={position}
                  onEdit={() => onEdit(memo)}
                  onDelete={() => onDelete(memo.id)}
                  isLeaving={isLeaving}
                />
              )
            })}
          </div>
        </motion.div>
      ))}

      {/* 底部 */}
      <div className="flex justify-center mt-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/10 to-transparent" />
          <span className="font-display italic text-xs text-muted-foreground/15">fin</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Timeline
