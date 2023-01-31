import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { createTrace } from "./trace";

function App() {
  const [list, setList] = useState([]);

  useEffect(() => {
    createTrace();
  }, []);

  const trap = () => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon/pikachu")
      .then((response) => {
        setList([...list, response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <button onClick={() => trap()}>Atrapar a Pikachu</button>
      {list.length > 0 && (
        <div className="flex">
          {list.map((item, key) => (
            <div key={key}>
              <img
                className="logo"
                src={item?.sprites?.front_default}
                alt={item.name}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
