import FactForm from '@/components/admin/FactForm'
import Link from 'next/link'

export const metadata = { title: 'New Fact Check' }

export default function NewFactPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/facts" className="text-sm text-gray-500 hover:text-blue-700">← Back to Facts</Link>
        <h1 className="text-2xl font-black text-gray-900 mt-2">New Fact Check</h1>
        <p className="text-gray-500 text-sm">Publish a new fact-check article</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <FactForm mode="create" />
      </div>
    </div>
  )
}
