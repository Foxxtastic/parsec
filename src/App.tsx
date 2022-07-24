import { Layout, Menu, MenuProps } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { AddStopword } from './components/AddStopword';
import { DocumentListPage } from './components/DocumentListPage';
import { FileUploadPage } from './components/FileUploadPage';
import { StopWordsPage } from './components/StopWordsPage';

const { Header, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: "/",
    label: "Dokumentum feltöltés",
    style: { width: "25%" }
  },
  {
    key: "/documents",
    label: "Dokumentumok",
    style: { width: "25%" }
  },
  {
    key: "/stopwords",
    label: "Töltelékszavak",
    style: { width: "25%" }
  }
]

function App() {

  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = e => {
    navigate(e.key);
  };

  return (
    <div className="App">
      <Layout
        className='layout'
        style={{
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Header>
          <Menu
            theme='dark'
            mode='horizontal'
            items={menuItems}
            onClick={onClick}
          />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Routes>
            <Route path='/' element={<FileUploadPage />} />
            <Route path='/documents' element={<DocumentListPage />} />
            <Route path='/stopwords' element={<StopWordsPage />} />
            <Route path='/stopwords/add' element={<AddStopword />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
