export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <div className="card todo">
      <div>
        <div className="row">
          <input 
            type="checkbox" 
            checked={task.status === 'completed'} 
            onChange={() => onToggle(task)} 
          />
          <strong>{task.title}</strong>
          <span className="badge">{task.status}</span>
        </div>
        {task.description && <div style={{ opacity: 0.8, marginTop: 6 }}>{task.description}</div>}
      </div>
      <div className="row">
        <button type="button" className="button" onClick={() => onEdit(task)}>Edit</button>
        <button type="button" className="button" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
}
