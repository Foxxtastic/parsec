import { Layout, Menu, MenuProps } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { AddStopword } from './components/specialwords/AddStopword';
import { DocumentListPage } from './components/documents/DocumentListPage';
import { HomePage } from './components/HomePage';
import { StopwordsPage } from './components/specialwords/StopwordsPage';
import { KeywordsPage } from './components/specialwords/KeywordsPage';
import { AddKeyword } from './components/specialwords/AddKeyword';

const { Header, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: "/",
    label: "Home",
    style: { width: "10%" }
  },
  {
    key: "/documents",
    label: "Dokumentumok",
    style: { width: "20%" }
  },
  {
    key: "/keywords",
    label: "Kulcsszavak",
    style: { width: "20%" }
  },
  {
    key: "/stopwords",
    label: "Töltelékszavak",
    style: { width: "20%" }
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
            <Route path='/' element={<HomePage />} />
            <Route path='/documents' element={<DocumentListPage />} />
            <Route path='/keywords' element={<KeywordsPage />} />
            <Route path='/keywords/add' element={<AddKeyword />} />
            <Route path='/stopwords' element={<StopwordsPage />} />
            <Route path='/stopwords/add' element={<AddStopword />} />
          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
