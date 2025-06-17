import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.js";
import Home from "./pages/Home/Home.jsx";
import ButtonsUserRegister from "./pages/Register/ButtonsUserRegister.jsx";
import PontosDeDescarte from "./pages/dropPoints/PontosDeDescarte.jsx";
import LoginModal from "./components/LoginModal.jsx";
import RegistroDeUsuarios from "./pages/Register/UserRegister.jsx";
import CatadorRegister from './pages/Register/CatadorRegister';
import Header from "./components/Header.jsx";
// import AccessibilityTheme from "./components/AccessibilityTheme.jsx"; // Removida daqui se for um modal global
import { AccessibilityThemeProvider } from "./context/AccessibilityThemeContext.jsx";
import Footer from "./components/Footer.jsx";
import Agendamentos from "./pages/Agendamentos/Agendamentos.jsx";
import Conteudos from "./pages/Conteudos/Conteudos.jsx";
import Artigo1 from "./pages/Conteudos/Artigo1.jsx";
import Noticias from "./pages/Noticias/Noticias.jsx";
import VLibras from "./components/VLibras.jsx";
import AccessibilityTheme from "./components/AccessibilityTheme.jsx"; // Re-importado se for um modal

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false); // Estado para controlar a abertura/fechamento do modal de tema

  useEffect(() => {
    serviceWorkerRegistration.register({
      onUpdate: (registration) => {
        setShowUpdate(true);
        window.swUpdate = registration.waiting;
      },
    });
  }, []);

  const reloadPage = () => {
    if (window.swUpdate) {
      window.swUpdate.postMessage({ type: "SKIP_WAITING" });
      window.swUpdate.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          window.location.reload();
        }
      });
    }
  };

  return (
    <Router>
      <AccessibilityThemeProvider>
        <div className="App">
          <ConditionalHeader openLoginModal={() => setIsLoginModalOpen(true)} />
          <Routes>
            <Route path="/" element={<Home openLoginModal={() => setIsLoginModalOpen(true)} />} />
            <Route path="/ButtonsUserRegister" element={<ButtonsUserRegister />} />
            <Route path="/dropPoints" element={<PontosDeDescarte />} />
            <Route path="/UserRegister" element={<RegistroDeUsuarios />} />
            <Route path="/CatadorRegister" element={<CatadorRegister />} />
            <Route path="/Agendamentos" element={<Agendamentos />} />
            <Route path="/Conteudos" element={<Conteudos />} />
            <Route path="/Artigo1" element={<Artigo1 />} />
            <Route path="/Noticias" element={<Noticias />} />
          </Routes>

          {showUpdate && (
            <div className="update-notification">
              <p>Nova versão disponível!</p>
              <button onClick={reloadPage}>Atualizar</button>
            </div>
          )}

          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
          
          {/* POSICIONAMENTO DO ACCESSIBILITYTHEME ACIMA DO VLIBRAS */}
          {/* A PROPRIEDADE isOpen/onClose indica que ele funciona como um modal/overlay */}
          <AccessibilityTheme isOpen={isThemeOpen} onClose={() => setIsThemeOpen(false)} /> 
          <ConditionalFooter />
          <VLibras />
          
          {/* O botão para abrir/fechar o modal de tema */}
          <div className="theme-accessibility-button">
            <button onClick={() => setIsThemeOpen(!isThemeOpen)}>
              {isThemeOpen ? "Fechar Tema" : "Abrir Tema"}
            </button>
          </div>
        </div>
      </AccessibilityThemeProvider>
    </Router>
  );
}

// Componente para renderizar o cabeçalho condicionalmente
function ConditionalHeader({ openLoginModal }) {
  const location = useLocation();
  const showHeaderRoutes = [
    "/", // <<<< ADICIONADO: Rota da Home para mostrar o Header
    "/CatadorRegister",
    "/UserRegister",
    "/ButtonsUserRegister",
    "/dropPoints",
    "/Agendamentos",
    "/Conteudos",
    "/Artigo1",
    "/Noticias"
  ];

  return showHeaderRoutes.includes(location.pathname) ? (
    <Header openLoginModal={openLoginModal} />
  ) : null;
}

// Componente para renderizar o rodapé condicionalmente
function ConditionalFooter() {
  const location = useLocation();
  const showFooterRoutes = [
    "/", // <<<< ADICIONADO: Rota da Home para mostrar o Footer
    "/CatadorRegister",
    "/UserRegister",
    "/ButtonsUserRegister",
    "/dropPoints",
    "/Agendamentos",
    "/Conteudos",
    "/Artigo1",
    "/Noticias"
  ];

  return showFooterRoutes.includes(location.pathname) ? <Footer /> : null;
}

export default App;