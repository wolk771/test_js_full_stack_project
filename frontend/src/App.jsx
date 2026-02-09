import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() { return <h2>Frontend Home</h2>; }
function Dashboard() { return <h2>Dashboard Bereich</h2>; }

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <hr />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<h2>404 - Seite nicht gefunden (React Router)</h2>} />
      </Routes>
    </BrowserRouter>
  );
}