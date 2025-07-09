import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("students");
    if (saved) {
      const parsed = JSON.parse(saved);
      const formatted = parsed.map(s => ({
        name: s.name,
        subject: s.subject,
        grade: parseFloat(s.grade)
      }));
      setStudents(formatted);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));  
  }, [students]);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!subject) newErrors.subject = "La asignatura es obligatoria.";
    if (grade === "") newErrors.grade = "El promedio es obligatorio.";
    else if (grade < 1 || grade > 7) newErrors.grade = "El promedio debe estar entre 1.0 y 7.0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newStudent = { name, subject, grade: parseFloat(grade) };

    if (editingIndex !== null) {
      const updated = [...students];
      updated[editingIndex] = newStudent;
      setStudents(updated);
      setEditingIndex(null);
    } else {
      setStudents([...students, newStudent]);
    }

    setName("");
    setSubject("");
    setGrade("");
    setErrors({});
  };

  const editStudent = (index) => {
    const s = students[index];
    setName(s.name);
    setSubject(s.subject);
    setGrade(s.grade);
    setEditingIndex(index);
  };

  const deleteStudent = (index) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  return (
    <div className="container">
      <h2>Evaluación de Alumnos</h2>

      <div className="card">
        <div className="card-title">
          {editingIndex !== null ? "Editar Evaluación" : "Agregar Nueva Evaluación"}
        </div>
        <form onSubmit={handleSubmit}>
          <label>Nombre del Alumno:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <p className="error">{errors.name}</p>

          <label>Asignatura:</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
          <p className="error">{errors.subject}</p>

          <label>Promedio (1.0 - 7.0):</label>
          <input
            type="number"
            step="0.1"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <p className="error">{errors.grade}</p>

          <button type="submit" className="save">
            {editingIndex !== null ? "Actualizar Evaluación" : "Agregar Evaluación"}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Evaluaciones Guardadas</div>
        {students.length === 0 ? (
          <p>No hay evaluaciones guardadas aún. ¡Agrega una!</p>
        ) : (
          students.map((s, i) => (
            <div className="evaluation-item" key={i}>
              <strong>Alumno: {s.name}</strong>
              <div>Asignatura: {s.subject}</div>
              <div>Promedio: {s.grade}</div>
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => editStudent(i)} className="edit">Editar</button>
                <button onClick={() => deleteStudent(i)} className="delete">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
