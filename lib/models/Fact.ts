import mongoose, { Schema, Document, Model } from 'mongoose'

export type Verdict = 'true' | 'false' | 'mixture' | 'unproven' | 'satire' | 'outdated'

export interface IFact extends Document {
  title: string
  slug: string
  claim: string
  verdict: Verdict
  summary: string
  content: string
  category: string
  tags: string[]
  author: string
  sources: { label: string; url: string }[]
  imageUrl?: string
  isTrending: boolean
  isFeatured: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

const FactSchema = new Schema<IFact>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    claim: { type: String, required: true },
    verdict: {
      type: String,
      enum: ['true', 'false', 'mixture', 'unproven', 'satire', 'outdated'],
      required: true,
    },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true, lowercase: true },
    tags: [{ type: String, lowercase: true }],
    author: { type: String, default: 'FactBrief Staff' },
    sources: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    imageUrl: { type: String },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

FactSchema.index({ category: 1 })
FactSchema.index({ verdict: 1 })
FactSchema.index({ isTrending: 1 })
FactSchema.index({ title: 'text', claim: 'text', summary: 'text', tags: 'text' })

const Fact: Model<IFact> =
  mongoose.models.Fact || mongoose.model<IFact>('Fact', FactSchema)

export default Fact
