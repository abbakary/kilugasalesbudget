import React, { useState } from 'react';

const Header = () => (
  <header className="bg-blue-600 text-white p-4">
    <h1 className="text-2xl font-bold">Simple App</h1>
  </header>
);

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Counter</h2>
      <div className="text-3xl font-bold text-blue-600 mb-4">{count}</div>
      <div className="space-x-2">
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          +
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          -
        </button>
        <button 
          onClick={() => setCount(0)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState(['Learn React', 'Build an app']);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Todo List</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new todo..."
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={addTodo}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span>{todo}</span>
            <button
              onClick={() => removeTodo(index)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Counter />
          <TodoList />
          
          <Card title="Welcome">
            <p className="text-gray-600">
              This is a minimal React app with simple components. 
              You can interact with the counter and todo list.
            </p>
            <div className="mt-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                React
              </span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm ml-2">
                TypeScript
              </span>
              <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm ml-2">
                Tailwind CSS
              </span>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
