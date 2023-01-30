import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [list, setList] = useState([]);

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
            <div id={key}>
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
