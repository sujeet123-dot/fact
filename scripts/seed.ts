import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/factbrief'

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String, icon: String, color: String, factCount: Number,
}, { timestamps: true })

const FactSchema = new mongoose.Schema({
  title: String, slug: String, claim: String, verdict: String,
  summary: String, content: String, category: String, tags: [String],
  author: String, sources: [{ label: String, url: String }],
  imageUrl: String, isTrending: Boolean, isFeatured: Boolean, viewCount: Number,
}, { timestamps: true })

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema)
const Fact = mongoose.models.Fact || mongoose.model('Fact', FactSchema)

const categories = [
  { name: 'Politics', slug: 'politics', description: 'Political claims and rumors', icon: '🏛️', color: '#1d4ed8', factCount: 0 },
  { name: 'Health', slug: 'health', description: 'Medical and health-related claims', icon: '🏥', color: '#16a34a', factCount: 0 },
  { name: 'Science', slug: 'science', description: 'Scientific claims and discoveries', icon: '🔬', color: '#7c3aed', factCount: 0 },
  { name: 'Technology', slug: 'technology', description: 'Tech rumors and innovations', icon: '💻', color: '#0891b2', factCount: 0 },
  { name: 'Entertainment', slug: 'entertainment', description: 'Celebrity and pop culture myths', icon: '🎬', color: '#dc2626', factCount: 0 },
  { name: 'Environment', slug: 'environment', description: 'Climate and environmental claims', icon: '🌍', color: '#059669', factCount: 0 },
]

