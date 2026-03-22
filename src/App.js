import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IncidentsProvider } from './context/IncidentsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Form from './pages/Form';
import Edit from './pages/Edit';

function App() {
  return (
    <IncidentsProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/add" element={<Form />} />
            <Route path="/edit/:id" element={<Edit />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </IncidentsProvider>
  );
}

export default App;