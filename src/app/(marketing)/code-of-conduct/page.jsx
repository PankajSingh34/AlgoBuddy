import Link from 'next/link'
import CodeOfConductContent from '@/app/components/CodeOfConductContent'

export default function CodeOfConductPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-udemy-dark">
      <div className="max-w-5xl mx-auto px-6 py-12">

        

        <h1 className="text-4xl font-bold mb-8">
          Code Of Conduct
        </h1>

        <CodeOfConductContent />

      </div>

      
    </main>
  )
}