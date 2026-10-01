import {useEffect, useState} from "react";
import {getSpaces} from "../services/api";

function SpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSpaces() {

      try {
        const data = await getSpaces();
        setSpaces(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadSpaces();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Spaces</h1>
      {spaces.map((space) => (
        <div key={space.id}>
          <h2>{space.name}</h2>
          <p>{space.aura}</p>
          <p>{space.lofiStyle}</p>
        </div>
      ))}
    </div>
  );
}

export default SpacesPage;