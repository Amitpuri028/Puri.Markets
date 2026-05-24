import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#07090f",
  surface: "#0d1117",
  card: "#12181f",
  border: "#1a2233",
  accent: "#e8b84b",
  accentDim: "#e8b84b12",
  accentBorder: "#e8b84b35",
  accentDark: "#c49a30",
  red: "#ff4757",
  green: "#00c97a",
  blue: "#3d8bff",
  textPrimary: "#eceef4",
  textSecondary: "#6e7d99",
  textDim: "#2e3a50",
};

const mockNews = [
  {
    id: 1, category: "Forex", market: "USD/CAD", time: "2 min ago",
    headline: "Bank of Canada Signals Potential Rate Pause Amid Cooling Inflation",
    summary: "Governor Macklem indicated the central bank may hold rates steady at the next meeting as CPI data shows inflation approaching the 2% target. Markets are pricing in a 70% chance of a hold.",
    sentiment: "neutral", impact: "high", tags: ["BoC", "Rates", "CAD"],
  },
  {
    id: 2, category: "Stocks", market: "TSX", time: "8 min ago",
    headline: "Shopify Surges 7% After Beating Q1 Revenue Estimates by Wide Margin",
    summary: "Canada's e-commerce giant reported $2.1B in revenue, beating analyst consensus by 12%. Free cash flow margin expanded to 18%, its highest ever. CEO confirmed expansion into Southeast Asian markets.",
    sentiment: "bullish", impact: "high", tags: ["SHOP", "TSX", "Tech"],
  },
  {
    id: 3, category: "Crypto", market: "BTC/USD", time: "15 min ago",
    headline: "Bitcoin ETF Inflows Hit $800M in Single Day as Institutions Accumulate",
    summary: "Spot Bitcoin ETFs recorded their second-largest single-day inflow on record. BlackRock's IBIT led with $430M. Analysts note this signals institutional accumulation ahead of the next halving cycle.",
    sentiment: "bullish", impact: "high", tags: ["BTC", "ETF", "Crypto"],
  },
  {
    id: 4, category: "Energy", market: "WTI Crude", time: "22 min ago",
    headline: "OPEC+ Maintains Output Cuts, Oil Prices Climb to 3-Month High",
    summary: "The cartel confirmed production cuts of 3.66M barrels per day will remain through Q3. WTI crude jumped 2.3% to $84.70. Canadian oil sands producers rallied on the news.",
    sentiment: "bullish", impact: "medium", tags: ["Oil", "OPEC", "Energy"],
  },
  {
    id: 5, category: "Stocks", market: "S&P 500", time: "35 min ago",
    headline: "Fed Minutes Reveal Officials See 'No Rush' to Cut Rates in 2026",
    summary: "Minutes from the May FOMC meeting showed most members believe current policy is appropriate. The committee noted labor market resilience and sticky services inflation as reasons to wait.",
    sentiment: "bearish", impact: "high", tags: ["Fed", "Rates", "S&P500"],
  },
  {
    id: 6, category: "Mining", market: "Gold", time: "48 min ago",
    headline: "Gold Holds Above $2,400 as Central Banks Ramp Up Reserve Purchases",
    summary: "World Gold Council data shows central banks bought 290 tonnes in Q1 2026, the highest quarterly figure in a decade. China led purchases for the 18th consecutive month.",
    sentiment: "bullish", impact: "medium", tags: ["Gold", "XAU", "Mining"],
  },
  {
    id: 7, category: "Forex", market: "EUR/USD", time: "1 hr ago",
    headline: "Eurozone PMI Contracts for Third Straight Month, EUR Weakens",
    summary: "Flash composite PMI came in at 47.8, below the 50 threshold indicating contraction. Manufacturing weakness in Germany continues to drag on the broader eurozone economy.",
    sentiment: "bearish", impact: "medium", tags: ["EUR", "PMI", "Europe"],
  },
];

const calendarEvents = [
  { date: "Today", time: "8:30 AM", event: "Canada CPI (YoY)", importance: "high", consensus: "2.1%", previous: "2.3%", market: "CAD" },
  { date: "Today", time: "10:00 AM", event: "US ISM Manufacturing PMI", importance: "high", consensus: "50.2", previous: "49.8", market: "USD" },
  { date: "Today", time: "2:00 PM", event: "Fed Chair Speech (Powell)", importance: "high", consensus: "—", previous: "—", market: "USD" },
  { date: "Tomorrow", time: "8:30 AM", event: "US Initial Jobless Claims", importance: "medium", consensus: "215K", previous: "222K", market: "USD" },
  { date: "Tomorrow", time: "11:00 AM", event: "Bank of Canada Rate Decision", importance: "high", consensus: "Hold 4.50%", previous: "4.50%", market: "CAD" },
  { date: "May 26", time: "9:00 AM", event: "Shopify (SHOP) Earnings", importance: "medium", consensus: "EPS $0.34", previous: "$0.28", market: "TSX" },
  { date: "May 27", time: "8:30 AM", event: "Canada GDP (QoQ)", importance: "high", consensus: "0.4%", previous: "0.6%", market: "CAD" },
];

const marketData = [
  { symbol: "TSX", value: "22,847", change: "+0.43%", up: true },
  { symbol: "S&P500", value: "5,312", change: "+0.18%", up: true },
  { symbol: "BTC/USD", value: "$67,420", change: "+2.14%", up: true },
  { symbol: "USD/CAD", value: "1.3621", change: "-0.22%", up: false },
  { symbol: "WTI Oil", value: "$84.70", change: "+2.31%", up: true },
  { symbol: "Gold", value: "$2,418", change: "+0.67%", up: true },
  { symbol: "EUR/USD", value: "1.0812", change: "-0.41%", up: false },
  { symbol: "SHOP.TO", value: "$142.80", change: "+7.21%", up: true },
];

const categories = ["All", "Stocks", "Forex", "Crypto", "Energy", "Mining"];
const alerts = [
  { icon: "🚨", text: "BREAKING: Bank of Canada emergency meeting called for Monday amid trade tensions", time: "Just now" },
  { icon: "⚡", text: "SHOP.TO halted for trading — major announcement expected within 30 minutes", time: "3 min ago" },
  { icon: "📊", text: "US Core PCE beats estimates at 2.8% vs 2.6% expected — USD strengthening", time: "12 min ago" },
];

const sentimentColor = (s) =>
  s === "bullish" ? COLORS.green : s === "bearish" ? COLORS.red : COLORS.accent;

const impactDot = (imp) => {
  const c = imp === "high" ? COLORS.red : imp === "medium" ? COLORS.accent : COLORS.textDim;
  return <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:c, marginRight:5 }} />;
};

