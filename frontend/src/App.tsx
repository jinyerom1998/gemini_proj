import { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const API_URL = 'http://localhost:3001/api/todos';

  // 할 일 목록 가져오기
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('할 일을 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 할 일 추가
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      if (response.ok) {
        setInput('');
        fetchTodos();
      }
    } catch (error) {
      console.error('할 일을 추가하는 중 오류 발생:', error);
    }
  };

  // 할 일 완료 상태 토글
  const toggleTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('상태 업데이트 중 오류 발생:', error);
    }
  };

  // 할 일 삭제
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('할 일을 삭제하는 중 오류 발생:', error);
    }
  };

  return (
    <div className="container">
      <h1>할 일 목록</h1>
      <form onSubmit={addTodo} className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요..."
        />
        <button type="submit">추가</button>
      </form>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
