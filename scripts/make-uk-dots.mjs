// One-off: turns a world-atlas TopoJSON file into the dot grid used by the
// home hero map (src/data/uk-dots.json). Run:
//   node scripts/make-uk-dots.mjs path/to/countries-50m.json
import fs from 'node:fs'
import { feature } from 'topojson-client'
import { geoMercator, geoContains } from 'd3-geo'

const W = 520, H = 640, STEP = 9
const topo = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const countries = feature(topo, topo.objects.countries).features
const uk = countries.find(f => f.properties.name === 'United Kingdom')
const ie = countries.find(f => f.properties.name === 'Ireland')

// Frame Great Britain and Ireland; Shetland sits off the top edge.
const frame = { type: 'MultiPoint', coordinates: [[-10.6, 49.9], [1.8, 58.7]] }
const projection = geoMercator().fitExtent([[10, 10], [W - 10, H - 10]], frame)

const dots = []
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    const p = projection.invert([x, y])
    if (geoContains(uk, p)) dots.push([x, y, 1])
    else if (geoContains(ie, p)) dots.push([x, y, 0])
  }
}

const out = {
  width: W,
  height: H,
  step: STEP,
  projection: { scale: projection.scale(), translate: projection.translate() },
  dots,
}
fs.writeFileSync('src/data/uk-dots.json', JSON.stringify(out))
console.log(`${dots.length} dots, scale ${projection.scale().toFixed(1)}`)
