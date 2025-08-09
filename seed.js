const { seedAdmin } = require('./src/lib/seed.ts')

seedAdmin().catch((e) => {
  console.error(e)
  process.exit(1)
})