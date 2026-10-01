import { describe, expect, it } from 'vitest'
import { courseModules } from '../course/modules'
import { v27Benchmark, v27Clusters, v27Evidence, v27Metrics, v27QuestionPatterns, v27Shortcuts, v27Traps, v27VerifiedVideos } from './intelligence'

describe('V27 intelligence', () => {
  it('covers all modules', () => {
    const mapped = v27Clusters.flatMap(item => item.modules)
    expect(mapped).toHaveLength(20)
    expect(new Set(mapped)).toEqual(new Set(courseModules.map(item => item.id)))
  })

  it('keeps benchmark evidence separated', () => {
    expect(v27Benchmark.statedPlaylistLessons).toBe(46)
    expect(v27VerifiedVideos.length).toBeGreaterThanOrEqual(10)
    expect(new Set(v27VerifiedVideos.map(item => item.lesson)).size).toBe(v27VerifiedVideos.length)
    expect(v27Evidence.some(item => item.kind === 'OFICIAL')).toBe(true)
    expect(v27Evidence.some(item => item.kind === 'ESPECIALISTAS')).toBe(true)
  })

  it('has the full study intelligence set', () => {
    expect(v27Traps).toHaveLength(100)
    expect(new Set(v27Traps.map(item => item.id)).size).toBe(100)
    expect(v27Shortcuts.length).toBeGreaterThanOrEqual(20)
    expect(v27QuestionPatterns.length).toBeGreaterThanOrEqual(15)
  })

  it('reports coherent metrics', () => {
    expect(v27Metrics.playlistScopeLessons).toBe(46)
    expect(v27Metrics.verifiedBenchmarkVideos).toBe(v27VerifiedVideos.length)
    expect(v27Metrics.moduleCoverage).toBe(20)
    expect(v27Metrics.traps).toBe(100)
  })

  it('keeps internal indices in range', () => {
    expect(v27Clusters.every(item => item.index >= 0 && item.index <= 100)).toBe(true)
  })
})
