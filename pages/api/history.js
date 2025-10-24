export default async function handler(req, res){
  const { id } = req.query;
  if(!id) return res.status(400).json({error:'id required'});
  const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=1&interval=hourly`;
  try{
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Cache-Control','s-maxage=60, stale-while-revalidate=119');
    res.status(200).json(data);
  }catch(e){
    res.status(500).json({error:e.message});
  }
}
