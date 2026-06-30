import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description: string
  icon: string
  color: string
  factCount: number
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '📋' },
    color: { type: String, default: '#6b7280' },
    factCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)

export default Category