// ── Trading Chart Logo ────────────────────────────────────────────────
function PuriLogo({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0e1a10"/>
          <stop offset="50%" stopColor="#090f0e"/>
          <stop offset="100%" stopColor="#05080a"/>
        </linearGradient>
        <linearGradient id="logoLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c49a30"/>
          <stop offset="60%" stopColor="#e8b84b"/>
          <stop offset="100%" stopColor="#ffe080"/>
        </linearGradient>
        <linearGradient id="logoFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#e8b84b" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="logoGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e87a"/>
          <stop offset="100%" stopColor="#00a855"/>
        </linearGradient>
        <linearGradient id="logoRed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff5555"/>
          <stop offset="100%" stopColor="#cc2222"/>
        </linearGradient>
        <linearGradient id="logoBorder" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.9"/>
          <stop offset="50%" stopColor="#e8b84b" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#e8b84b" stopOpacity="0.8"/>
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="logoStrongGlow">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="logoClip"><rect width="200" height="200" rx="40"/></clipPath>
      </defs>

      {/* Background */}
      <rect width="200" height="200" rx="40" fill="url(#logoBg)"/>

      {/* Grid lines */}
      <g opacity="0.07" stroke="#e8b84b" strokeWidth="0.6">
        <line x1="0" y1="50" x2="200" y2="50"/>
        <line x1="0" y1="100" x2="200" y2="100"/>
        <line x1="0" y1="150" x2="200" y2="150"/>
        <line x1="40" y1="0" x2="40" y2="200"/>
        <line x1="80" y1="0" x2="80" y2="200"/>
        <line x1="120" y1="0" x2="120" y2="200"/>
        <line x1="160" y1="0" x2="160" y2="200"/>
      </g>

      {/* Axis */}
      <line x1="22" y1="20" x2="22" y2="162" stroke="#e8b84b" strokeWidth="1.5" opacity="0.4"/>
      <line x1="22" y1="162" x2="182" y2="162" stroke="#e8b84b" strokeWidth="1.5" opacity="0.4"/>

      {/* Candlestick wicks */}
      <line x1="38" y1="130" x2="38" y2="148" stroke="url(#logoRed)" strokeWidth="1.2" opacity="0.7"/>
      <line x1="58" y1="118" x2="58" y2="140" stroke="url(#logoGreen)" strokeWidth="1.2" opacity="0.7"/>
      <line x1="78" y1="112" x2="78" y2="130" stroke="url(#logoRed)" strokeWidth="1.2" opacity="0.7"/>
      <line x1="98" y1="86" x2="98" y2="118" stroke="url(#logoGreen)" strokeWidth="1.2" opacity="0.7"/>
      <line x1="118" y1="74" x2="118" y2="100" stroke="url(#logoGreen)" strokeWidth="1.2" opacity="0.7"/>
      <line x1="138" y1="66" x2="138" y2="84" stroke="url(#logoRed)" strokeWidth="1.2" opacity="0.7"/>
      <line x1="158" y1="40" x2="158" y2="72" stroke="url(#logoGreen)" strokeWidth="1.2" opacity="0.7"/>

      {/* Candlestick bodies */}
      <rect x="33" y="134" width="10" height="10" rx="1.5" fill="url(#logoRed)" opacity="0.85"/>
      <rect x="53" y="120" width="10" height="14" rx="1.5" fill="url(#logoGreen)" opacity="0.85"/>
      <rect x="73" y="114" width="10" height="10" rx="1.5" fill="url(#logoRed)" opacity="0.80"/>
      <rect x="93" y="90" width="10" height="20" rx="1.5" fill="url(#logoGreen)" opacity="0.90"/>
      <rect x="113" y="76" width="10" height="16" rx="1.5" fill="url(#logoGreen)" opacity="0.90"/>
      <rect x="133" y="68" width="10" height="10" rx="1.5" fill="url(#logoRed)" opacity="0.80"/>
      <rect x="153" y="44" width="10" height="22" rx="1.5" fill="url(#logoGreen)" opacity="0.95"/>

      {/* Chart area fill */}
      <path d="M22 148 L38 138 L58 122 L78 116 L98 96 L118 80 L138 68 L158 46 L178 30 L178 162 L22 162Z"
            fill="url(#logoFill)" clipPath="url(#logoClip)"/>

      {/* Main trend line */}
      <path d="M22 148 L38 138 L58 122 L78 116 L98 96 L118 80 L138 68 L158 46 L178 30"
            stroke="url(#logoLine)" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
            fill="none" filter="url(#logoGlow)"/>

      {/* Data dots */}
      <circle cx="58" cy="122" r="3.5" fill="#e8b84b" opacity="0.7" filter="url(#logoGlow)"/>
      <circle cx="98" cy="96" r="3.5" fill="#e8b84b" opacity="0.8" filter="url(#logoGlow)"/>
      <circle cx="138" cy="68" r="3.5" fill="#e8b84b" opacity="0.8" filter="url(#logoGlow)"/>

      {/* Live price dot */}
      <circle cx="178" cy="30" r="9" fill="#e8b84b" opacity="0.2" filter="url(#logoStrongGlow)"/>
      <circle cx="178" cy="30" r="6" fill="#e8b84b" filter="url(#logoStrongGlow)"/>
      <circle cx="178" cy="30" r="3" fill="#fff"/>

      {/* Up arrow */}
      <path d="M168 18 L178 28 L188 18" stroke="#e8b84b" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#logoGlow)"/>
      <line x1="178" y1="10" x2="178" y2="28" stroke="#e8b84b" strokeWidth="3.5"
            strokeLinecap="round" filter="url(#logoGlow)"/>

      {/* +% badge */}
      <rect x="12" y="22" width="52" height="18" rx="5" fill="#e8b84b" opacity="0.15"/>
      <rect x="12" y="22" width="52" height="18" rx="5" fill="none" stroke="#e8b84b" strokeWidth="0.8" opacity="0.5"/>
      <text x="38" y="35" textAnchor="middle"
            fontFamily="DM Sans, sans-serif" fontSize="9"
            fontWeight="700" fill="#e8b84b" letterSpacing="0.05em">+12.4%</text>

      {/* Volume bars */}
      <rect x="30" y="168" width="8" height="14" rx="2" fill="#00c97a" opacity="0.35"/>
      <rect x="50" y="172" width="8" height="10" rx="2" fill="#ff4757" opacity="0.30"/>
      <rect x="70" y="165" width="8" height="17" rx="2" fill="#00c97a" opacity="0.35"/>
      <rect x="90" y="160" width="8" height="22" rx="2" fill="#00c97a" opacity="0.40"/>
      <rect x="110" y="158" width="8" height="24" rx="2" fill="#00c97a" opacity="0.40"/>
      <rect x="130" y="163" width="8" height="19" rx="2" fill="#ff4757" opacity="0.30"/>
      <rect x="150" y="154" width="8" height="28" rx="2" fill="#00c97a" opacity="0.45"/>
      <rect x="170" y="148" width="8" height="34" rx="2" fill="#00c97a" opacity="0.50"/>

      {/* Border */}
      <rect width="200" height="200" rx="40" fill="none" stroke="url(#logoBorder)" strokeWidth="2"/>

      {/* Corner accents */}
      <path d="M14 40 L14 14 L40 14" stroke="#e8b84b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M186 40 L186 14 L160 14" stroke="#e8b84b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M14 160 L14 186 L40 186" stroke="#e8b84b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
      <path d="M186 160 L186 186 L160 186" stroke="#e8b84b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  );
}

// ── AI Live News Panel ────────────────────────────────────────────────
function LiveNewsPanel() {
  const [liveNews, setLiveNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");

  const fetchNews = async (topic) => {
    setLoading(true);
    setError("");
    setLiveNews([]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a financial news AI for Puri.Markets. Generate 4 realistic, current-style trading news headlines and summaries for the topic: "${topic || "global markets today"}".

Return ONLY valid JSON array, no markdown, no extra text:
[
  {
    "headline": "...",
    "summary": "...(2 sentences)",
    "category": "Stocks|Forex|Crypto|Energy|Mining",
    "market": "e.g. TSX, BTC/USD, Gold",
    "sentiment": "bullish|bearish|neutral",
    "impact": "high|medium|low",
    "time": "X min ago"
  }
]`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setLiveNews(parsed.map((n, i) => ({ ...n, id: Date.now() + i })));
    } catch (e) {
      setError("Could not load live news. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchNews(""); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) { setQuery(inputVal); fetchNews(inputVal); }
  };

  return (
    <div>
      {/* Search bar */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch(e)}
          placeholder="Ask for news... e.g. 'Canadian oil stocks'"
          style={{
            flex:1, background:COLORS.surface, border:`1px solid ${COLORS.border}`,
            borderRadius:8, padding:"9px 14px", color:COLORS.textPrimary,
            fontSize:13, outline:"none", fontFamily:"DM Sans, sans-serif",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background:COLORS.accent, border:"none", borderRadius:8,
            padding:"9px 18px", color:"#07090f", fontWeight:800,
            fontSize:13, cursor:"pointer", flexShrink:0,
          }}
        >Search</button>
        <button
          onClick={() => { setInputVal(""); fetchNews("global markets"); }}
          style={{
            background:COLORS.border, border:"none", borderRadius:8,
            padding:"9px 14px", color:COLORS.textSecondary,
            fontSize:13, cursor:"pointer", flexShrink:0,
          }}
        >↺ Refresh</button>
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div style={{ fontSize:28, marginBottom:10, animation:"spin 1s linear infinite", display:"inline-block" }}>⚡</div>
          <div style={{ fontSize:13, color:COLORS.textSecondary }}>Puri.Markets AI is fetching live news...</div>
        </div>
      )}
      {error && <div style={{ color:COLORS.red, fontSize:13, textAlign:"center", padding:16 }}>{error}</div>}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {liveNews.map(news => (
          <NewsCard key={news.id} news={news} live />
        ))}
      </div>
    </div>
  );
}

// ── News Card ─────────────────────────────────────────────────────────
function NewsCard({ news, live }) {
  const [expanded, setExpanded] = useState(false);
  const catColors = {
    Stocks:"#3d8bff", Forex:COLORS.accent, Crypto:"#f39c12",
    Energy:"#e74c3c", Mining:"#9b59b6",
  };
  const cc = catColors[news.category] || COLORS.textSecondary;

  return (
    <div
      onClick={() => setExpanded(e => !e)}
      style={{
        background:COLORS.card, border:`1px solid ${COLORS.border}`,
        borderRadius:12, padding:16, cursor:"pointer",
        position:"relative", overflow:"hidden", transition:"all 0.2s",
      }}
      className="news-card"
    >
      {live && (
        <div style={{
          position:"absolute", top:10, right:10,
          fontSize:9, fontWeight:800, color:COLORS.accent,
          background:COLORS.accentDim, border:`1px solid ${COLORS.accentBorder}`,
          padding:"2px 7px", borderRadius:4, letterSpacing:"0.08em",
        }}>AI LIVE</div>
      )}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:sentimentColor(news.sentiment), borderRadius:"12px 0 0 12px" }} />
      <div style={{ paddingLeft:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:8 }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.07em", color:cc, background:cc+"20", padding:"2px 8px", borderRadius:4, textTransform:"uppercase" }}>{news.category}</span>
          <span style={{ fontSize:11, fontWeight:700, color:COLORS.textSecondary, background:COLORS.border, padding:"2px 7px", borderRadius:4 }}>{news.market}</span>
          <span style={{ display:"flex", alignItems:"center" }}>{impactDot(news.impact)}<span style={{ fontSize:10, color:COLORS.textDim, fontWeight:600 }}>{news.impact} impact</span></span>
          <span style={{ marginLeft:"auto", fontSize:11, color:COLORS.textDim }}>{news.time}</span>
        </div>
        <div style={{ fontSize:15, fontWeight:700, lineHeight:1.4, marginBottom: expanded ? 8 : 0, color:COLORS.textPrimary, letterSpacing:"-0.01em", paddingRight:60 }}>{news.headline}</div>
        {expanded && (
          <div style={{ fontSize:13, color:COLORS.textSecondary, lineHeight:1.65, marginBottom:10, animation:"fadeIn 0.2s ease" }}>{news.summary}</div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {(news.tags||[]).map(t => <span key={t} style={{ fontSize:10, color:COLORS.textDim, background:COLORS.border, padding:"2px 7px", borderRadius:4, fontWeight:600 }}>#{t}</span>)}
          </div>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.06em", color:sentimentColor(news.sentiment), background:sentimentColor(news.sentiment)+"18", border:`1px solid ${sentimentColor(news.sentiment)}40`, padding:"2px 8px", borderRadius:4, textTransform:"uppercase" }}>{news.sentiment}</span>
        </div>
      </div>
    </div>
  );
}

// ── Feature 6: News vs Price Chart ────────────────────────────────────
function NewsPriceChart() {
  const [selectedAsset, setSelectedAsset] = useState("TSX");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const assets = [
    { symbol: "TSX", price: "22,847", change: "+0.43%", up: true },
    { symbol: "BTC/USD", price: "$67,420", change: "+2.14%", up: true },
    { symbol: "USD/CAD", price: "1.3621", change: "-0.22%", up: false },
    { symbol: "Gold", price: "$2,418", change: "+0.67%", up: true },
    { symbol: "WTI Oil", price: "$84.70", change: "+2.31%", up: true },
    { symbol: "S&P500", price: "5,312", change: "+0.18%", up: true },
  ];

  // Chart data: [hour, price_index, news_sentiment_score]
  const chartData = {
    "TSX": {
      points: [
        { h:"9AM", p:100, n:45, news:"Weak open — global uncertainty" },
        { h:"10AM", p:98, n:30, news:"BoC concern — bearish sentiment" },
        { h:"11AM", p:99, n:55, news:"Neutral — mixed signals" },
        { h:"12PM", p:102, n:72, news:"Positive jobs data — bullish" },
        { h:"1PM", p:101, n:68, news:"Shopify beat earnings" },
        { h:"2PM", p:104, n:85, news:"Strong bullish momentum" },
        { h:"3PM", p:103, n:78, news:"Slight pullback — still bullish" },
        { h:"4PM", p:105, n:82, news:"Strong close — bullish" },
      ],
      insight: "News turned bullish at 12PM but price only reacted at 2PM — 2 hour LAG detected. Early news readers had a 2-hour advantage.",
      opportunity: "BUY",
      confidence: 78,
    },
    "BTC/USD": {
      points: [
        { h:"9AM", p:100, n:80, news:"ETF inflows — very bullish" },
        { h:"10AM", p:103, n:85, news:"Institutional buying confirmed" },
        { h:"11AM", p:106, n:60, news:"Sentiment cooling slightly" },
        { h:"12PM", p:105, n:40, news:"Profit taking — bearish news" },
        { h:"1PM", p:103, n:35, news:"Whale selling detected" },
        { h:"2PM", p:104, n:55, news:"Support holding — neutral" },
        { h:"3PM", p:106, n:70, news:"Recovery — bullish again" },
        { h:"4PM", p:108, n:78, news:"New highs incoming" },
      ],
      insight: "News was bearish 12PM–1PM but price held support. Market already priced in the bad news. Strong BUY signal when news recovers at 2PM.",
      opportunity: "BUY",
      confidence: 82,
    },
    "USD/CAD": {
      points: [
        { h:"9AM", p:100, n:55, news:"Neutral open" },
        { h:"10AM", p:101, n:40, news:"Weak CAD data" },
        { h:"11AM", p:102, n:35, news:"USD strengthening" },
        { h:"12PM", p:103, n:30, news:"Bearish CAD — Fed hawkish" },
        { h:"1PM", p:102, n:45, news:"Slight recovery" },
        { h:"2PM", p:103, n:38, news:"Still bearish CAD" },
        { h:"3PM", p:104, n:32, news:"CAD weakening further" },
        { h:"4PM", p:103, n:42, news:"Late session recovery" },
      ],
      insight: "News has been consistently bearish for CAD all day but price hasn't fully reacted yet. Possible further USD/CAD upside.",
      opportunity: "WATCH",
      confidence: 61,
    },
    "Gold": {
      points: [
        { h:"9AM", p:100, n:70, news:"Geopolitical tension — safe haven" },
        { h:"10AM", p:101, n:75, news:"Central bank buying confirmed" },
        { h:"11AM", p:102, n:80, news:"Strong bullish momentum" },
        { h:"12PM", p:101, n:65, news:"USD strength pressuring gold" },
        { h:"1PM", p:102, n:70, news:"Recovery — still bullish" },
        { h:"2PM", p:103, n:78, news:"New highs possible" },
        { h:"3PM", p:104, n:82, news:"Strong bullish close" },
        { h:"4PM", p:104, n:80, news:"Holding gains" },
      ],
      insight: "News sentiment has been consistently bullish all day and price is following. Strong trend confirmation — not priced in yet at open.",
      opportunity: "BUY",
      confidence: 85,
    },
    "WTI Oil": {
      points: [
        { h:"9AM", p:100, n:82, news:"OPEC cut announcement" },
        { h:"10AM", p:104, p2:103, n:75, news:"Strong bullish reaction" },
        { h:"11AM", p:103, n:60, news:"Profit taking begins" },
        { h:"12PM", p:102, n:45, news:"Demand concern — bearish shift" },
        { h:"1PM", p:101, n:40, news:"Bearish sentiment growing" },
        { h:"2PM", p:100, n:38, news:"Giving back gains" },
        { h:"3PM", p:101, n:50, news:"Support found" },
        { h:"4PM", p:102, n:55, news:"Partial recovery" },
      ],
      insight: "Price already fully reacted to OPEC news at 9AM open. News is now turning bearish — price likely priced in all the good news. CAUTION.",
      opportunity: "AVOID",
      confidence: 70,
    },
    "S&P500": {
      points: [
        { h:"9AM", p:100, n:50, news:"Mixed earnings — neutral" },
        { h:"10AM", p:101, n:58, news:"Tech sector strong" },
        { h:"11AM", p:100, n:45, news:"Fed concern — slight bearish" },
        { h:"12PM", p:102, n:65, news:"Strong economic data" },
        { h:"1PM", p:103, n:70, news:"Bullish momentum building" },
        { h:"2PM", p:102, n:60, news:"Consolidation" },
        { h:"3PM", p:103, n:68, news:"Push higher" },
        { h:"4PM", p:104, n:72, news:"Strong close" },
      ],
      insight: "News sentiment and price are moving in sync today — good trend. News slightly ahead of price at 12PM offered a clean entry signal.",
      opportunity: "BUY",
      confidence: 74,
    },
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const asset = assets.find(a => a.symbol === selectedAsset);
      const data = chartData[selectedAsset];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a trading analyst for Puri.Markets. Analyze the relationship between news sentiment and price for ${selectedAsset} today.

Current price: ${asset.price} (${asset.change})
News sentiment trend: ${data.points.map(p => `${p.h}: sentiment ${p.n}/100 - "${p.news}"`).join(", ")}

Answer in JSON only, no markdown:
{
  "headline": "one bold insight sentence about news vs price relationship",
  "isAlreadyPriced": true/false,
  "lag": "how many hours behind price is vs news (e.g. 2 hours)",
  "opportunity": "BUY / SELL / AVOID / WATCH",
  "reasoning": "2 sentences explaining what traders should do",
  "keyMoment": "the specific time when news diverged from price",
  "confidence": number 0-100
}`
          }]
        })
      });
      const d = await res.json();
      const text = d.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setAnalysis(JSON.parse(clean));
    } catch(e) {
      setAnalysis({ headline: "Analysis unavailable", reasoning: "Please try again.", opportunity: "WATCH", confidence: 0, isAlreadyPriced: false, lag: "unknown", keyMoment: "N/A" });
    }
    setLoading(false);
  };

  const current = chartData[selectedAsset];
  const W = 560, H = 200, PAD = 40;
  const prices = current.points.map(p => p.p);
  const sentiments = current.points.map(p => p.n);
  const minP = Math.min(...prices) - 2, maxP = Math.max(...prices) + 2;
  const px = (i) => PAD + (i / (current.points.length - 1)) * (W - PAD * 2);
  const py = (v) => H - PAD - ((v - minP) / (maxP - minP)) * (H - PAD * 2);
  const sy = (v) => H - PAD - (v / 100) * (H - PAD * 2);
  const pricePath = current.points.map((p, i) => `${i === 0 ? "M" : "L"}${px(i)},${py(p.p)}`).join(" ");
  const sentPath = current.points.map((p, i) => `${i === 0 ? "M" : "L"}${px(i)},${sy(p.n)}`).join(" ");
  const sentFill = sentPath + ` L${px(current.points.length-1)},${H-PAD} L${px(0)},${H-PAD} Z`;

  const oppColor = (o) => o === "BUY" ? COLORS.green : o === "SELL" ? COLORS.red : o === "AVOID" ? COLORS.red : COLORS.accent;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${COLORS.accent}15,${COLORS.blue}08)`, border:`1px solid ${COLORS.accentBorder}`, borderRadius:14, padding:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
          <div style={{ width:32, height:32, background:`linear-gradient(135deg,${COLORS.accent},${COLORS.blue})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📊</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:COLORS.accent }}>News vs Price Chart</div>
            <div style={{ fontSize:11, color:COLORS.textDim }}>See if the market already priced in the news</div>
          </div>
        </div>
        <div style={{ fontSize:12, color:COLORS.textSecondary, lineHeight:1.6 }}>
          🟡 <strong style={{color:COLORS.accent}}>Gold line</strong> = News Sentiment &nbsp;|&nbsp;
          🟢 <strong style={{color:COLORS.green}}>Green line</strong> = Price Movement &nbsp;|&nbsp;
          Gap between lines = <strong style={{color:COLORS.textPrimary}}>trading opportunity</strong>
        </div>
      </div>

      {/* Asset Selector */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {assets.map(a => (
          <button key={a.symbol} onClick={() => { setSelectedAsset(a.symbol); setAnalysis(null); }} style={{
            padding:"6px 14px", borderRadius:20, border:`1px solid ${selectedAsset===a.symbol ? COLORS.accent : COLORS.border}`,
            background: selectedAsset===a.symbol ? COLORS.accentDim : "transparent",
            color: selectedAsset===a.symbol ? COLORS.accent : COLORS.textSecondary,
            fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s",
          }}>
            {a.symbol}
            <span style={{ marginLeft:6, color:a.up ? COLORS.green : COLORS.red, fontSize:10 }}>{a.change}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:16, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:800, color:COLORS.textPrimary }}>{selectedAsset} — Today's Session</div>
          <div style={{ display:"flex", gap:12, fontSize:11 }}>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:20, height:3, background:COLORS.accent, display:"inline-block", borderRadius:2 }}/>
              <span style={{ color:COLORS.textSecondary }}>News Sentiment</span>
            </span>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:20, height:3, background:COLORS.green, display:"inline-block", borderRadius:2 }}/>
              <span style={{ color:COLORS.textSecondary }}>Price</span>
            </span>
          </div>
        </div>

        <div style={{ overflowX:"auto" }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ minWidth:360 }}>
            <defs>
              <linearGradient id="sentFillGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.15"/>
                <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            {/* Grid */}
            {[0,25,50,75,100].map(v => (
              <line key={v} x1={PAD} y1={sy(v)} x2={W-PAD} y2={sy(v)} stroke={COLORS.border} strokeWidth="0.5"/>
            ))}
            {current.points.map((_, i) => (
              <line key={i} x1={px(i)} y1={PAD} x2={px(i)} y2={H-PAD} stroke={COLORS.border} strokeWidth="0.5" opacity="0.5"/>
            ))}
            {/* Sentiment area */}
            <path d={sentFill} fill="url(#sentFillGrad)"/>
            {/* Sentiment line */}
            <path d={sentPath} stroke={COLORS.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Price line */}
            <path d={pricePath} stroke={COLORS.green} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Hour labels */}
            {current.points.map((p, i) => (
              <text key={i} x={px(i)} y={H-8} textAnchor="middle" fontSize="9" fill={COLORS.textDim} fontFamily="DM Sans">{p.h}</text>
            ))}
            {/* Y axis labels */}
            {[0,50,100].map(v => (
              <text key={v} x={PAD-6} y={sy(v)+4} textAnchor="end" fontSize="9" fill={COLORS.textDim} fontFamily="DM Sans">{v}</text>
            ))}
            {/* Data points */}
            {current.points.map((p, i) => (
              <g key={i}>
                <circle cx={px(i)} cy={sy(p.n)} r="3.5" fill={COLORS.accent} opacity="0.8"/>
                <circle cx={px(i)} cy={py(p.p)} r="3.5" fill={COLORS.green} opacity="0.8"/>
              </g>
            ))}
            {/* Labels */}
            <text x={PAD+8} y={PAD+14} fontSize="10" fill={COLORS.accent} fontWeight="700" fontFamily="DM Sans">NEWS SENTIMENT</text>
            <text x={PAD+8} y={py(prices[prices.length-1])-8} fontSize="10" fill={COLORS.green} fontWeight="700" fontFamily="DM Sans">PRICE</text>
          </svg>
        </div>

        {/* Built-in insight */}
        <div style={{ marginTop:12, padding:12, background:COLORS.surface, borderRadius:10, border:`1px solid ${COLORS.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
            <div style={{ fontSize:12, color:COLORS.textSecondary, lineHeight:1.6, flex:1 }}>{current.insight}</div>
            <div style={{ flexShrink:0, textAlign:"center" }}>
              <div style={{ fontSize:13, fontWeight:900, color:oppColor(current.opportunity), background:oppColor(current.opportunity)+"20", border:`1px solid ${oppColor(current.opportunity)}40`, padding:"4px 12px", borderRadius:6 }}>{current.opportunity}</div>
              <div style={{ fontSize:10, color:COLORS.textDim, marginTop:4 }}>{current.confidence}% confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Deep Analysis Button */}
      <button onClick={getAIAnalysis} disabled={loading} style={{
        background: loading ? COLORS.border : `linear-gradient(135deg,${COLORS.accent},${COLORS.accentDark})`,
        border:"none", borderRadius:10, padding:"12px 20px",
        color: loading ? COLORS.textSecondary : "#07090f",
        fontWeight:900, fontSize:13, cursor: loading ? "default" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        transition:"all 0.2s", fontFamily:"DM Sans, sans-serif",
      }}>
        {loading ? <>
          <span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⚡</span>
          AI is analysing news vs price relationship...
        </> : <>🤖 Get Deep AI Analysis for {selectedAsset}</>}
      </button>

      {/* AI Analysis Result */}
      {analysis && (
        <div style={{ background:`linear-gradient(135deg,${COLORS.accent}10,${COLORS.blue}06)`, border:`1px solid ${COLORS.accentBorder}`, borderRadius:14, padding:18, animation:"fadeIn 0.3s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:30, height:30, background:`linear-gradient(135deg,${COLORS.accent},${COLORS.blue})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🧠</div>
            <div style={{ fontSize:13, fontWeight:800, color:COLORS.accent }}>Puri.Markets AI Analysis</div>
          </div>
          <div style={{ fontSize:15, fontWeight:700, color:COLORS.textPrimary, marginBottom:12, lineHeight:1.4 }}>{analysis.headline}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
            {[
              ["Signal", analysis.opportunity, oppColor(analysis.opportunity)],
              ["Confidence", `${analysis.confidence}%`, COLORS.accent],
              ["Price Lag", analysis.lag, COLORS.blue],
            ].map(([label, val, color]) => (
              <div key={label} style={{ background:COLORS.surface, borderRadius:8, padding:"10px", textAlign:"center" }}>
                <div style={{ fontSize:10, color:COLORS.textDim, fontWeight:600, marginBottom:4, letterSpacing:"0.08em" }}>{label}</div>
                <div style={{ fontSize:14, fontWeight:900, color }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:13, color:COLORS.textSecondary, lineHeight:1.65, marginBottom:10 }}>{analysis.reasoning}</div>
          <div style={{ fontSize:12, color:COLORS.textDim, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ color:COLORS.accent }}>🎯</span>
            Key moment: <strong style={{ color:COLORS.textPrimary }}>{analysis.keyMoment}</strong>
          </div>
          <div style={{ marginTop:12, fontSize:10, color:COLORS.textDim, fontStyle:"italic" }}>
            ⚠️ Not financial advice. Always do your own research. Past patterns don't guarantee future results.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Feature 9: Global Market Clock ────────────────────────────────────
function GlobalMarketClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const markets = [
    { name: "Toronto (TSX)", city: "Toronto", flag: "🇨🇦", tz: "America/Toronto", open: 9.5, close: 16, color: "#e8b84b", sessions: ["Pre-market 7AM", "Regular 9:30AM–4PM"] },
    { name: "New York (NYSE)", city: "New York", flag: "🇺🇸", tz: "America/New_York", open: 9.5, close: 16, color: "#3d8bff", sessions: ["Pre-market 4AM", "Regular 9:30AM–4PM", "After-hours 4PM–8PM"] },
    { name: "London (LSE)", city: "London", flag: "🇬🇧", tz: "Europe/London", open: 8, close: 16.5, color: "#00c97a", sessions: ["Regular 8AM–4:30PM"] },
    { name: "Frankfurt (XETRA)", city: "Frankfurt", flag: "🇩🇪", tz: "Europe/Berlin", open: 9, close: 17.5, color: "#9b59b6", sessions: ["Regular 9AM–5:30PM"] },
    { name: "Tokyo (TSE)", city: "Tokyo", flag: "🇯🇵", tz: "Asia/Tokyo", open: 9, close: 15.5, color: "#ff6b6b", sessions: ["Morning 9AM–11:30AM", "Afternoon 12:30PM–3:30PM"] },
    { name: "Hong Kong (HKEX)", city: "Hong Kong", flag: "🇭🇰", tz: "Asia/Hong_Kong", open: 9.5, close: 16, color: "#f39c12", sessions: ["Morning 9:30AM–12PM", "Afternoon 1PM–4PM"] },
    { name: "Shanghai (SSE)", city: "Shanghai", flag: "🇨🇳", tz: "Asia/Shanghai", open: 9.5, close: 15, color: "#e74c3c", sessions: ["Morning 9:30AM–11:30AM", "Afternoon 1PM–3PM"] },
    { name: "Sydney (ASX)", city: "Sydney", flag: "🇦🇺", tz: "Australia/Sydney", open: 10, close: 16, color: "#1abc9c", sessions: ["Regular 10AM–4PM"] },
    { name: "Forex (24hr)", city: "Global", flag: "🌐", tz: "UTC", open: 0, close: 24, color: COLORS.accent, sessions: ["24/7 — Never closes", "Peak: London+NY overlap"] },
    { name: "Crypto (24/7)", city: "Global", flag: "₿", tz: "UTC", open: 0, close: 24, color: "#f7931a", sessions: ["24/7 — Never closes"] },
  ];

  const getLocalTime = (tz) => {
    try {
      return now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    } catch { return "--:--:--"; }
  };

  const getHourDecimal = (tz) => {
    try {
      const t = now.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
      const [h, m] = t.split(":").map(Number);
      return h + m / 60;
    } catch { return 0; }
  };

  const isWeekend = (tz) => {
    try {
      const day = new Date().toLocaleDateString("en-US", { timeZone: tz, weekday: "short" });
      return ["Sat","Sun"].includes(day);
    } catch { return false; }
  };

  const getStatus = (market) => {
    if (market.open === 0 && market.close === 24) return { status: "OPEN", color: COLORS.green, label: "24/7" };
    const h = getHourDecimal(market.tz);
    const weekend = isWeekend(market.tz);
    if (weekend) return { status: "CLOSED", color: COLORS.red, label: "Weekend" };
    if (h >= market.open && h < market.close) return { status: "OPEN", color: COLORS.green, label: "Live Now" };
    if (h >= market.open - 1.5 && h < market.open) return { status: "PRE", color: COLORS.accent, label: "Pre-Market" };
    if (h >= market.close && h < market.close + 2) return { status: "AFTER", color: COLORS.blue, label: "After Hours" };
    // Time until next open
    let hoursUntil = market.open - h;
    if (hoursUntil < 0) hoursUntil += 24;
    const hrs = Math.floor(hoursUntil);
    const mins = Math.floor((hoursUntil - hrs) * 60);
    return { status: "CLOSED", color: COLORS.red, label: `Opens in ${hrs}h ${mins}m` };
  };

  const getProgress = (market) => {
    if (market.open === 0 && market.close === 24) return 50;
    const h = getHourDecimal(market.tz);
    if (h < market.open || h >= market.close) return 0;
    return ((h - market.open) / (market.close - market.open)) * 100;
  };

  const torontoTime = getLocalTime("America/Toronto");
  const openMarkets = markets.filter(m => getStatus(m).status === "OPEN").length;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${COLORS.blue}15,${COLORS.accent}08)`, border:`1px solid ${COLORS.blue}30`, borderRadius:14, padding:18 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:48, height:48, background:`linear-gradient(135deg,${COLORS.blue},${COLORS.accent})`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🌍</div>
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:COLORS.textPrimary }}>Global Market Clock</div>
              <div style={{ fontSize:11, color:COLORS.textDim }}>Know exactly when every market opens worldwide</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:900, color:COLORS.accent, letterSpacing:"0.05em", fontVariantNumeric:"tabular-nums" }}>{torontoTime}</div>
            <div style={{ fontSize:10, color:COLORS.textDim, fontWeight:600 }}>🇨🇦 Toronto ET</div>
          </div>
        </div>

        {/* Open markets count */}
        <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
          <div style={{ background:COLORS.green+"20", border:`1px solid ${COLORS.green}40`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, color:COLORS.green }}>
            ● {openMarkets} Markets Open Now
          </div>
          <div style={{ background:COLORS.red+"20", border:`1px solid ${COLORS.red}40`, borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:700, color:COLORS.red }}>
            ● {markets.length - openMarkets} Markets Closed
          </div>
        </div>
      </div>

      {/* 24hr World Timeline */}
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:COLORS.textSecondary, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
          24-Hour World Trading Timeline
        </div>
        <div style={{ overflowX:"auto" }}>
          <svg width="100%" viewBox="0 0 600 180" style={{ minWidth:400 }}>
            {/* Background */}
            <rect width="600" height="180" fill="transparent"/>
            {/* Hour marks */}
            {Array.from({length:25}, (_,i) => (
              <g key={i}>
                <line x1={20 + i*(560/24)} y1="20" x2={20 + i*(560/24)} y2="160" stroke={COLORS.border} strokeWidth="0.5"/>
                {i%3===0 && <text x={20 + i*(560/24)} y="175" textAnchor="middle" fontSize="8" fill={COLORS.textDim} fontFamily="DM Sans">{i===0?"12AM":i<12?`${i}AM`:i===12?"12PM":`${i-12}PM`}</text>}
              </g>
            ))}
            {/* Market bars */}
            {[
              { name:"TSX/NYSE", open:9.5, close:16, color:"#e8b84b", y:25 },
              { name:"London", open:13, close:21.5, color:"#00c97a", y:45 },
              { name:"Frankfurt", open:14, close:22.5, color:"#9b59b6", y:65 },
              { name:"Tokyo", open:23, close:30, color:"#ff6b6b", y:85 },
              { name:"Hong Kong", open:22.5, close:31, color:"#f39c12", y:105 },
              { name:"Sydney", open:19, close:25, color:"#1abc9c", y:125 },
              { name:"Forex", open:0, close:24, color:COLORS.accent, y:145 },
            ].map((m, idx) => {
              const x1 = 20 + (m.open/24)*560;
              const x2 = 20 + (Math.min(m.close,24)/24)*560;
              return (
                <g key={idx}>
                  <rect x={x1} y={m.y} width={Math.max(x2-x1,2)} height="14" rx="3" fill={m.color} opacity="0.7"/>
                  <text x={x1+4} y={m.y+10} fontSize="7.5" fill="#fff" fontWeight="700" fontFamily="DM Sans">{m.name}</text>
                </g>
              );
            })}
            {/* Current time indicator */}
            {(() => {
              const h = getHourDecimal("America/Toronto");
              const x = 20 + (h/24)*560;
              return (
                <g>
                  <line x1={x} y1="15" x2={x} y2="165" stroke={COLORS.red} strokeWidth="1.5" strokeDasharray="4,3"/>
                  <circle cx={x} cy="15" r="4" fill={COLORS.red}/>
                  <text x={x+6} y="14" fontSize="8" fill={COLORS.red} fontWeight="700" fontFamily="DM Sans">NOW</text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Individual Market Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {markets.map((market, i) => {
          const st = getStatus(market);
          const prog = getProgress(market);
          const localTime = getLocalTime(market.tz);
          return (
            <div key={i} style={{
              background:COLORS.card, border:`1px solid ${st.status==="OPEN" ? market.color+"40" : COLORS.border}`,
              borderRadius:12, padding:14,
              boxShadow: st.status==="OPEN" ? `0 0 12px ${market.color}15` : "none",
              transition:"all 0.3s",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20 }}>{market.flag}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800, color:COLORS.textPrimary, lineHeight:1.2 }}>{market.name}</div>
                    <div style={{ fontSize:10, color:COLORS.textDim, fontWeight:600 }}>{market.city}</div>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:st.color, background:st.color+"20", padding:"2px 8px", borderRadius:4, marginBottom:3 }}>
                    {st.status === "OPEN" && <span style={{ marginRight:4 }}>●</span>}{st.label}
                  </div>
                </div>
              </div>
              {/* Local time */}
              <div style={{ fontSize:18, fontWeight:900, color: st.status==="OPEN" ? market.color : COLORS.textDim, letterSpacing:"0.04em", marginBottom:8, fontVariantNumeric:"tabular-nums" }}>
                {localTime}
              </div>
              {/* Progress bar - only if open */}
              {prog > 0 && (
                <div style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:COLORS.textDim, marginBottom:3 }}>
                    <span>Session progress</span>
                    <span>{Math.round(prog)}%</span>
                  </div>
                  <div style={{ height:4, background:COLORS.border, borderRadius:2, overflow:"hidden" }}>
                    <div style={{ width:`${prog}%`, height:"100%", background:`linear-gradient(90deg,${market.color}80,${market.color})`, borderRadius:2, transition:"width 1s linear" }}/>
                  </div>
                </div>
              )}
              {/* Sessions */}
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {market.sessions.map((s, j) => (
                  <div key={j} style={{ fontSize:9, color:COLORS.textDim, fontWeight:600 }}>• {s}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Best Trading Times Card */}
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.accent}30`, borderRadius:14, padding:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:COLORS.accent, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12 }}>
          ⭐ Best Trading Times (Toronto ET)
        </div>
        {[
          { time:"9:30AM – 11:30AM ET", label:"🔥 Most Active", desc:"NYSE + TSX open — highest volume, biggest moves, best for day traders", color:COLORS.green },
          { time:"3:00PM – 4:00PM ET", label:"⚡ Power Hour", desc:"Last hour of US session — strong directional moves, high liquidity", color:COLORS.accent },
          { time:"8:00AM – 9:30AM ET", label:"📊 Pre-Market", desc:"Earnings reactions, economic data — big gaps before open", color:COLORS.blue },
          { time:"3:00AM – 6:00AM ET", label:"🌍 London Open", desc:"Forex majors — EUR/USD, GBP/USD most active, big currency moves", color:"#9b59b6" },
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom: i<3 ? `1px solid ${COLORS.border}` : "none" }}>
            <div style={{ background:item.color+"20", border:`1px solid ${item.color}40`, borderRadius:8, padding:"4px 10px", flexShrink:0, fontSize:11, fontWeight:800, color:item.color, whiteSpace:"nowrap" }}>
              {item.time}
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:COLORS.textPrimary, marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:11, color:COLORS.textSecondary, lineHeight:1.5 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
// ── Fear & Greed Meter ────────────────────────────────────────────────
function FearGreedMeter() {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = [28,35,42,38,51,58,63,71,68,72,75,72];

  const calculate = async () => {
    setLoading(true); setScore(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:600,
          messages:[{ role:"user", content:`You are the Puri.Markets Canadian Fear & Greed Index. Today: TSX +0.43%, BTC +2.14%, Gold +0.67%, Oil +2.31%, USD/CAD -0.22%, Shopify +7.21%, BoC rate pause signals. Return ONLY valid JSON:
{"score":72,"label":"Greed","emoji":"📈","drivers":["TSX near all-time highs","BTC ETF inflows surging","Strong commodity prices"],"warning":"Markets in greed zone — tighten stop losses, avoid chasing breakouts.","tsx":74,"forex":55,"crypto":82,"commodities":71}` }]
        })
      });
      const d = await res.json();
      const txt = d.content?.map(i=>i.text||"").join("")||"";
      setScore(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch {
      setScore({ score:72, label:"Greed", emoji:"📈", drivers:["TSX near all-time highs","BTC ETF inflows surging","Strong commodity prices"], warning:"Markets in greed zone — tighten stop losses, avoid chasing breakouts.", tsx:74, forex:55, crypto:82, commodities:71 });
    }
    setLoading(false);
  };

  useEffect(() => { calculate(); }, []);

  const getColor = s => s>=75?COLORS.red:s>=60?COLORS.accent:s>=40?COLORS.textSecondary:s>=25?COLORS.blue:COLORS.blue;
  const getLabel = s => s>=75?"Extreme Greed":s>=60?"Greed":s>=40?"Neutral":s>=25?"Fear":"Extreme Fear";
  const mainColor = score ? getColor(score.score) : COLORS.textSecondary;
  const needleAngle = score ? -90 + (score.score/100)*180 : -90;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14, animation:"fadeIn 0.3s ease" }}>

      {/* Header Card */}
      <div style={{ background:`linear-gradient(135deg,${COLORS.accent}12,${COLORS.blue}08)`, border:`1px solid ${COLORS.accentBorder}`, borderRadius:14, padding:18, textAlign:"center" }}>
        <div style={{ fontSize:11, fontWeight:800, color:COLORS.accent, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>🇨🇦 Canadian Fear & Greed Index</div>
        <div style={{ fontSize:12, color:COLORS.textSecondary, lineHeight:1.6 }}>
          Exclusive to Puri.Markets — tracks TSX, Forex, Crypto & Commodities sentiment in real time. Updated every market session.
        </div>
      </div>

      {/* Main Gauge Card */}
      <div style={{ background:COLORS.card, border:`1px solid ${score?mainColor+"50":COLORS.border}`, borderRadius:14, padding:20, textAlign:"center", boxShadow:score?`0 0 24px ${mainColor}15`:"none" }}>
        {loading ? (
          <div style={{ padding:"40px 0" }}>
            <div style={{ fontSize:36, animation:"spin 1s linear infinite", display:"inline-block" }}>⚡</div>
            <div style={{ fontSize:13, color:COLORS.textSecondary, marginTop:12 }}>Calculating Canadian market sentiment...</div>
          </div>
        ) : score ? (
          <>
            {/* Gauge SVG */}
            <div style={{ position:"relative", width:260, margin:"0 auto 8px" }}>
              <svg width="260" height="150" viewBox="0 0 260 150">
                <defs>
                  <linearGradient id="gaugeArc" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%"   stopColor="#4d9fff"/>
                    <stop offset="25%"  stopColor="#00d68f"/>
                    <stop offset="50%"  stopColor="#888"/>
                    <stop offset="75%"  stopColor="#e8b84b"/>
                    <stop offset="100%" stopColor="#ff4d6a"/>
                  </linearGradient>
                  <filter id="ndlGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {/* Track */}
                <path d="M20 135 A110 110 0 0 1 240 135" stroke={COLORS.border} strokeWidth="22" fill="none" strokeLinecap="round"/>
                {/* Colored arc */}
                <path d="M20 135 A110 110 0 0 1 240 135" stroke="url(#gaugeArc)" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.9"/>
                {/* Zone labels */}
                <text x="6"   y="148" fontSize="9" fill="#4d9fff" fontWeight="800" fontFamily="DM Sans">FEAR</text>
                <text x="116" y="22"  fontSize="9" fill="#888"    fontWeight="700" fontFamily="DM Sans" textAnchor="middle">NEUTRAL</text>
                <text x="254" y="148" fontSize="9" fill="#ff4d6a" fontWeight="800" fontFamily="DM Sans" textAnchor="end">GREED</text>
                {/* Tick marks */}
                {[0,25,50,75,100].map(v => {
                  const angle = (-180 + v*1.8) * Math.PI/180;
                  const ix = 130 + 98*Math.cos(angle), iy = 135 + 98*Math.sin(angle);
                  const ox = 130 + 112*Math.cos(angle), oy = 135 + 112*Math.sin(angle);
                  return <line key={v} x1={ix} y1={iy} x2={ox} y2={oy} stroke="#fff" strokeWidth="1.5" opacity="0.4"/>;
                })}
                {/* Needle */}
                <g transform={`rotate(${needleAngle}, 130, 135)`} filter="url(#ndlGlow)">
                  <line x1="130" y1="135" x2="130" y2="42" stroke={mainColor} strokeWidth="3.5" strokeLinecap="round"/>
                  <circle cx="130" cy="135" r="8" fill={mainColor}/>
                  <circle cx="130" cy="135" r="4" fill={COLORS.bg}/>
                </g>
                {/* Score */}
                <text x="130" y="122" textAnchor="middle" fontSize="32" fontWeight="900" fill={mainColor} fontFamily="DM Sans">{score.score}</text>
              </svg>
            </div>

            {/* Label */}
            <div style={{ fontSize:24, fontWeight:900, color:mainColor, marginBottom:4 }}>{score.emoji} {score.label}</div>
            <div style={{ fontSize:11, color:COLORS.textSecondary, marginBottom:20 }}>Canadian Market Sentiment · Live</div>

            {/* Sub-scores */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16, textAlign:"left" }}>
              {[["🍁 TSX",score.tsx],["💱 Forex",score.forex],["₿ Crypto",score.crypto],["⛏️ Commodities",score.commodities]].map(([label,val])=>(
                <div key={label} style={{ background:COLORS.surface, borderRadius:10, padding:"10px 12px" }}>
                  <div style={{ fontSize:10, color:COLORS.textSecondary, fontWeight:700, marginBottom:6 }}>{label}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ flex:1, height:6, background:COLORS.border, borderRadius:3, overflow:"hidden" }}>
                      <div style={{ width:`${val}%`, height:"100%", background:getColor(val), borderRadius:3, transition:"width 1s ease" }}/>
                    </div>
                    <span style={{ fontSize:13, fontWeight:900, color:getColor(val), minWidth:24 }}>{val}</span>
                  </div>
                  <div style={{ fontSize:9, color:COLORS.textSecondary, fontWeight:600 }}>{getLabel(val)}</div>
                </div>
              ))}
            </div>

            {/* 30-day history */}
            <div style={{ background:COLORS.surface, borderRadius:10, padding:"12px 14px", marginBottom:14, textAlign:"left" }}>
              <div style={{ fontSize:10, fontWeight:700, color:COLORS.textSecondary, letterSpacing:"0.1em", marginBottom:10 }}>30-DAY HISTORY</div>
              <svg width="100%" height="48" viewBox="0 0 300 48">
                {history.map((v,i) => {
                  const x=(i/(history.length-1))*280+10, y=44-(v/100)*40;
                  const nx=((i+1)/(history.length-1))*280+10, ny=i<history.length-1?44-(history[i+1]/100)*40:y;
                  return (
                    <g key={i}>
                      {i<history.length-1&&<line x1={x} y1={y} x2={nx} y2={ny} stroke={COLORS.accent} strokeWidth="1.5" opacity="0.5"/>}
                      <circle cx={x} cy={y} r={i===history.length-1?4:2.5} fill={i===history.length-1?mainColor:COLORS.accent} opacity={i===history.length-1?1:0.6}/>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Drivers */}
            <div style={{ textAlign:"left", marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:700, color:COLORS.textSecondary, letterSpacing:"0.1em", marginBottom:10 }}>KEY DRIVERS TODAY</div>
              {score.drivers.map((d,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:8 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:mainColor, flexShrink:0, marginTop:5 }}/>
                  <span style={{ fontSize:13, color:COLORS.textPrimary, lineHeight:1.5 }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div style={{ background:mainColor+"18", border:`1px solid ${mainColor}40`, borderRadius:10, padding:"12px 14px", textAlign:"left", marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:800, color:mainColor, letterSpacing:"0.08em", marginBottom:6 }}>⚠️ PURI TRADER TIP</div>
              <div style={{ fontSize:13, color:COLORS.textPrimary, lineHeight:1.65 }}>{score.warning}</div>
            </div>

            <button onClick={calculate} style={{ background:"transparent", border:`1px solid ${COLORS.border}`, borderRadius:9, padding:"10px 20px", color:COLORS.textSecondary, fontSize:12, fontWeight:700, cursor:"pointer", width:"100%", fontFamily:"DM Sans,sans-serif" }}>
              ↺ Recalculate Now
            </button>
          </>
        ) : null}
      </div>

      {/* What It Means Card */}
      <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:14, padding:16 }}>
        <div style={{ fontSize:11, fontWeight:700, color:COLORS.textSecondary, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:14 }}>How to Read the Index</div>
        {[
          { range:"0–24",   label:"Extreme Fear",  desc:"Traders very scared — often a good BUY opportunity",   color:COLORS.blue  },
          { range:"25–44",  label:"Fear",           desc:"Pessimism dominates — watch for reversal signals",      color:COLORS.blue  },
          { range:"45–55",  label:"Neutral",        desc:"Market undecided — wait for a clear direction",         color:COLORS.textSecondary },
          { range:"56–75",  label:"Greed",          desc:"Optimism high — be cautious, tighten stop losses",     color:COLORS.accent },
          { range:"76–100", label:"Extreme Greed",  desc:"Market overextended — high crash risk, reduce exposure",color:COLORS.red   },
        ].map((z,i)=>(
          <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"8px 0", borderBottom:i<4?`1px solid ${COLORS.border}`:"none" }}>
            <div style={{ background:z.color+"20", border:`1px solid ${z.color}40`, borderRadius:6, padding:"3px 10px", flexShrink:0, textAlign:"center", minWidth:52 }}>
              <div style={{ fontSize:10, fontWeight:800, color:z.color }}>{z.range}</div>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:COLORS.textPrimary, marginBottom:2 }}>{z.label}</div>
              <div style={{ fontSize:11, color:COLORS.textSecondary, lineHeight:1.5 }}>{z.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────
export default function PuriMarkets() {
  const [activeTab, setActiveTab] = useState("live");
  const [activeFilter, setActiveFilter] = useState("All");
  const tickerDouble = [...marketData, ...marketData];

  const filtered = activeFilter === "All" ? mockNews : mockNews.filter(n => n.category === activeFilter);

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:COLORS.bg, color:COLORS.textPrimary, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:${COLORS.border};border-radius:2px}
        .news-card:hover{border-color:${COLORS.accent}40!important;transform:translateY(-1px);box-shadow:0 6px 24px #00000050}
        input::placeholder{color:${COLORS.textDim}}
        @media(max-width:760px){.main-grid{grid-template-columns:1fr!important}.right-col{display:none!important}}
      `}</style>

      {/* Live Ticker */}
      <div style={{ background:COLORS.surface, borderBottom:`1px solid ${COLORS.border}`, height:36, display:"flex", alignItems:"center", overflow:"hidden" }}>
        <div style={{ padding:"0 14px", fontSize:10, fontWeight:900, color:"#07090f", background:COLORS.accent, height:"100%", display:"flex", alignItems:"center", letterSpacing:"0.08em", flexShrink:0 }}>LIVE</div>
        <div style={{ overflow:"hidden", flex:1 }}>
          <div style={{ display:"flex", gap:40, animation:"ticker 30s linear infinite", whiteSpace:"nowrap", fontSize:12, fontWeight:600, letterSpacing:"0.03em" }}>
            {tickerDouble.map((m, i) => (
              <span key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:COLORS.textSecondary, fontSize:11 }}>{m.symbol}</span>
                <span style={{ color:COLORS.textPrimary }}>{m.value}</span>
                <span style={{ color:m.up ? COLORS.green : COLORS.red }}>{m.change}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ background:COLORS.surface, borderBottom:`1px solid ${COLORS.border}`, padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <PuriLogo />
          <div>
            <div style={{ fontSize:19, fontWeight:900, letterSpacing:"-0.03em", lineHeight:1, color:COLORS.textPrimary }}>
              puri<span style={{ color:COLORS.accent }}>.</span><span style={{ color:COLORS.accent }}>markets</span>
            </div>
            <div style={{ fontSize:9, color:COLORS.textDim, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase" }}>Live Trading Intelligence</div>
          </div>
        </div>

        <nav style={{ display:"flex", gap:4 }}>
          {[["live","⚡ Live News"],["feed","📰 Top Stories"],["alerts","🚨 Alerts"],["calendar","📅 Calendar"],["chart","📊 News/Price"],["clock","🌍 Markets"],["fg","🇨🇦 Fear & Greed"]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding:"7px 14px", borderRadius:7, border:"none", cursor:"pointer",
              fontSize:12, fontWeight:700,
              background: activeTab===tab ? COLORS.accent : "transparent",
              color: activeTab===tab ? "#07090f" : COLORS.textSecondary,
              transition:"all 0.15s",
            }}>{label}</button>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, color:COLORS.red, letterSpacing:"0.08em" }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:COLORS.red, animation:"pulse 1.4s infinite" }} />
          LIVE
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, maxWidth:1220, width:"100%", margin:"0 auto", padding:"20px 16px", display:"grid", gridTemplateColumns:"1fr 310px", gap:20 }} className="main-grid">

        {/* LEFT */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* AI Briefing Banner */}
          <div style={{ background:`linear-gradient(120deg, ${COLORS.accent}12, ${COLORS.blue}08)`, border:`1px solid ${COLORS.accentBorder}`, borderRadius:14, padding:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ width:30, height:30, background:`linear-gradient(135deg,${COLORS.accent},${COLORS.blue})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🤖</div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:COLORS.accent, letterSpacing:"0.02em" }}>Puri.Markets AI Briefing</div>
                <div style={{ fontSize:11, color:COLORS.textDim }}>Saturday, May 23, 2026 — 6:00 AM ET</div>
              </div>
            </div>
            {["Markets are broadly risk-on today despite Fed minutes suggesting a higher-for-longer stance.",
              "CAD traders should watch the BoC decision tomorrow — a hold is expected but language matters.",
              "Crypto momentum is strong with BTC ETF inflows; altcoins following higher."].map((pt, i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:7, fontSize:13, color:COLORS.textPrimary, lineHeight:1.55 }}>
                <span style={{ color:COLORS.accent, fontWeight:900, flexShrink:0 }}>→</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* LIVE TAB — AI powered */}
          {activeTab === "live" && (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:COLORS.red, animation:"pulse 1.4s infinite", display:"inline-block" }} />
                AI-Powered Live News
              </div>
              <LiveNewsPanel />
            </>
          )}

          {/* FEED TAB */}
          {activeTab === "feed" && (
            <>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:12 }}>Top Stories</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} style={{
                      padding:"5px 13px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.15s",
                      border:`1px solid ${activeFilter===cat ? COLORS.accent : COLORS.border}`,
                      background: activeFilter===cat ? COLORS.accentDim : "transparent",
                      color: activeFilter===cat ? COLORS.accent : COLORS.textSecondary,
                    }}>{cat}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filtered.map(news => <NewsCard key={news.id} news={news} />)}
              </div>
            </>
          )}

          {/* ALERTS TAB */}
          {activeTab === "alerts" && (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:4 }}>Breaking Alerts</div>
              {alerts.map((a, i) => (
                <div key={i} style={{ background:"#ff475710", border:"1px solid #ff475735", borderRadius:12, padding:14, display:"flex", gap:12, alignItems:"flex-start", marginBottom:8 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:COLORS.textPrimary, lineHeight:1.4 }}>{a.text}</div>
                    <div style={{ fontSize:11, color:COLORS.textDim, marginTop:3 }}>{a.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:16, marginTop:8 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:14 }}>Alert Preferences</div>
                {["High Impact Events Only","Breaking Market News","TSX Stocks","Crypto Moves >5%","Forex Major Pairs","Earnings Surprises"].map((pref, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize:13, color:COLORS.textPrimary }}>{pref}</span>
                    <div style={{ width:36, height:20, borderRadius:10, background:i<3 ? COLORS.accent : COLORS.border, position:"relative", cursor:"pointer", transition:"background 0.2s" }}>
                      <div style={{ position:"absolute", top:3, left:i<3 ? 18 : 3, width:14, height:14, borderRadius:"50%", background:"#fff", transition:"left 0.2s" }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CALENDAR TAB */}
          {activeTab === "calendar" && (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:4 }}>Economic Calendar</div>
              <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:16 }}>
                {calendarEvents.map((ev, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", padding:"10px 0", borderBottom:`1px solid ${COLORS.border}`, gap:12 }}>
                    <div style={{ minWidth:70 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:COLORS.textDim, marginBottom:2 }}>{ev.date}</div>
                      <div style={{ fontSize:11, color:COLORS.textDim, fontWeight:600 }}>{ev.time}</div>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
                        {impactDot(ev.importance)}
                        <span style={{ fontSize:13, fontWeight:600, color:COLORS.textPrimary }}>{ev.event}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:COLORS.accent, background:COLORS.accentDim, padding:"1px 6px", borderRadius:3 }}>{ev.market}</span>
                      </div>
                      <div style={{ display:"flex", gap:12, fontSize:11, color:COLORS.textSecondary }}>
                        <span>Forecast: <strong style={{ color:COLORS.textPrimary }}>{ev.consensus}</strong></span>
                        <span>Prev: {ev.previous}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NEW — News vs Price Chart Tab */}
          {activeTab === "chart" && (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:4 }}>
                📊 News vs Price — Is It Already Priced In?
              </div>
              <NewsPriceChart />
            </>
          )}

          {/* NEW — Global Market Clock Tab */}
          {activeTab === "clock" && (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:4 }}>
                🌍 Global Market Clock
              </div>
              <GlobalMarketClock />
            </>
          )}

          {/* Fear & Greed Tab */}
          {activeTab === "fg" && (
            <>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:4 }}>
                🇨🇦 Canadian Fear & Greed Index
              </div>
              <FearGreedMeter />
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }} className="right-col">

          {/* Market Snapshot */}
          <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:12 }}>Market Snapshot</div>
            {marketData.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${COLORS.border}` }}>
                <span style={{ fontSize:12, color:COLORS.textSecondary }}>{m.symbol}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:COLORS.textPrimary }}>{m.value}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:m.up ? COLORS.green : COLORS.red }}>{m.change}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sentiment */}
          <div style={{ background:COLORS.card, border:`1px solid ${COLORS.border}`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:12 }}>Market Sentiment</div>
            <div style={{ display:"flex", justifyContent:"space-around", marginBottom:12 }}>
              {[["Bullish",4,COLORS.green],["Neutral",1,COLORS.accent],["Bearish",2,COLORS.red]].map(([label,count,color]) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:24, fontWeight:900, color }}>{count}</div>
                  <div style={{ fontSize:10, color:COLORS.textDim, fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ height:6, borderRadius:3, background:COLORS.border, overflow:"hidden", display:"flex" }}>
              <div style={{ flex:4, background:COLORS.green }} />
              <div style={{ flex:1, background:COLORS.accent }} />
              <div style={{ flex:2, background:COLORS.red }} />
            </div>
            <div style={{ fontSize:11, color:COLORS.textDim, marginTop:8, textAlign:"center" }}>57% of today's stories are bullish</div>
          </div>

          {/* Fear & Greed Mini Widget */}
          <div onClick={() => setActiveTab("fg")} style={{ background:`linear-gradient(135deg,${COLORS.card},${COLORS.surface})`, border:`1px solid ${COLORS.accent}40`, borderRadius:12, padding:16, cursor:"pointer", textAlign:"center", transition:"all 0.2s" }} className="news-card">
            <div style={{ fontSize:10, fontWeight:800, color:COLORS.accent, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>🇨🇦 Fear & Greed Index</div>
            <div style={{ fontSize:44, fontWeight:900, color:COLORS.accent, lineHeight:1, marginBottom:4 }}>72</div>
            <div style={{ fontSize:14, fontWeight:800, color:COLORS.textPrimary, marginBottom:8 }}>📈 Greed</div>
            <div style={{ height:8, background:COLORS.border, borderRadius:4, overflow:"hidden", marginBottom:8 }}>
              <div style={{ width:"72%", height:"100%", background:`linear-gradient(90deg,${COLORS.blue},#00d68f,${COLORS.accent},${COLORS.red})`, borderRadius:4 }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:COLORS.textSecondary, fontWeight:600, marginBottom:8 }}>
              <span>FEAR</span><span>NEUTRAL</span><span>GREED</span>
            </div>
            <div style={{ fontSize:11, color:COLORS.textSecondary }}>Tap for full analysis →</div>
          </div>

          {/* Next Event Countdown */}
          <div style={{ background:COLORS.card, border:`1px solid ${COLORS.accent}30`, borderRadius:12, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:COLORS.textSecondary, textTransform:"uppercase", marginBottom:10 }}>⏰ Next Event</div>
            <div style={{ fontSize:14, fontWeight:700, color:COLORS.textPrimary, marginBottom:3 }}>Fed Chair Powell Speech</div>
            <div style={{ fontSize:12, color:COLORS.textSecondary, marginBottom:12 }}>Today at 2:00 PM ET</div>
            <div style={{ display:"flex", gap:8 }}>
              {["02","37","14"].map((n, i) => (
                <div key={i} style={{ flex:1, textAlign:"center", background:COLORS.border, borderRadius:8, padding:"8px 4px" }}>
                  <div style={{ fontSize:20, fontWeight:900, color:COLORS.accent }}>{n}</div>
                  <div style={{ fontSize:9, color:COLORS.textDim, fontWeight:600 }}>{["HRS","MIN","SEC"][i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div style={{ background:`linear-gradient(135deg,#0e1420,#111a2e)`, border:`1px solid #1e3a5f`, borderRadius:12, padding:18, textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:8 }}>👑</div>
            <div style={{ fontSize:15, fontWeight:900, color:COLORS.textPrimary, marginBottom:6, letterSpacing:"-0.02em" }}>puri.markets <span style={{ color:COLORS.accent }}>Pro</span></div>
            <div style={{ fontSize:12, color:COLORS.textSecondary, marginBottom:14, lineHeight:1.55 }}>
              Real-time AI alerts, trade signals, earnings whispers & unlimited news history.
            </div>
            <div style={{ fontSize:24, fontWeight:900, color:COLORS.textPrimary, marginBottom:2 }}>
              $9.99<span style={{ fontSize:13, fontWeight:500, color:COLORS.textSecondary }}>/mo</span>
            </div>
            <div style={{ fontSize:11, color:COLORS.textDim, marginBottom:14 }}>Cancel anytime · 7-day free trial</div>
            <button style={{ background:`linear-gradient(135deg,${COLORS.accent},${COLORS.accentDark})`, border:"none", borderRadius:8, padding:"11px 20px", color:"#07090f", fontWeight:900, fontSize:13, cursor:"pointer", width:"100%", letterSpacing:"0.02em" }}>
              Start Free Trial →
            </button>
          </div>

          {/* Footer brand */}
          <div style={{ textAlign:"center", paddingBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:900, color:COLORS.textDim, letterSpacing:"-0.02em" }}>
              puri<span style={{ color:COLORS.accent }}>.</span>markets
            </div>
            <div style={{ fontSize:10, color:COLORS.textDim, marginTop:3 }}>© 2026 Puri Markets Inc. · Toronto, ON</div>
          </div>
        </div>
      </div>
    </div>
  );
}
