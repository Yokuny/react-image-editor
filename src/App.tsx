import Canvas from "./components/Canvas.tsx";
import Header from "./components/Header/Header.tsx";
import Menu from "./components/Menu.tsx";
import Toolbar from "./components/Toolbar/Toolbar.tsx";

const App = () => {
  return (
    <div className="app">
      <Header />
      <Menu />
      <Toolbar />
      <Canvas />
    </div>
  );
};

export default App;
