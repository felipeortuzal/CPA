import { describe, expect, it } from 'vitest'
import { courseModules } from '../course/modules'
import { v27Benchmark, v27Clusters, v27Evidence, v27Metrics, v27QuestionPatterns, v27Shortcuts, v27Traps, v27VerifiedVideos } from './intelligence'

describe('V27 · inteligência da prova', () => {
  it('cobre os 20 módulos sem criar lacunas', () => {
    expect(v27Clusters).toHaveLength(12)
    const mapped = v27Clusters.flatMap(cluster => cluster.modules)
    expect(mapped).toHaveLength(20)
    expect(new Set(mapped).size).toBe(20)
    expect(new Set(mapped)).toEqual(new Set(courseModules.map(module => module.id)))
  })

  it('mantém o benchmark externo separado da fonte oficial', () => {
    expect(v27Benchmark.statedPlaylistLessons).toBe(46)
    expect(v27VerifiedVideos.length).toBeGreaterThanOrEqual(10)
    expect(new Set(v27VerifiedVideos.map(video => video.lesson)).size).toBe(v27VerifiedVideos.length)
    expect(v27Evidence.some(item => item.kind === 'OFICIAL')).toBe(true)
    expect(v27Evidence.some(item => item.kind === 'ESPECIALISTAS')).toBe(true)
    expect(v27Evidence.some(item => item.kind === 'CANDIDATOS')).toBe(true)
  })

  it('mantém 100 pegadinhas e atalhos de raciocínio autorais', () => {
    expect(v27Traps).toHaveLength(100)
    expect(new Set(v27Traps.map(item => item.id)).size).toBe(100)
    expect(v27Traps.every(item => item.trap.length > 20 && item.why.length > 20 && item.avoid.length > 15)).toBe(true)
    expect(v27Shortcuts.length).toBeGreaterThanOrEqual(20)
    expect(v27QuestionPatterns.length).toBeGreaterThanOrEqual(15)
  })

  it('expõe métricas coerentes', () => {
    expect(v27Metrics.playlistScopeLessons).toBe(46)
    expect(v27Metrics.verifiedBenchmarkVideos).toBe(v27VerifiedVideos.length)
    expect(v27Metrics.moduleCoverage).toBe(20)
    expect(v27Metrics.traps).toBe(100)
  })

  it('mantém índices internos dentro da faixa declarada', () => {
    expect(v27Clusters.every(cluster => cluster.index >= 0 && cluster.index <= 100)).toBe(true)
  })
})
