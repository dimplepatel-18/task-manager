import { useEffect, useState } from 'react';
import { api } from './api';
import AuthForm from './components/AuthForm.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskItem from './components/TaskItem.jsx';
import './styles.css';



export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')||'null'));
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const loggedIn = !!token;

  useEffect(() => { if (loggedIn) load(); }, [loggedIn]);

  async function load(){
    const data = await api('/api/tasks', { token });
    setTasks(data);
  }

  function onAuth(t, u){
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t); setUser(u);
  }

  function logout(){
    localStorage.clear();
    setToken(null); setUser(null); setTasks([]);
  }

  async function saveTask(payload){
    if (editing) {
      const updated = await api(`/api/tasks/${editing._id}`, { method: 'PUT', body: payload, token });
      setTasks(tasks.map(t => t._id === updated._id ? updated : t));
      setEditing(null);
    } else {
      const created = await api('/api/tasks', { method:'POST', body: payload, token });
      setTasks([created, ...tasks]);
    }
  }

  async function toggle(task){
    const updated = await api(`/api/tasks/${task._id}/toggle`, { method:'PATCH', token });
    setTasks(tasks.map(t => t._id === updated._id ? updated : t));
  }

  function startEdit(task){ setEditing(task); }

  async function remove(task){
    await api(`/api/tasks/${task._id}`, { method:'DELETE', token });
    setTasks(tasks.filter(t=>t._id!==task._id));
  }

  if (!loggedIn) return (
    <div className="container">
      <h1>Task Manager</h1>
      <AuthForm onAuth={onAuth} />
      <p style={{opacity:.8}}>Backend URL: <code>{import.meta.env.VITE_API_URL}</code></p>
    </div>
  );

  return (
    <div className="container">
      <div className="card">
        <div className="row" style={{justifyContent:'space-between', width:'100%'}}>
          <h2>Welcome, {user?.name}</h2>
          <button className="button" onClick={logout}>Logout</button>
        </div>
      </div>

      <TaskForm onSave={saveTask} editing={editing} />

      {tasks.length === 0 && <div className="card">No tasks yet.</div>}
      {tasks.map(t => (
        <TaskItem key={t._id} task={t} onToggle={toggle} onEdit={startEdit} onDelete={remove} />
      ))}
    </div>
  );
}