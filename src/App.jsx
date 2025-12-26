import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Timeline from './components/Timeline'
import MemoEditor from './components/MemoEditor'
import Background from './components/Background'
import Header from './components/Header'
import QuoteOverlay from './components/QuoteOverlay'

const initialMemos = [
  {
    id: 1,
    content: '今天开始了一段新的旅程，心中充满期待与憧憬。每一个开始都是一次重生的机会。',
    date: new Date(2024, 11, 25, 9, 30),
    mood: 'hopeful',
    tags: ['新开始', '感悟']
  },
  {
    id: 2,
    content: '读完了《百年孤独》，马尔克斯的魔幻现实主义让我沉浸其中。时间是一条河流，我们都在其中漂流。',
    date: new Date(2024, 11, 23, 21, 15),
    mood: 'thoughtful',
    tags: ['阅读', '文学']
  },
  {
    id: 3,
    content: '深夜的城市格外安静，窗外的霓虹灯闪烁着，像是宇宙中遥远的星辰。在这样的夜晚，思绪总是特别清晰。',
    date: new Date(2024, 11, 20, 23, 45),
    mood: 'peaceful',
    tags: ['夜晚', '思考']
  },
  {
    id: 4,
    content: '完成了一个重要的项目，虽然过程艰辛，但看到成果的那一刻，所有的付出都值得了。',
    date: new Date(2024, 11, 18, 17, 0),
    mood: 'accomplished',
    tags: ['工作', '成就']
  },
  {
    id: 5,
    content: '和老友重逢，聊起往事，时光仿佛倒流。有些人，即使很久不见，再见时依然如故。',
    date: new Date(2024, 11, 15, 14, 30),
    mood: 'nostalgic',
    tags: ['友情', '回忆']
  }
]

function App() {
  const [memos, setMemos] = useState(() => {
    const saved = localStorage.getItem('memos')
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'date') return new Date(value)
      return value
    }) : initialMemos
  })
  
  // 三个状态：idle, transitioning-out, editor-open, transitioning-in
  const [appState, setAppState] = useState('idle')
  const [editingMemo, setEditingMemo] = useState(null)

  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos))
  }, [memos])

  const openEditor = (memo = null) => {
    setEditingMemo(memo)
    setAppState('transitioning-out')
    // 等待页面元素消散后再显示编辑器
    setTimeout(() => setAppState('editor-open'), 700)
  }

  const closeEditor = () => {
    setAppState('transitioning-in')
    // 等待编辑器消散后恢复页面
    setTimeout(() => {
      setAppState('idle')
      setEditingMemo(null)
    }, 600)
  }

  const addMemo = (memo) => {
    const newMemo = { ...memo, id: Date.now(), date: new Date() }
    setMemos(prev => [newMemo, ...prev])
    closeEditor()
  }

  const updateMemo = (updatedMemo) => {
    setMemos(prev => prev.map(m => m.id === updatedMemo.id ? updatedMemo : m))
    closeEditor()
  }

  const deleteMemo = (id) => setMemos(prev => prev.filter(m => m.id !== id))

  const isPageVisible = appState === 'idle' || appState === 'transitioning-out'
  const isPageLeaving = appState === 'transitioning-out'
  const isEditorVisible = appState === 'editor-open' || appState === 'transitioning-in'
  const isEditorLeaving = appState === 'transitioning-in'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background isPaused={appState !== 'idle'} />
      
      {/* 主页面内容 */}
      <AnimatePresence>
        {isPageVisible && (
          <motion.div
            key="main-content"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header 
              onNewMemo={() => openEditor()} 
              memoCount={memos.length}
              isLeaving={isPageLeaving}
            />
            
            <main className="max-w-4xl mx-auto px-8 md:px-16 pb-24 relative z-10">
              <Timeline 
                memos={memos} 
                onEdit={openEditor} 
                onDelete={deleteMemo}
                isLeaving={isPageLeaving}
              />
            </main>

            <QuoteOverlay isLeaving={isPageLeaving} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 编辑器 */}
      <AnimatePresence>
        {isEditorVisible && (
          <MemoEditor
            key="editor"
            memo={editingMemo}
            onSave={editingMemo ? updateMemo : addMemo}
            onClose={closeEditor}
            isLeaving={isEditorLeaving}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
