import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Layout from './components/Layout';
import DocumentPage from './pages/DocumentPage';
import { pages } from './content';

function NotFound() {
  return (
    <div className="prose prose-slate">
      <h1>Page not found</h1>
      <p><Link to="/">Back to the Readiness Roadmap</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {pages.map((p) => (
            <Route key={p.route} path={p.route} element={<DocumentPage key={p.key} page={p} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
