import { describe, expect, it } from 'vitest'
import { courseModules } from './modules'
import { studyVideosFor, v28SectionsFor, v28WordCount } from './v28-course'

describe('CPA V28 course layer', () => {
  it('covers every course module with substantial authorial reading', () => {
    for (const module of courseModules) {
      const sections = v28SectionsFor(module.id)
      expect(sections.length, `${module.id} should have at least 3 V28 sections`).toBeGreaterThanOrEqual(3)
      expect(v28WordCount(module.id), `${module.id} should have a substantial V28 reading layer`).toBeGreaterThanOrEqual(300)
      for (const section of sections) {
        expect(section.title.trim().length).toBeGreaterThan(12)
        expect(section.paragraphs.length).toBeGreaterThanOrEqual(2)
        expect(section.paragraphs.every((paragraph) => paragraph.trim().length > 180)).toBe(true)
      }
    }
  })

  it('gives every module a Renan Duarte / Retorno Interno video path', () => {
    for (const module of courseModules) {
      const videos = studyVideosFor(module.id)
      expect(videos.length, `${module.id} should have at least one video path`).toBeGreaterThanOrEqual(1)
      expect(videos.every((video) => video.url.startsWith('https://www.youtube.com/'))).toBe(true)
      expect(videos.every((video) => video.note.trim().length > 20)).toBe(true)
    }
  })

  it('pins verified introductory videos for the SFN', () => {
    const videos = studyVideosFor('sistema-financeiro')
    expect(videos.map((video) => video.videoId)).toEqual(expect.arrayContaining([
      'N0XoBIH5lRQ',
      'xYygK21nTtE',
      'tm6GNCPxpsQ',
      'fketQyTvl9Y',
      '2udvH9SI9Dk',
    ]))
  })
})
