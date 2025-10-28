import Header from "./components/Header/Header";
import { Container, TextInput } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState } from "react";

function App() {
  const [tagList, setTags] = useState<string[]>([]);

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      setTags([...tagList, event.currentTarget.value])
    }
  };

  return (
    <div>
      <Header />
      <Container>
        <TextInput
          label="enter tag"
          required
          onKeyDown={addTag}
        />
        <>
          {tagList.map((value: string) => (
            <div>{value}</div>
          ))}
        </>
        Click to Queue
        <br />
        <button>Queue</button>
      </Container>
    </div>
  );
}

export default App;
