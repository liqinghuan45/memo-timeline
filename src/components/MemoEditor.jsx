import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const moods = [
  { key: 'hopeful', icon: '✦', label: '期待' },
  { key: 'thoughtful', icon: '◯', label: '沉思' },
  { key: 'peaceful', icon: '◇', label: '平静' },
  { key: 'accomplished', icon: '△', label: '成就' },
  { key: 'nostalgic', icon: '□', label: '怀旧' }
]

function MemoEditor({ memo, onSave, onClose, isLeaving = false }) {
  const [content, setContent] = useState(memo?.content || '')
  const [mood, setMood] = useState(memo?.mood || 'peaceful')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(memo?.tags || [])
  const [focusArea, setFocusArea] = useState('content') // 'content' | 'mood' | 'tags'
  
  const textareaRef = useRef(null)
  const tagInputRef = useRef(null)

  const currentMood = moods.find(m => m.key === mood) || moods[2]
  const currentMoodIndex = moods.findIndex(m => m.key === mood)
  
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  })
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  // 初始聚焦
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus()
      setFocusArea('content')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && content.trim()) {
        handleSave()
        return
      }

      // Tab 切换焦点区域
      if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) {
          // Shift+Tab 反向
          if (focusArea === 'content') {
            setFocusArea('tags')
            tagInputRef.current?.focus()
          } else if (focusArea === 'mood') {
            setFocusArea('content')
            textareaRef.current?.focus()
          } else {
            setFocusArea('mood')
          }
        } else {
          // Tab 正向
          if (focusArea === 'content') {
            setFocusArea('mood')
          } else if (focusArea === 'mood') {
            setFocusArea('tags')
            tagInputRef.current?.focus()
          } else {
            setFocusArea('content')
            textareaRef.current?.focus()
          }
        }
        return
      }

      // 心情区域的左右键控制
      if (focusArea === 'mood') {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const newIndex = currentMoodIndex > 0 ? currentMoodIndex - 1 : moods.length - 1
          setMood(moods[newIndex].key)
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          const newIndex = currentMoodIndex < moods.length - 1 ? currentMoodIndex + 1 : 0
          setMood(moods[newIndex].key)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content, focusArea, currentMoodIndex])

  const handleSave = () => {
    if (!content.trim()) return
    onSave({ ...memo, content, mood, tags, date: memo?.date || new Date() })
  }

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleContentFocus = () => setFocusArea('content')
  const handleTagFocus = () => setFocusArea('tags')
  const handleMoodClick = () => {
    setFocusArea('mood')
    // 不要让其他元素抢走焦点
    setTimeout(() => textareaRef.current?.blur(), 0)
  }

  const exitVariants = {
    date: { opacity: 0, y: -50 },
    mood: { opacity: 0, scale: 0.5 },
    textarea: { opacity: 0, y: 50 },
    tags: { opacity: 0, y: 30 },
    closeBtn: { opacity: 0, x: -30 },
    saveBtn: { opacity: 0, x: 30 },
    hint: { opacity: 0 }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 paper-texture" />
      
      {/* 关闭按钮 */}
      <motion.button 
        onClick={onClose}
        className="absolute top-6 left-6 md:top-10 md:left-10 p-2 text-muted-foreground/30 hover:text-foreground/60 transition-colors z-10"
        initial={{ opacity: 0, x: -30, y: -30 }}
        animate={isLeaving ? exitVariants.closeBtn : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: isLeaving ? 0 : 0.9 }}
        tabIndex={-1}
      >
        <X className="w-5 h-5" />
      </motion.button>
      
      {/* 保存按钮 */}
      <motion.button
        onClick={handleSave}
        disabled={!content.trim()}
        className={cn(
          "absolute top-6 right-6 md:top-10 md:right-10 p-2 transition-colors z-10",
          content.trim() ? "text-primary/60 hover:text-primary" : "text-muted-foreground/20"
        )}
        initial={{ opacity: 0, x: 30, y: -30 }}
        animate={isLeaving ? exitVariants.saveBtn : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: isLeaving ? 0 : 0.95 }}
        tabIndex={-1}
      >
        <Check className="w-5 h-5" />
      </motion.button>

      {/* 主书写区 */}
      <div className="h-full flex flex-col justify-center items-center px-6 py-24">
        <div className="w-full max-w-2xl">
          
          {/* 日期时间 */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -40 }}
            animate={isLeaving ? exitVariants.date : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: isLeaving ? 0.1 : 0.3, ease: "easeOut" }}
          >
            <p className="font-serif text-sm text-muted-foreground/30 tracking-widest">
              {dateStr}
            </p>
            <p className="font-display text-xs text-muted-foreground/20 mt-1">
              {timeStr}
            </p>
          </motion.div>

          {/* 心情选择 */}
          <motion.div 
            className="flex justify-center mb-10"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={isLeaving ? exitVariants.mood : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: isLeaving ? 0.05 : 0.5, ease: "easeOut" }}
          >
            <div 
              className={cn(
                "relative px-4 py-2 rounded-full transition-all duration-300 cursor-pointer",
                focusArea === 'mood' && "bg-white/5 ring-1 ring-white/10"
              )}
              onClick={handleMoodClick}
            >
              <div className="flex items-center gap-4">
                {moods.map((m, i) => (
                  <button
                    key={m.key}
                    onClick={(e) => {
                      e.stopPropagation()
                      setMood(m.key)
                      setFocusArea('mood')
                    }}
                    className={cn(
                      "text-xl transition-all duration-200",
                      mood === m.key 
                        ? "opacity-100 scale-110" 
                        : "opacity-20 hover:opacity-40 scale-100"
                    )}
                    tabIndex={-1}
                  >
                    {m.icon}
                  </button>
                ))}
              </div>
              {focusArea === 'mood' && (
                <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground/30 whitespace-nowrap">
                  ← → 切换
                </p>
              )}
            </div>
          </motion.div>

          {/* 文字输入区 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLeaving ? exitVariants.textarea : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: isLeaving ? 0 : 0.6, ease: "easeOut" }}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              onFocus={handleContentFocus}
              placeholder="此刻..."
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={cn(
                "w-full min-h-[200px] bg-transparent text-center resize-none outline-none",
                "font-serif text-lg md:text-xl leading-[2.5] tracking-wide",
                "text-foreground/80 placeholder:text-muted-foreground/20"
              )}
            />
          </motion.div>

          {/* 标签 */}
          <motion.div 
            className="mt-16 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isLeaving ? exitVariants.tags : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: isLeaving ? 0 : 0.75, ease: "easeOut" }}
          >
            <div className="flex flex-wrap justify-center gap-3">
              {tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs text-muted-foreground/30 cursor-pointer hover:text-muted-foreground/50 transition-colors"
                  onClick={() => setTags(tags.filter(t => t !== tag))}
                >
                  {tag}
                </span>
              ))}
            </div>
            <input
              ref={tagInputRef}
              type="text"
              placeholder="+ 标签"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
              onFocus={handleTagFocus}
              spellCheck={false}
              className={cn(
                "bg-transparent text-center text-xs text-muted-foreground/40 outline-none placeholder:text-muted-foreground/20 w-24 py-1 rounded transition-all",
                focusArea === 'tags' && "bg-white/5 ring-1 ring-white/10"
              )}
            />
          </motion.div>
        </div>
      </div>

      {/* 底部提示 */}
      <motion.div 
        className="absolute bottom-6 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={isLeaving ? exitVariants.hint : { opacity: 1 }}
        transition={{ duration: 0.4, delay: isLeaving ? 0 : 1 }}
      >
        <p className="text-[10px] text-muted-foreground/15 tracking-widest">
          Tab 切换 · ESC 取消 · ⌘ Enter 保存
        </p>
      </motion.div>
    </motion.div>
  )
}

export default MemoEditor
