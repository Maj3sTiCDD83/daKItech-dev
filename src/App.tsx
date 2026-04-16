import React, { useState } from 'react';
import { PhoneCall, Calendar, ShieldCheck, Zap, Flame, Box, BarChart3, Users, Settings, LogOut, Activity, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="min-h-screen bg-[#050914] text-slate-300 font-sans selection:bg-cyan-500/30">
      {view === 'landing' ? <LandingPage onLogin={() => setView('dashboard')} /> : <Dashboard onLogout={() => setView('landing')} />}
    </div>
  );
}

function LandingPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <nav className="relative z-10 border-b border-white/5 bg-[#050914]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#050914]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">neXagent <span className="text-cyan-400 font-normal text-sm">by daKI.tech</span></span>
          </div>
          <button onClick={onLogin} className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors cursor-pointer">
            Kunden-Login
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            MVP Version 1.0 Live
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-tight"
          >
            Verpasse nie wieder <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">einen Anruf.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10"
          >
            Dein 24/7 KI-Telefonassistent für Arztpraxen, Handwerk und Dienstleister. 
            DSGVO-konform, menschlich klingend und immer erreichbar.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#050914] font-bold text-lg transition-all shadow-[0_0_30px_rgba(0,229,255,0.3)] hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] cursor-pointer">
              Demo buchen
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-lg transition-colors cursor-pointer">
              Preise ansehen
            </button>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-32">
          <FeatureCard 
            icon={<PhoneCall className="w-6 h-6 text-cyan-400" />}
            title="24/7 Erreichbarkeit"
            desc="Dein Agent 'CuSo' nimmt jeden Anruf entgegen, auch wenn dein Team im Stress ist."
          />
          <FeatureCard 
            icon={<Calendar className="w-6 h-6 text-cyan-400" />}
            title="Smarte Terminbuchung"
            desc="Direkte Integration in deinen Kalender. Termine werden vollautomatisch vereinbart."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-cyan-400" />}
            title="100% DSGVO-konform"
            desc="Server in Deutschland, AVV-Verträge und strenger Datenschutz nach EU-Recht."
          />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Transparente Pakete</h2>
          <p className="text-slate-400">Skaliere deinen Kundenservice nach deinem Bedarf.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <PricingCard 
            icon={<Zap className="w-8 h-8 text-orange-400" />}
            name="Starter"
            price="99 €"
            desc="Der perfekte Einstieg. Dein Bot beantwortet Standardfragen (Öffnungszeiten, Parkplätze)."
            features={['24/7 Frage-Antwort-Bot', 'Menschliche KI-Stimme', 'E-Mail Benachrichtigungen', 'DSGVO-konform']}
          />
          <PricingCard 
            icon={<Flame className="w-8 h-8 text-cyan-400" />}
            name="Pro"
            price="199 €"
            desc="Unser Bestseller. Der Bot übernimmt die komplette Terminvereinbarung für dich."
            features={['Alles aus "Starter"', 'Kalender-Integration', 'Terminbuchung & Storno', 'SMS-Bestätigungen']}
            highlighted
          />
          <PricingCard 
            icon={<Box className="w-8 h-8 text-purple-400" />}
            name="Enterprise"
            price="Individuell"
            desc="Für komplexe Anforderungen. Preisgestaltung basierend auf deiner Infrastruktur."
            features={['Alles aus "Pro"', 'Tiefe CRM-Anbindung', 'Individuelle Workflows', 'Persönlicher Account Manager']}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingCard({ icon, name, price, desc, features, highlighted = false }: { icon: React.ReactNode, name: string, price: string, desc: string, features: string[], highlighted?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl border ${highlighted ? 'bg-cyan-500/5 border-cyan-500/30 relative' : 'bg-white/[0.02] border-white/5'}`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-500 text-[#050914] text-sm font-bold">
          Bestseller
        </div>
      )}
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="text-3xl font-bold text-white mb-4">{price}<span className="text-lg text-slate-500 font-normal">/Monat</span></div>
      <p className="text-slate-400 mb-8 h-12">{desc}</p>
      <ul className="space-y-4 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-300">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer ${highlighted ? 'bg-cyan-500 text-[#050914] hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
        Paket wählen
      </button>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#050914]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#050914] flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#050914]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">neXagent</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<Activity />} label="Übersicht" active />
          <NavItem icon={<PhoneCall />} label="Anrufprotokoll" />
          <NavItem icon={<Calendar />} label="Termine" />
          <NavItem icon={<Users />} label="Kunden" />
          <NavItem icon={<Settings />} label="Agenten-Setup" />
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={onLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050914]/50 backdrop-blur-md">
          <h1 className="text-xl font-semibold text-white">Willkommen zurück, Dr. Müller</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Agent CuSo: Online
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#050914] flex items-center justify-center">
                <span className="text-sm font-bold text-white">DM</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Anrufe Heute" value="24" trend="+12%" icon={<PhoneCall className="w-5 h-5 text-cyan-400" />} />
            <StatCard title="Gebuchte Termine" value="8" trend="+3" icon={<Calendar className="w-5 h-5 text-emerald-400" />} />
            <StatCard title="Geretteter Umsatz" value="~1.200 €" trend="geschätzt" icon={<BarChart3 className="w-5 h-5 text-purple-400" />} />
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">Letzte Anrufe</h2>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">Zeit</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">Anrufer</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">Anliegen</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">Ergebnis</th>
                  <th className="px-6 py-4 text-sm font-medium text-slate-400">Dauer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <CallRow time="10:42" caller="0176 1234..." intent="Terminbuchung" result="Termin gebucht (Morgen, 14:00)" duration="2:15" status="success" />
                <CallRow time="09:15" caller="089 9876..." intent="Öffnungszeiten" result="Frage beantwortet" duration="0:45" status="success" />
                <CallRow time="08:30" caller="0151 5555..." intent="Komplexe Frage" result="An Rückruf-Liste gesendet" duration="1:20" status="warning" />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors cursor-pointer ${active ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-medium">{title}</h3>
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm font-medium text-emerald-400 mb-1">{trend}</div>
      </div>
    </div>
  );
}

function CallRow({ time, caller, intent, result, duration, status }: { time: string, caller: string, intent: string, result: string, duration: string, status: 'success' | 'warning' }) {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="px-6 py-4 text-sm text-slate-300 flex items-center gap-2">
        <Clock className="w-4 h-4 text-slate-500" />
        {time}
      </td>
      <td className="px-6 py-4 text-sm text-white font-medium">{caller}</td>
      <td className="px-6 py-4 text-sm text-slate-300">{intent}</td>
      <td className="px-6 py-4 text-sm">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
          {result}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-400">{duration}</td>
    </tr>
  );
}