const facts = [
  {
    title: 'Does drinking 8 glasses of water a day improve skin health significantly?',
    slug: 'does-drinking-8-glasses-water-improve-skin',
    claim: 'Drinking exactly 8 glasses of water per day dramatically improves skin health and eliminates wrinkles.',
    verdict: 'mixture',
    summary: 'Hydration does support skin health, but the "8 glasses" rule is a myth and water alone won\'t eliminate wrinkles.',
    content: `<p>The popular advice to drink "8 glasses of water a day" has been circulating for decades. While staying hydrated is genuinely beneficial for overall health, including skin health, the specific claim that 8 glasses is a magic number lacks scientific backing.</p>
    <h2>What the research says</h2>
    <p>Studies do show that proper hydration helps skin maintain elasticity and can reduce the appearance of fine lines caused by dehydration. However, chronic wrinkles from aging are caused by loss of collagen and elastin—processes not reversed by water intake alone.</p>
    <h2>The "8 glasses" origin</h2>
    <p>This advice traces back to a 1945 US Food and Nutrition Board recommendation that suggested 2.5 liters of water daily—but the same document noted most of this water comes from food, a detail that was dropped over time.</p>
    <p>Individual needs vary widely based on body weight, climate, activity level, and diet.</p>`,
    category: 'health',
    tags: ['water', 'hydration', 'skin', 'health myths'],
    author: 'Dr. Priya Sharma',
    sources: [
      { label: 'Mayo Clinic - Water: How much should you drink every day?', url: 'https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256' },
      { label: 'British Journal of Dermatology - Skin hydration study', url: 'https://example.com' },
    ],
    isTrending: true,
    isFeatured: true,
    viewCount: 4821,
  },
  {
    title: 'Did scientists discover a planet made entirely of diamonds?',
    slug: 'scientists-discover-planet-made-of-diamonds',
    claim: 'Scientists have discovered a planet that is made entirely of diamonds, worth $26.9 nonillion.',
    verdict: 'mixture',
    summary: '55 Cancri e is believed to have a diamond-rich interior, but "entirely made of diamonds" is an exaggeration.',
    content: `<p>Headlines about a diamond planet have circulated since 2012, when researchers at Yale University published findings about exoplanet 55 Cancri e. The planet is roughly twice Earth's size and eight times its mass.</p>
    <h2>What's actually true</h2>
    <p>The 2012 study suggested that given the planet's carbon-rich composition and extreme pressure, about one-third of its mass could be diamond. More recent 2023 data from the James Webb Space Telescope suggests the surface may have molten lava oceans, complicating earlier models.</p>
    <h2>The exaggeration</h2>
    <p>The leap from "may contain significant diamond" to "entirely made of diamonds worth $26.9 nonillion" is viral mathematics that scientists have distanced themselves from. The planet's interior remains uncertain.</p>`,
    category: 'science',
    tags: ['space', 'diamonds', 'exoplanet', '55 Cancri e'],
    author: 'Marcus Webb',
    sources: [
      { label: 'Yale University - Diamond planet research 2012', url: 'https://example.com' },
      { label: 'NASA James Webb Space Telescope findings 2023', url: 'https://example.com' },
    ],
    isTrending: true,
    isFeatured: false,
    viewCount: 12340,
  },
  {
    title: 'Can you charge your smartphone battery by microwaving it?',
    slug: 'charge-smartphone-battery-by-microwaving',
    claim: 'You can quickly charge your smartphone battery by placing it in a microwave for 30 seconds.',
    verdict: 'false',
    summary: 'This is completely false and extremely dangerous. Microwaving a phone causes fires, explosions, and toxic fumes.',
    content: `<p>This viral hoax has been spreading across social media platforms since at least 2014, often formatted to look like an official tech announcement.</p>
    <h2>Why it's dangerous</h2>
    <p>Lithium-ion batteries used in smartphones contain flammable electrolytes. Microwaving them causes rapid, uncontrolled heating that leads to thermal runaway—a chain reaction that can result in fire, explosion, or the release of toxic gases including hydrogen fluoride.</p>
    <h2>How charging actually works</h2>
    <p>Smartphones charge via direct current electricity transferred through a cable or wireless charging pad. Microwaves emit non-ionizing radiation at 2.45 GHz, which excites water molecules—a mechanism completely incompatible with battery charging chemistry.</p>
    <p>If you see this claim shared online, do not attempt it. Multiple people have been injured trying this "hack."</p>`,
    category: 'technology',
    tags: ['smartphone', 'battery', 'microwave', 'hoax', 'dangerous'],
    author: 'FactBrief Staff',
    sources: [
      { label: 'US Consumer Product Safety Commission - Battery Safety', url: 'https://example.com' },
      { label: 'Underwriters Laboratories - Lithium battery dangers', url: 'https://example.com' },
    ],
    isTrending: false,
    isFeatured: true,
    viewCount: 8932,
  },
  {
    title: 'Did Albert Einstein fail math as a child?',
    slug: 'did-einstein-fail-math-as-child',
    claim: 'Albert Einstein failed mathematics in school, proving that academic failure doesn\'t predict genius.',
    verdict: 'false',
    summary: 'Einstein excelled at math from a very young age. He mastered calculus by age 15. This myth is used to comfort struggling students but is factually wrong.',
    content: `<p>The claim that Einstein failed math has been repeated in countless motivational posters, speeches, and articles. It's well-intentioned but factually incorrect.</p>
    <h2>The real history</h2>
    <p>Einstein himself addressed this myth: "Before I was fifteen I had mastered differential and integral calculus." His school records from the Swiss Matura (university entrance exam) show he received top marks in mathematics and physics.</p>
    <h2>Where the myth comes from</h2>
    <p>The confusion arose partly because Switzerland changed its grading scale in 1900. In the old system, 6 was the lowest grade and 1 was the highest. When American publications saw Einstein's "6" grades, they assumed they meant failure—when in fact they represented excellence.</p>`,
    category: 'entertainment',
    tags: ['einstein', 'history', 'education', 'myths'],
    author: 'Neha Kulkarni',
    sources: [
      { label: 'Einstein Papers Project, Caltech', url: 'https://example.com' },
      { label: 'Swiss Federal Archives - Einstein records', url: 'https://example.com' },
    ],
    isTrending: false,
    isFeatured: false,
    viewCount: 5670,
  },
  {
    title: 'Is the Great Wall of China visible from space with the naked eye?',
    slug: 'great-wall-china-visible-from-space',
    claim: 'The Great Wall of China is the only man-made structure visible from space with the naked eye.',
    verdict: 'false',
    summary: 'Multiple astronauts including Chinese astronaut Yang Liwei have confirmed they could not see the wall from low Earth orbit.',
    content: `<p>This claim has appeared in textbooks for decades and is one of the most persistent geographical myths in popular culture.</p>
    <h2>The physics problem</h2>
    <p>The Great Wall is approximately 30 feet wide on average—about the width of a highway. From the International Space Station at 250 miles altitude, the human eye's resolution limit means you'd need to see something at least 70 miles wide. Roads and highways are also man-made but similarly invisible.</p>
    <h2>What astronauts say</h2>
    <p>Chinese astronaut Yang Liwei, who orbited Earth in 2003, specifically looked for the wall and could not find it. NASA has confirmed that under exceptional viewing conditions with optical aids, some astronauts have spotted what might be the wall—but not with the naked eye under normal conditions.</p>`,
    category: 'science',
    tags: ['great wall', 'china', 'space', 'geography', 'myths'],
    author: 'Marcus Webb',
    sources: [
      { label: 'NASA - Can You See the Great Wall from Space?', url: 'https://example.com' },
      { label: 'ESA - Astronaut visibility study', url: 'https://example.com' },
    ],
    isTrending: true,
    isFeatured: false,
    viewCount: 9210,
  },
  {
    title: 'Does the full moon cause more crimes and hospital admissions?',
    slug: 'full-moon-causes-more-crimes-hospital-admissions',
    claim: 'Crime rates spike and hospital emergency rooms get significantly busier during a full moon.',
    verdict: 'false',
    summary: 'Multiple large-scale studies have found no statistically significant link between the full moon and crime rates or ER visits.',
    content: `<p>The belief that the full moon influences human behavior—sometimes called the "lunar effect" or "transylvania effect"—is one of the oldest superstitions in human history, but scientific investigation has consistently failed to support it.</p>
    <h2>The research</h2>
    <p>A comprehensive 1985 review by Rotton and Kelly analyzed 37 studies and found no meaningful connection. A 2019 study of 14,000 emergency department visits found lunar cycles had no significant effect on admissions volume or types.</p>
    <h2>Why the myth persists</h2>
    <p>Confirmation bias plays a major role: ER staff and police remember the busy full-moon nights and forget the equally busy other nights. The moon is also more visible at night, making it easy to blame for nocturnal events.</p>`,
    category: 'science',
    tags: ['moon', 'crime', 'hospital', 'superstition', 'psychology'],
    author: 'Dr. Priya Sharma',
    sources: [
      { label: 'Psychological Bulletin - Rotton & Kelly 1985 meta-analysis', url: 'https://example.com' },
      { label: 'Journal of Emergency Medicine - 2019 lunar study', url: 'https://example.com' },
    ],
    isTrending: false,
    isFeatured: false,
    viewCount: 3401,
  },
  {
    title: 'Was the COVID-19 vaccine developed in just 2 days using AI?',
    slug: 'covid-vaccine-developed-in-2-days-using-ai',
    claim: 'The COVID-19 mRNA vaccine was fully developed in just 2 days using artificial intelligence, bypassing normal safety testing.',
    verdict: 'false',
    summary: 'While AI helped design the mRNA sequence quickly, vaccine development, trials, and safety testing still took over a year of rigorous work.',
    content: `<p>This claim merges two separate facts into a misleading conclusion. It's true that AI tools helped researchers at Moderna design the mRNA sequence for the spike protein in roughly 2 days in January 2020. However, this was just the first step in a lengthy process.</p>
    <h2>What actually happened</h2>
    <p>After the sequence design, the vaccine went through pre-clinical animal studies, three phases of clinical trials involving 30,000+ participants, safety monitoring, regulatory review, and manufacturing scale-up—a process that took over 11 months total, which was itself record-fast.</p>
    <h2>Why speed doesn't mean unsafe</h2>
    <p>The unprecedented speed came from: parallel clinical trial phases, pre-existing mRNA research infrastructure, massive global funding removing financial barriers, and regulatory agencies working around the clock. No safety steps were skipped.</p>`,
    category: 'health',
    tags: ['covid', 'vaccine', 'mRNA', 'AI', 'misinformation'],
    author: 'Dr. Priya Sharma',
    sources: [
      { label: 'Moderna - mRNA-1273 vaccine development timeline', url: 'https://example.com' },
      { label: 'Nature Medicine - COVID-19 vaccine development review', url: 'https://example.com' },
    ],
    isTrending: true,
    isFeatured: true,
    viewCount: 21045,
  },
  {
    title: 'Does eating carrots improve your night vision?',
    slug: 'eating-carrots-improves-night-vision',
    claim: 'Eating carrots significantly improves your ability to see in the dark and can give you exceptional night vision.',
    verdict: 'mixture',
    summary: 'Carrots prevent vitamin A deficiency which can cause night blindness, but they don\'t enhance normal vision beyond baseline.',
    content: `<p>The carrot-eyesight connection is one of the most widespread nutritional myths, and it has an interesting origin rooted in World War II propaganda.</p>
    <h2>The kernel of truth</h2>
    <p>Carrots are rich in beta-carotene, which the body converts to vitamin A (retinol). Vitamin A is essential for producing rhodopsin, a pigment in the eyes that enables low-light vision. If you're vitamin A deficient—which causes night blindness—eating carrots can restore normal night vision.</p>
    <h2>The exaggeration</h2>
    <p>If your vitamin A levels are already normal, eating more carrots won't give you superhuman night vision. Your eyes can only use what they need.</p>
    <h2>The WWII propaganda origin</h2>
    <p>British intelligence spread the carrot-eyesight story to hide the fact that radar was helping their pilots intercept German bombers at night. They attributed their pilots' success to a carrot-heavy diet, a deliberate misdirection that became folk wisdom.</p>`,
    category: 'health',
    tags: ['carrots', 'eyesight', 'vitamins', 'nutrition', 'WWII'],
    author: 'Neha Kulkarni',
    sources: [
      { label: 'Harvard Health - Carrots and eye health', url: 'https://example.com' },
      { label: 'Imperial War Museum - WWII food propaganda', url: 'https://example.com' },
    ],
    isTrending: false,
    isFeatured: false,
    viewCount: 6789,
  },
]

async function seed() {
  console.log('Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('Connected.')

  console.log('Clearing existing data...')
  await Category.deleteMany({})
  await Fact.deleteMany({})

  console.log('Seeding categories...')
  await Category.insertMany(categories)

  console.log('Seeding facts...')
  await Fact.insertMany(facts)

  console.log(`✅ Seeded ${categories.length} categories and ${facts.length} facts.`)
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
