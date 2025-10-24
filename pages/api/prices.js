export default async function handler(req, res){
  const { ids } = req.query;
  if(!ids){
    res.status(400).json({error:'Specify ids param'});
    return;
  }
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd&include_24hr_change=true`;
  try{
    const r = await fetch(url);
    const data = await r.json();
    res.setHeader('Cache-Control','s-maxage=10, stale-while-revalidate=59');
    res.status(200).json(data);
  }catch(e){
    res.status(500).json({error:e.message});
  }
}
