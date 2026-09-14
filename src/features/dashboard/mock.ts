export const dashboardMock = {
  name: 'Felipe', progress: 34, questions: 286, accuracy: 78, hours: 18.4, streak: 8,
  topics: [
    { name: 'Sistema Financeiro Nacional', weight: 20, progress: 58, accuracy: 81 },
    { name: 'Produtos do mercado financeiro', weight: 40, progress: 29, accuracy: 74 },
    { name: 'Relacionamento com o cliente', weight: 30, progress: 22, accuracy: 76 },
    { name: 'Inovação e desenvolvimento', weight: 10, progress: 41, accuracy: 83 }
  ],
  weak: ['Fundos e tributação', 'Suitability e perfil do investidor', 'Derivativos básicos'],
  simulations: [
    { name: 'Simulado rápido', score: '8/10', date: 'Hoje', passed: true },
    { name: 'Simulado 20 questões', score: '14/20', date: '12 set', passed: true },
    { name: 'Simulado completo', score: '32/50', date: '09 set', passed: false }
  ]
}
