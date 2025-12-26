import React, { useEffect, useRef } from 'react'

function Background({ isPaused = false }) {
  const canvasRef = useRef(null)
  const pausedRef = useRef(isPaused)
  const speedMultiplierRef = useRef(1)

  useEffect(() => {
    pausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let time = 0
    let layers = []
    let streaks = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initLayers()
    }

    const initLayers = () => {
      layers = [
        { particles: [], speed: 0.015, size: 0.3, opacity: 0.08, count: 60 },
        { particles: [], speed: 0.03, size: 0.5, opacity: 0.12, count: 40 },
        { particles: [], speed: 0.06, size: 0.8, opacity: 0.18, count: 25 },
      ]
      
      layers.forEach(layer => {
        layer.particles = []
        for (let i = 0; i < layer.count; i++) {
          layer.particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseSize: layer.size + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            isBlue: Math.random() < 0.12
          })
        }
      })
    }

    const createStreak = () => {
      if (Math.random() > 0.003 * speedMultiplierRef.current) return null
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: 80 + Math.random() * 120,
        angle: Math.PI * 0.15 + Math.random() * 0.2,
        speed: 2 + Math.random() * 2,
        opacity: 0.15 + Math.random() * 0.1,
        life: 1
      }
    }

    const animate = () => {
      // 平滑过渡速度
      const targetSpeed = pausedRef.current ? 0 : 1
      speedMultiplierRef.current += (targetSpeed - speedMultiplierRef.current) * 0.02
      
      time += 0.008 * speedMultiplierRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      layers.forEach(layer => {
        layer.particles.forEach(p => {
          p.y -= layer.speed * speedMultiplierRef.current
          p.x += Math.sin(time + p.phase) * 0.15 * speedMultiplierRef.current
          
          if (p.y < -10) {
            p.y = canvas.height + 10
            p.x = Math.random() * canvas.width
          }
          
          const breathe = 1 + Math.sin(time * 0.5 + p.phase) * 0.3
          const size = p.baseSize * breathe
          const twinkle = 0.7 + Math.sin(time * 2 + p.phase * 3) * 0.3
          const opacity = layer.opacity * twinkle
          
          ctx.beginPath()
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fillStyle = p.isBlue 
            ? `rgba(90, 130, 200, ${opacity * 1.5})` 
            : `rgba(255, 255, 255, ${opacity})`
          ctx.fill()
        })
      })

      if (speedMultiplierRef.current > 0.1) {
        const newStreak = createStreak()
        if (newStreak) streaks.push(newStreak)
      }
      
      streaks = streaks.filter(s => {
        s.x += Math.cos(s.angle) * s.speed * speedMultiplierRef.current
        s.y += Math.sin(s.angle) * s.speed * speedMultiplierRef.current
        s.life -= 0.015 * speedMultiplierRef.current
        
        if (s.life <= 0) return false
        
        const gradient = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        )
        gradient.addColorStop(0, `rgba(150, 180, 220, ${s.opacity * s.life})`)
        gradient.addColorStop(1, 'rgba(150, 180, 220, 0)')
        
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length * s.life,
          s.y - Math.sin(s.angle) * s.length * s.life
        )
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
        
        return true
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/[0.025] blur-[100px] animate-breathe" />
      <div className="absolute top-1/3 -left-60 w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[80px] animate-breathe-delayed" />
      <div className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/[0.015] blur-[60px] animate-breathe-slow" />
      <div className="paper-texture absolute inset-0" />
    </div>
  )
}

export default Background
