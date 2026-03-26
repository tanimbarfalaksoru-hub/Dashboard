/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  UserCheck, 
  Home, 
  TrendingUp, 
  FileText, 
  Menu, 
  X, 
  Download, 
  Calendar,
  LayoutDashboard,
  Map,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn } from './lib/utils';
import Markdown from 'react-markdown';
import { generateNarrative } from './services/aiService';
import { fetchDashboardData, FALLBACK_DATA } from './services/dataService';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#ef4444', '#ec4899', '#64748b'];

const AINarrativeCard = ({ narrative, isLoading }: { narrative: string, isLoading: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
      <Sparkles size={160} />
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Analisis Strategis AI</h4>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Comprehensive Analysis</p>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold animate-pulse">
            <Loader2 className="animate-spin" size={14} />
            <span>MENGANALISA...</span>
          </div>
        )}
      </div>
      
      <div className="prose prose-slate max-w-none">
        {isLoading ? (
          <div className="space-y-4 py-4">
            <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse" />
          </div>
        ) : (
          <div className="text-slate-600 leading-relaxed text-sm md:text-base">
            <Markdown 
              components={{
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                h1: ({ children }) => <h1 className="text-xl font-bold text-slate-900 mt-6 mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold text-slate-900 mt-5 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-md font-bold text-slate-900 mt-4 mb-2">{children}</h3>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-slate-600">{children}</li>,
                strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
              }}
            >
              {narrative}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [narrative, setNarrative] = useState('');
  const [isNarrativeLoading, setIsNarrativeLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData().then(data => {
      setDashboardData(data);
      setIsDataLoading(false);
    });
  }, []);

  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'population', label: 'Kependudukan', icon: Users },
    { id: 'social', label: 'Sosial Ekonomi', icon: Briefcase },
    { id: 'vital', label: 'Vital Statistik', icon: HeartPulse },
    { id: 'documents', label: 'Dokumen', icon: FileText },
  ];

  const fetchNarrative = useCallback(async (tab: string, data: any) => {
    if (!data) return;
    setIsNarrativeLoading(true);
    let sectionData = {};
    
    switch(tab) {
      case 'overview': sectionData = { summary: data.summary, kecamatan: data.kecamatan }; break;
      case 'population': sectionData = { kecamatan: data.kecamatan }; break;
      case 'social': sectionData = { pendidikan: data.pendidikan, pekerjaan: data.pekerjaan }; break;
      case 'vital': sectionData = { vital: data.kecamatan.map((k: any) => ({ name: k.name, in: k.in, out: k.out })) }; break;
      case 'documents': sectionData = { dokumen: data.dokumen }; break;
    }

    const result = await generateNarrative(tab, sectionData);
    setNarrative(result);
    setIsNarrativeLoading(false);
  }, []);

  useEffect(() => {
    if (dashboardData) {
      fetchNarrative(activeTab, dashboardData);
    }
  }, [activeTab, dashboardData, fetchNarrative]);

  if (isDataLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Memuat Data Demografi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <TrendingUp size={24} />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Demografi</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Kep. Tanimbar</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-600 font-semibold shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} className={cn(activeTab === item.id ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-slate-400 mb-1">Status Sistem</p>
              <p className="text-sm font-medium">Database Terhubung</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400">Live Sync</span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <TrendingUp size={18} />
                  </div>
                  <h1 className="font-bold text-slate-900">Demografi</h1>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      activeTab === item.id 
                        ? "bg-blue-50 text-blue-600 font-semibold" 
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {navItems.find(i => i.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">Sistem Informasi Demografi Terpadu</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-200">
              <Download size={16} />
              <span className="hidden sm:inline">Download Laporan</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 space-y-8">
          {/* Dynamic Sections - Optimized Rendering */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'overview' && (
                <>
                  {/* Hero Section */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[2rem] overflow-hidden bg-slate-900 text-white p-8 md:p-12 shadow-2xl"
                  >
                    <div className="absolute inset-0 opacity-20">
                      <img 
                        src="https://picsum.photos/seed/tanimbar/1200/400?blur=2" 
                        alt="Tanimbar Background" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                          Data Konsolidasi Bersih
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
                          DKB KABUPATEN <br />
                          <span className="text-blue-500">KEPULAUAN TANIMBAR</span> 2025
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                          Visualisasi data kependudukan yang akurat dan transparan untuk mendukung perencanaan pembangunan daerah yang berkelanjutan di Bumi Duan Lolat.
                        </p>
                      </motion.div>
                    </div>
                    <div className="absolute right-0 bottom-0 p-8 hidden xl:block opacity-10">
                      <Map size={240} />
                    </div>
                  </motion.div>

                  {/* Stats Grid - Only on Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                    {dashboardData.summary.map((stat: any, idx: number) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg", stat.color)}>
                          <stat.icon size={20} />
                        </div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value.toLocaleString('id-ID')}</h3>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Map size={18} className="text-blue-500" />
                        Sebaran Penduduk per Kecamatan
                      </h3>
                    </div>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData.kecamatan}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <UserCheck size={18} className="text-pink-500" />
                      Komposisi Gender
                    </h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Laki-laki', value: 67314 },
                              { name: 'Perempuan', value: 66979 }
                            ]}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#ec4899" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm text-slate-600">Laki-laki</span>
                        </div>
                        <span className="text-sm font-bold">50.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-pink-500" />
                          <span className="text-sm text-slate-600">Perempuan</span>
                        </div>
                        <span className="text-sm font-bold">49.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              )}

              {activeTab === 'population' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Kepadatan per Kecamatan</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData.kecamatan} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={100} />
                          <Tooltip />
                          <Bar dataKey="density" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Pertumbuhan Penduduk</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { year: '2021', value: 130000 },
                          { year: '2022', value: 131500 },
                          { year: '2023', value: 132800 },
                          { year: '2024', value: 133500 },
                          { year: '2025', value: 134293 },
                        ]}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={['dataMin - 5000', 'auto']} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <GraduationCap size={18} className="text-emerald-500" />
                      Tingkat Pendidikan
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData.pendidikan} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} width={100} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Briefcase size={18} className="text-amber-500" />
                      Profesi Penduduk
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.pekerjaan}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {dashboardData.pekerjaan.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vital' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-6">Dinamika Migrasi per Kecamatan</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.kecamatan}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="in" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Migrasi Masuk" />
                        <Line type="monotone" dataKey="out" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Migrasi Keluar" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-6">Cakupan Kepemilikan Dokumen (%)</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.dokumen}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40}>
                          {dashboardData.dokumen.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#10b981' : entry.value > 50 ? '#f59e0b' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {/* AI Narrative Section - Moved to bottom of charts */}
              <AINarrativeCard narrative={narrative} isLoading={isNarrativeLoading} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="mt-auto p-6 border-t border-slate-200 bg-white text-center">
          <p className="text-sm text-slate-500">
            @Dukcapil Kabupaten Kepulauan Tanimbar-Bidang PIAK dan Pemanfaatan Data
          </p>
        </footer>
      </main>
    </div>
  );
}
