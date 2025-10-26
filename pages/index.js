import { useState, useEffect, useRef } from 'react'

function Sparkline({ data, color='#00ffcc', width=300, height=60 }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas || !data || data.length===0) return
    const ctx = canvas.getContext('2d')
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.clearRect(0,0,width,height)
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    ctx.beginPath()
    data.forEach((v,i)=>{
      const x = (i/(data.length-1)) * (width-8) + 4
      const y = height - 4 - ((v - min)/range) * (height-8)
      if(i===0) ctx.moveTo(x,y)
      else ctx.lineTo(x,y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()
  }, [data])
  return <canvas ref={canvasRef} />
}

export default function Home(){
  // default tokens: bitcoin, ethereum, base
  const [input, setInput] = useState('bitcoin,ethereum,base')
  const [ids, setIds] = useState(['bitcoin','ethereum','base'])
  const [prices, setPrices] = useState({})
  const [history, setHistory] = useState({})
  const [last, setLast] = useState(null)

  const fetchPrices = async (idsArr) => {
    try{
      const res = await fetch('/api/prices?ids=' + idsArr.join(','))
      if(!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setPrices(data)
      setLast(new Date().toISOString())
    }catch(e){
      console.error(e)
    }
  }

  const fetchHistory = async (id) => {
    try{
      const res = await fetch('/api/history?id=' + encodeURIComponent(id))
      if(!res.ok) return
      const data = await res.json()
      const pricesArr = data.prices ? data.prices.map(p=>p[1]) : []
      setHistory(h => ({ ...h, [id]: pricesArr }))
    }catch(e){
      console.error(e)
    }
  }

  useEffect(()=>{
    fetchPrices(ids)
    ids.forEach(id => fetchHistory(id))
    const iv = setInterval(()=>{ fetchPrices(ids); ids.forEach(id=>fetchHistory(id)) }, 30000)
    return ()=>clearInterval(iv)
  }, [ids])

  const onTrack = () => {
    const raw = input.split(',').map(s=>s.trim()).filter(Boolean)
    if(raw.length) setIds(raw)
  }

  return (
    <main>
      <div className="header">
        <div className="logo">BP</div>
        <div>
          <h1 style={{margin:0}}>BasePulse</h1>
          <div className="small">Track Base ecosystem tokens — live prices via CoinGecko (24h)</div>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input className="small" style={{flex:1,padding:8,borderRadius:8,background:'transparent',border:'1px solid rgba(255,255,255,0.06)'}} value={input} onChange={(e)=>setInput(e.target.value)} />
          <button style={{background:'#0052FF',color:'white',padding:'8px 12px',borderRadius:8,border:0}} onClick={onTrack}>Track</button>
        </div>
        <div className="small" style={{marginTop:8}}>Auto-refresh every 30s. Last update: {last? new Date(last).toLocaleString() : '—'}</div>
      </div>

      <div className="tokens">
        {ids.map(id => (
          <div className="token" key={id}>
            <strong style={{textTransform:'capitalize'}}>{id}</strong>
            <div className="small">USD price:</div>
            <div style={{fontSize:20}}>
              {prices[id] && prices[id].usd ? '$' + prices[id].usd : '—'}
            </div>
            <div style={{marginTop:8}}>
              <Sparkline data={history[id] || []} color="#00ffc8" width={320} height={70} />
            </div>
            <div className="small" style={{marginTop:8}}>Raw: {JSON.stringify(prices[id] || {})}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
