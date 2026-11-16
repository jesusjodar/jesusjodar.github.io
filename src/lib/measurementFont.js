import fontUrl from '@fontsource-variable/roboto-flex/files/roboto-flex-latin-full-normal.woff2?url'

const measurementFonts = new Map()
export async function measurementFont(variationSettings) {
  if (!measurementFonts.has(variationSettings)) {
    const family = `MeasuredRobotoFlex${measurementFonts.size}`
    const face = new FontFace(family, `url("${fontUrl}")`, { variationSettings })
    measurementFonts.set(variationSettings, face.load().then(loaded => {
      document.fonts.add(loaded)
      return family
    }))
  }
  return measurementFonts.get(variationSettings)
}

