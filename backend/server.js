const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());

// 할 일 목록 가져오기
app.get('/api/todos', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '데이터를 읽는 중 오류가 발생했습니다.' });
    res.json(JSON.parse(data));
  });
});

// 할 일 추가
app.post('/api/todos', (req, res) => {
  const newTodo = { id: Date.now(), text: req.body.text, completed: false };
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '데이터를 읽는 중 오류가 발생했습니다.' });
    const todos = JSON.parse(data);
    todos.push(newTodo);
    fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '데이터를 저장하는 중 오류가 발생했습니다.' });
      res.status(201).json(newTodo);
    });
  });
});

// 할 일 상태 전환 (완료/미완료)
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '데이터를 읽는 중 오류가 발생했습니다.' });
    let todos = JSON.parse(data);
    todos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '데이터를 업데이트하는 중 오류가 발생했습니다.' });
      res.json({ success: true });
    });
  });
});

// 할 일 삭제
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: '데이터를 읽는 중 오류가 발생했습니다.' });
    let todos = JSON.parse(data);
    todos = todos.filter(todo => todo.id !== id);
    fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), (err) => {
      if (err) return res.status(500).json({ error: '데이터를 삭제하는 중 오류가 발생했습니다.' });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
