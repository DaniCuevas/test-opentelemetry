import { context, trace } from "@opentelemetry/api";
import axios from "axios";
import { useState } from "react";
import "./App.css";
import { createTrace } from "./trace";

function App() {
  const [list, setList] = useState([]);

  const trap = () => {
    const traceProvider = createTrace();
    const traza = traceProvider.getTracer('poke-traza')
    const span1 = traza.startSpan(`poke-span`);
    context.with(trace.setSpan(context.active(), span1), () => {
      axios
        .get("https://pokeapi.co/api/v2/pokemon/pikachu")
        .then((response) => {
          setList([...list, response.data]);
          span1.addEvent('poke-completed');
          span1.end();
        })
        .catch((error) => {
          console.log(error);
          span1.end();
        });
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
