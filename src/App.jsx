import { createSignal, createEffect, For } from 'solid-js'
import './App.css'

function App() {
  const [todos, setTodos] = createSignal([])
  const [inputValue, setInputValue] = createSignal('')

  // Load from localStorage on mount
  createEffect(() => {
    const saved = localStorage.getItem('todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  })

  // Save to localStorage on change
  createEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos()))
  })

  const addTodo = (e) => {
    e.preventDefault()
    const text = inputValue().trim()
    if (!text) return
    setTodos([...todos(), { id: Date.now(), text, completed: false }])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos().map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos().filter(todo => todo.id !== id))
  }

  return (
    <div class="container">
      <h1>Todo App</h1>

      <form onSubmit={addTodo} class="add-form">
        <input
          type="text"
          value={inputValue()}
          onInput={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add</button>
      </form>

      <ul class="todo-list">
        <For each={todos()}>
          {(todo) => (
            <li class={todo.completed ? 'completed' : ''}>
              <span onClick={() => toggleTodo(todo.id)}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} class="delete-btn">
                ×
              </button>
            </li>
          )}
        </For>
      </ul>

      {todos().length === 0 && (
        <p class="empty-state">No todos yet. Add one above!</p>
      )}

      <div class="stats">
        {todos().filter(t => !t.completed).length} tasks remaining
      </div>
    </div>
  )
}

export default App
