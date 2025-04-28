import EquipmentList from "./pages/EquipmentList";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <EquipmentList />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: "8px",
            background: "#fff",
            color: "#333"
          },
          success: {
            style: {
              border: "1px solid #10B981",
              borderLeft: "4px solid #10B981"
            }
          },
          error: {
            style: {
              border: "1px solid #EF4444",
              borderLeft: "4px solid #EF4444"
            },
            duration: 3000
          }
        }}
      />
    </>
  );
}

export default App;
