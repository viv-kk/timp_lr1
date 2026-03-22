import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IncidentsProvider } from './context/IncidentsContext';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import Edit from './pages/Edit';

function App() {
  return (
    <IncidentsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/add" element={<Form />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </BrowserRouter>
    </IncidentsProvider>
  );
}

export default App;