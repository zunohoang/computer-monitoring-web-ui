import { Button } from "antd";

function App() {
  const handleClick = () => {
    console.log("AntD button clicked!");
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-green-600">
          Hello Vite + React + TS + Tailwind + Ant Design 🚀
        </h1>
        <Button type="primary" onClick={handleClick}>
          AntD Button
        </Button>
      </div>
    </div>
  );
}

export default App;
