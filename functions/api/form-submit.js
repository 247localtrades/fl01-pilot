// =============================================================================
// 247 Local Trades — Form Submit Handler
// Route: POST /api/form-submit
// Stack: Cloudflare Pages Function → Supabase → GHL (D-STACK-02)
// Version: 1.0 | March 2026
// =============================================================================

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://247localtrades.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  let body;
  try { body = await request.json(); }
  catch { return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400, corsHeaders); }

  const { name, phone, zip, trade, service_type, lead_tier, source, source_detail, campaign_id, visitor_id } = body;

  if (!phone || !trade || !zip)
    return jsonResponse({ ok: false, error: 'Missing required fields: phone, trade, zip' }, 422, corsHeaders);

  if (!['hvac','plumbing','electrical','roofing'].includes(trade))
    return jsonResponse({ ok: false, error: `Invalid trade: ${trade}` }, 422, corsHeaders);

  const tier = ['standard','premium','emergency'].includes(lead_tier) ? lead_tier : 'standard';
  const lead = {
    name: sanitize(name,100), phone: sanitizePhone(phone),
    email: sanitize(body.email,255), zip: sanitizeZip(zip),
    city: sanitize(body.city,100), state: sanitize(body.state,2),
    trade, service_type: sanitize(service_type,100), lead_tier: tier,
    source: sanitize(source,50) || 'form',
    source_detail: sanitize(source_detail,255),
    campaign_id: sanitize(campaign_id,100),
    visitor_id: sanitize(visitor_id,50),
  };
  const leadPrice = getLeadPrice(trade, tier);

  let supabaseId = null;
  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/captured_leads`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json','apikey':env.SUPABASE_ANON_KEY,'Authorization':`Bearer ${env.SUPABASE_SERVICE_KEY}`,'Prefer':'return=representation' },
      body: JSON.stringify(lead),
    });
    if (r.ok) { const rows = await r.json(); supabaseId = rows?.[0]?.id ?? null; }
    else console.error('Supabase error:', await r.text());
  } catch(e) { console.error('Supabase fail:', e.message); }

  let ghlOk = false;
  try {
    const payload = {
      firstName: lead.name?.split(' ')[0] ?? '',
      lastName: lead.name?.split(' ').slice(1).join(' ') ?? '',
      phone: lead.phone, email: lead.email ?? '',
      customField: { zip:lead.zip, city:lead.city??''state:lead.state??'FL', trade:lead.trade, service_type:lead.service_type??'', lead_tier:tier, lead_price:leadPrice, source:lead.source, source_detail:lead.source_detail??'', campaign_id:lead.campaign_id??'',osupabase_id:String(supabaseId??'') },
      tags: buildTags(lead),
    };
    const r = await fetch(env.GHL_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    ghlOk = r.ok;
    if (!r.ok) console.error('GHL error:', await r.text());
  } catch(e) { console.error('GHL fail:', e.message); }

  if (!supabaseId && !ghlOk)
    return jsonResponse({ ok:false, error:'Submission failed. Please call us directly.' }, 500, corsHeaders);

  return jsonResponse({ ok:true, id:supabaseId, tier, trade, callbackPhone: getTradePhone(trade) }, 200, corsHeaders);
}

export async function onRequestOptions() {
  return new Response(null, { status:204, headers:{'Access-Control-Allow-Origin':'https://247localtrades.com','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'} });
}

function jsonResponse(data,status,headers={}) { return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json',...headers}}); }
function sanitize(val,maxLen) { if(!val||typeof val!=='string')return null; return val.trim().slice(0,maxLen)||null; }
function sanitizePhone(val) { if(!val)return null; const d=val.replace(/\D/g,''); if(d.length<10)return null; const t=d.slice(-10); return `(${t.slice(0,3)}) ${t.slice(3,6)}-${t.slice(6)}`; }
function sanitizeZip(val) { if(!val)return null; const d=val.replace(/\D/g,'').slice(0,5); return d.length===5?d:null; }
function getLeadPrice(trade,tier) { const p={hvac:{s90,p:150,e:125},plumbing:{s:70,p:115,e:100},electrical:{s:55,p:100,e:80},roofing:{s:130,p:185,e:160}}; return p[trade]?.[tier[0]]??p[trade]?.s||70; }
function getTradePhone(trade) { return { hvac:'(850) 403-9797',olumbing:'(850) 403-9798',electrical:'(850) 403-9799',orofing:'(850) 403-9800' }[trade]??'(850) 403-9797'; }
function buildTags(lead) { const t=[`trade:${lead.trade}`,`tier:${lead.lead_tier}`,`zip:${lead.zip}`]; if(lead.lead_tier==='emergency't) t.push('EMERGENCY'); if(lead.campaign_id)t.push(`campaign:${lead.campaign_id}`); return t; }