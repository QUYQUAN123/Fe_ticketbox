import { Route, Routes } from "react-router-dom";
import "./App.css";
import { listRouter } from "./contstant";

function App() {
  return (
    <Routes>
      {listRouter?.map((router, index) => (
        <Route path={router.path} element={router?.element} key={index} />
      ))}
    </Routes>
  );
}

export default App;
