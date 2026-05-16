import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Note: This expects a 'todos' table in your Supabase project
  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <ul className="list-disc pl-5">
        {todos?.map((todo) => (
          <li key={todo.id}>{todo.name}</li>
        ))}
        {(!todos || todos.length === 0) && (
          <p className="text-slate-400">No data found in 'todos' table.</p>
        )}
      </ul>
    </div>
  )
}
