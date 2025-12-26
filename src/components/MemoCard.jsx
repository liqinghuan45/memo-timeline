import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Edit3, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const moods = {
  hopeful: { icon: '✦', color: 'text-emerald-400/60' },
  thoughtful: { icon: '◯', color: 'text-slate-400/60' },
  peaceful: { icon: '◇', color: 'text-blue-400/60' },
  accomplished: { icon: '△', color: 'text-amber-400/60' },
  nostalgic: { icon: '□', color: 'text-rose-400/60' },
  default: { icon: '·', color: 'text-muted-foreground/60' }
}

function MemoCard({ memo, index, position, onEdit, onDelete, isLeaving = false }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { margin: "-5% 0px -5% 0px", amount: 0.3 })
  
  const mood = moods[memo.mood] || moods.default
  
  const formatDate = (date) => {
    const d = new Date(date)
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleDateString('zh-CN', { month: 'short' }),
      time: d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      weekday: d.toLocaleDateString('zh-CN', { weekday: 'short' })
    }
  }

  const dateInfo = formatDate(memo.date)
  const variation = index % 3

  // 离场动画：左侧卡片向左飞出，右侧向右飞出
  const leaveX = position === 'left' ? -100 : 100

  const handleDelete = () => {
    setIsDeleting(true)
    // 等待动画完成后再真正删除
    setTimeout(() => onDelete(), 800)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative",
        position === 'left' ? "mr-auto pr-16" : "ml-auto pl-16",
        position === 'left' ? "w-[55%]" : "w-[50%]"
      )}
      animate={
        isDeleting 
          ? { 
              opacity: 0, 
              scale: 0.8, 
              filter: 'blur(8px)',
              y: -20
            }
          : isLeaving 
            ? { opacity: 0, x: leaveX, filter: 'blur(4px)' } 
            : { opacity: 1, x: 0, filter: 'blur(0px)', scale: 1, y: 0 }
      }
      transition={{ 
        duration: isDeleting ? 0.8 : 0.5, 
        delay: isDeleting ? 0 : index * 0.05, 
        ease: isDeleting ? [0.4, 0, 0.2, 1] : "easeInOut" 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 连接线和节点 */}
      <div className={cn(
        "absolute top-12 flex items-center",
        position === 'left' ? "right-0" : "left-0",
        position === 'right' && "flex-row-reverse"
      )}>
        <motion.div 
          className="w-14 h-px"
          style={{
            background: position === 'left' 
              ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))'
              : 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isInView && !isLeaving ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
        <div className="relative">
          <motion.div
            className="absolute -inset-2 rounded-full bg-primary/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView && !isLeaving ? { scale: [0, 1.5, 0], opacity: [0, 0.5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          />
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"
            animate={{ 
              backgroundColor: isInView && !isLeaving ? 'rgba(120, 160, 255, 0.5)' : 'rgba(255,255,255,0.15)',
              boxShadow: isInView && !isLeaving ? '0 0 12px rgba(120, 160, 255, 0.4)' : 'none'
            }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* 主体内容 */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, filter: 'blur(6px)' }}
        animate={{ 
          opacity: isInView ? 1 : 0.2, 
          filter: isInView ? 'blur(0px)' : 'blur(3px)'
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* 大日期数字 */}
        <div className={cn(
          "absolute -top-4 select-none pointer-events-none",
          position === 'left' ? "-left-4" : "-right-4"
        )}>
          <span className="font-display text-[80px] md:text-[100px] font-light leading-none text-foreground/[0.03]">
            {dateInfo.day}
          </span>
        </div>

        {/* 时间信息 */}
        <div className={cn(
          "flex items-center gap-3 mb-6",
          variation === 1 && "mb-8",
          position === 'right' && "flex-row-reverse"
        )}>
          <span className={cn("text-lg", mood.color)}>{mood.icon}</span>
          <div className={cn(
            "flex items-center gap-2 text-[10px] text-muted-foreground/30",
            position === 'right' && "flex-row-reverse"
          )}>
            <span className="tracking-wider">{dateInfo.month} {dateInfo.day}</span>
            <span>·</span>
            <span>{dateInfo.weekday}</span>
            <span>·</span>
            <span>{dateInfo.time}</span>
          </div>
        </div>
        
        {/* 内容 */}
        <div className={cn(
          "relative",
          position === 'right' && "text-right"
        )}>
          <p className={cn(
            "font-serif text-base md:text-lg leading-[2.2] text-foreground/70 tracking-wide",
            variation === 0 && "first-letter:text-3xl first-letter:font-display first-letter:text-foreground/40 first-letter:mr-1 first-letter:float-left first-letter:leading-none first-letter:mt-1",
            variation === 2 && "text-sm leading-[2.4]"
          )}>
            {memo.content}
          </p>
        </div>
        
        {/* 标签 */}
        {memo.tags?.length > 0 && (
          <div className={cn(
            "flex flex-wrap gap-x-4 gap-y-1 mt-8",
            position === 'right' && "justify-end",
            variation === 1 && "mt-10"
          )}>
            {memo.tags.map((tag, i) => (
              <span key={i} className="text-[10px] text-muted-foreground/25 tracking-widest font-light">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 底部装饰线 */}
        <motion.div 
          className={cn(
            "mt-8 h-px w-16",
            position === 'right' && "ml-auto"
          )}
          style={{
            background: position === 'left'
              ? 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)'
              : 'linear-gradient(to left, rgba(255,255,255,0.06), transparent)'
          }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />

        {/* 操作按钮 */}
        <motion.div 
          className={cn(
            "absolute -bottom-1 flex gap-1",
            position === 'left' ? "right-0" : "left-0"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button onClick={onEdit} className="p-2 text-muted-foreground/20 hover:text-foreground/50 transition-colors">
            <Edit3 className="w-3 h-3" />
          </button>
          <button onClick={handleDelete} className="p-2 text-muted-foreground/20 hover:text-red-400/50 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default MemoCard
