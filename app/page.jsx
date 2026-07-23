'use client';

import React, { useEffect, useState } from 'react';

// Uses your Render URL from Vercel's environment variable, or defaults to local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://duel-engine-trader.onrender.com';

export default function QuantDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/telemetry`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 font-mono text-sm p-8 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>INITIALIZING QUANT TELEMETRY...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono p-6 selection:bg-zinc-800">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h1 className="text-lg font-bold tracking-wider text-zinc-50 uppercase">Dual-Engine Strategy Terminal</h1>
          <p className="text-xs text-zinc-500">SYSTEMATIC ALLOCATION MODEL // LIVE SIGNAL FEED</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-zinc-400">ENGINE ONLINE</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Macro Regime Block */}
        <div className="col-span-12 lg:col-span-4 bg-zinc-900 border border-zinc-800 p-4 rounded-sm">
          <div className="text-xs text-zinc-500 mb-3 tracking-wider uppercase font-semibold">01 / Macro Regime Filter</div>
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-2xl font-semibold tracking-tight">${data.macro.spy_close}</span>
            <span className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${data.macro.status === 'BULLISH' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
              {data.macro.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs border-t border-zinc-800/60 pt-3 text-zinc-400">
            <div>50-SMA: <span className="text-zinc-200">${data.macro.sma50}</span></div>
            <div>200-SMA: <span className="text-zinc-200">${data.macro.sma200}</span></div>
          </div>
        </div>

        {/* Quick Trader Allocation */}
        <div className="col-span-12 lg:col-span-8 bg-zinc-900 border border-zinc-800 p-4 rounded-sm">
          <div className="text-xs text-zinc-500 mb-3 tracking-wider uppercase font-semibold">02 / Quick-Trader Engine (25% Weight)</div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-800">
                <th className="py-2">ASSET</th>
                <th className="py-2">RSI(2) / THRESH</th>
                <th className="py-2">RSI(4) / THRESH</th>
                <th className="py-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {data.quick_trader.map((item) => (
                <tr key={item.asset} className="hover:bg-zinc-800/30">
                  <td className="py-2 font-bold text-zinc-200">{item.asset}</td>
                  <td className="py-2 text-zinc-400">{item.rsi2} <span className="text-zinc-600">/ {item.rsi2_thresh}</span></td>
                  <td className="py-2 text-zinc-400">{item.rsi4} <span className="text-zinc-600">/ {item.rsi4_thresh}</span></td>
                  <td className="py-2 text-right">
                    {item.signal ? (
                      <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">BUY ALLOC</span>
                    ) : (
                      <span className="text-zinc-600">NO TRADE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phase 3 Allocation Table */}
        <div className="col-span-12 bg-zinc-900 border border-zinc-800 p-4 rounded-sm">
          <div className="text-xs text-zinc-500 mb-3 tracking-wider uppercase font-semibold">03 / Phase 3 Momentum Leaders (75% Allocation Target)</div>
          {data.phase_3.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-zinc-500 border-b border-zinc-800">
                  <th className="py-2">RANK</th>
                  <th className="py-2">ASSET</th>
                  <th className="py-2">TREND INTENSITY</th>
                  <th className="py-2">21D HIST VOL</th>
                  <th className="py-2 text-right">TARGET WEIGHT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {data.phase_3.map((item, idx) => (
                  <tr key={item.asset} className="hover:bg-zinc-800/30">
                    <td className="py-2 text-zinc-500">#0{idx + 1}</td>
                    <td className="py-2 font-bold text-zinc-100">{item.asset}</td>
                    <td className="py-2 text-zinc-300">{(item.intensity * 100).toFixed(2)}%</td>
                    <td className="py-2 text-zinc-400">{(item.vol * 100).toFixed(1)}%</td>
                    <td className="py-2 text-right font-bold text-emerald-400">{(item.weight * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-xs text-zinc-500 py-4 text-center border border-dashed border-zinc-800">
              NO ASSETS CURRENTLY PASS PHASE 3 TREND FILTERS (HOLDING CASH)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
