import React, { useState } from 'react';
import { Moon, Sun, Droplet, Zap, Heart, Activity } from 'lucide-react';

const BrandIdentity = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const brandColors = {
    primary: [
      { name: 'Coral Vital', hex: '#FF6B6B', usage: 'Principal - CTAs, destaques' },
      { name: 'Coral Suave', hex: '#FFB4B4', usage: 'Secundário - backgrounds, cards' }
    ],
    secondary: [
      { name: 'Lavanda Profunda', hex: '#8B7FC7', usage: 'Fase lútea, noturno' },
      { name: 'Lavanda Clara', hex: '#C4B5E8', usage: 'Acentos suaves' }
    ],
    neutral: [
      { name: 'Areia', hex: '#F8F6F3', usage: 'Background principal' },
      { name: 'Grafite Suave', hex: '#4A4A4A', usage: 'Textos principais' },
      { name: 'Cinza Claro', hex: '#E0E0E0', usage: 'Divisores, borders' }
    ],
    accent: [
      { name: 'Verde Energia', hex: '#6BCF7F', usage: 'Progresso, conquistas' },
      { name: 'Amarelo Suave', hex: '#FFD93D', usage: 'Alertas leves, atenção' }
    ]
  };

  const cyclePhases = [
    { 
      phase: 'Menstrual', 
      color: '#FF6B6B', 
      icon: <Droplet className="w-6 h-6" />,
      description: 'Descanso e recuperação'
    },
    { 
      phase: 'Folicular', 
      color: '#6BCF7F', 
      icon: <Zap className="w-6 h-6" />,
      description: 'Energia crescente'
    },
    { 
      phase: 'Ovulatória', 
      color: '#FFD93D', 
      icon: <Sun className="w-6 h-6" />,
      description: 'Pico de energia'
    },
    { 
      phase: 'Lútea', 
      color: '#8B7FC7', 
      icon: <Moon className="w-6 h-6" />,
      description: 'Adaptação e cuidado'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-purple-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-400 rounded-2xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              FlowFit AI
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Treinos que respeitam seu corpo, em cada fase</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {['overview', 'cores', 'tipografia', 'componentes', 'aplicacoes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'overview' ? 'Visão Geral' : 
               tab === 'cores' ? 'Paleta de Cores' :
               tab === 'tipografia' ? 'Tipografia' :
               tab === 'componentes' ? 'Componentes' : 'Aplicações'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Conceito da Marca</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-rose-50 to-purple-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Essência</h3>
                    <p className="text-gray-700 leading-relaxed">
                      FlowFit AI representa o movimento natural e fluido do corpo feminino. 
                      A marca une ciência, respeito e empoderamento, celebrando a 
                      capacidade única das mulheres de se adaptarem e prosperarem.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Personalidade</h3>
                    <div className="space-y-2 text-gray-700">
                      <p>✨ Empática e acolhedora</p>
                      <p>🔬 Cientificamente fundamentada</p>
                      <p>💪 Empoderadora e motivadora</p>
                      <p>🌸 Moderna e sofisticada</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Fases do Ciclo</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {cyclePhases.map((item, idx) => (
                    <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow">
                      <div 
                        className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.color + '20', color: item.color }}
                      >
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">{item.phase}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cores' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Paleta de Cores</h2>
                
                <h3 className="text-xl font-bold text-gray-700 mb-4">Cores Primárias</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {brandColors.primary.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100">
                      <div 
                        className="w-24 h-24 rounded-2xl shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{color.name}</h4>
                        <p className="text-gray-600 text-sm mb-1">{color.hex}</p>
                        <p className="text-gray-500 text-xs">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-700 mb-4">Cores Secundárias</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {brandColors.secondary.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100">
                      <div 
                        className="w-24 h-24 rounded-2xl shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{color.name}</h4>
                        <p className="text-gray-600 text-sm mb-1">{color.hex}</p>
                        <p className="text-gray-500 text-xs">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-gray-700 mb-4">Cores de Destaque</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {brandColors.accent.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100">
                      <div 
                        className="w-24 h-24 rounded-2xl shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{color.name}</h4>
                        <p className="text-gray-600 text-sm mb-1">{color.hex}</p>
                        <p className="text-gray-500 text-xs">{color.usage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tipografia' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Sistema Tipográfico</h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <p className="text-sm text-gray-600 mb-2">Família Principal</p>
                  <h3 className="text-4xl font-bold text-gray-800 mb-4">Inter</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fonte moderna, humanista e altamente legível. Perfeita para interfaces 
                    digitais, transmite profissionalismo e acessibilidade.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">Hierarquia</h3>
                  
                  <div className="p-6 border-2 border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">H1 - Bold 32px</p>
                    <h1 className="text-4xl font-bold text-gray-800">Bem-vinda ao FlowFit</h1>
                  </div>

                  <div className="p-6 border-2 border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">H2 - Bold 24px</p>
                    <h2 className="text-2xl font-bold text-gray-800">Seu treino de hoje</h2>
                  </div>

                  <div className="p-6 border-2 border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">H3 - Semibold 18px</p>
                    <h3 className="text-lg font-semibold text-gray-800">Fase Folicular - Dia 8</h3>
                  </div>

                  <div className="p-6 border-2 border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Body - Regular 16px</p>
                    <p className="text-base text-gray-700">
                      Este é o momento ideal para treinos mais intensos. Seu corpo está 
                      com energia elevada e pronto para desafios.
                    </p>
                  </div>

                  <div className="p-6 border-2 border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Caption - Regular 14px</p>
                    <p className="text-sm text-gray-600">
                      30 minutos • Intensidade moderada • Fase folicular
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'componentes' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Componentes UI</h2>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Botões</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
                      Começar Treino
                    </button>
                    <button className="px-6 py-3 bg-white text-rose-500 font-semibold rounded-full border-2 border-rose-400 hover:bg-rose-50 transition-all">
                      Ver Histórico
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all">
                      Pular
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Cards</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl border-2 border-rose-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-rose-400 rounded-full flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800">Treino HIIT</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Perfeito para sua fase folicular. Alta energia!
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>25 min</span>
                      <span>•</span>
                      <span>Alta intensidade</span>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                        <Moon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-gray-800">Yoga Suave</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Recomendado para fase lútea. Cuidado e alongamento.
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>30 min</span>
                      <span>•</span>
                      <span>Baixa intensidade</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Indicadores de Fase</h3>
                <div className="flex gap-2">
                  {cyclePhases.map((phase, idx) => (
                    <div 
                      key={idx}
                      className="flex-1 h-3 rounded-full transition-all hover:scale-105"
                      style={{ backgroundColor: phase.color }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-600">
                  {cyclePhases.map((phase, idx) => (
                    <span key={idx}>{phase.phase}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aplicacoes' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Aplicações Práticas</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* App Icon */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-700 mb-4">Ícone do App</h3>
                  <div className="inline-block p-8 bg-gradient-to-br from-rose-400 to-purple-500 rounded-3xl shadow-2xl">
                    <Activity className="w-20 h-20 text-white" />
                  </div>
                </div>

                {/* Splash Screen Concept */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-700 mb-4">Splash Screen</h3>
                  <div className="bg-gradient-to-br from-rose-400 via-purple-400 to-indigo-400 rounded-3xl p-12 shadow-2xl">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Activity className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">FlowFit</h2>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Mockup de Tela</h3>
                <div className="bg-gray-100 rounded-3xl p-8 max-w-md mx-auto shadow-xl">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">Olá, Ana!</h3>
                        <p className="text-gray-600 text-sm">Fase Folicular • Dia 10</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-400 rounded-full" />
                    </div>

                    <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-rose-500" />
                        <h4 className="font-bold text-gray-800">Seu treino hoje</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Alta energia! Ótimo dia para treino intenso.
                      </p>
                      <button className="w-full py-3 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-full">
                        Começar
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex-1 h-2 bg-gray-200 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Identidade Visual • FlowFit • 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandIdentity;