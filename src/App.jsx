import AppRoutes from "./routes/AppRoutes";
import { useMergeCartApiMutation } from "./store/apiSlice";
import { useCartSync } from "./hooks/useCartSync";

function App() {
  const [mergeCartApi] = useMergeCartApiMutation();

  // Cart merge on login
  useCartSync(mergeCartApi);

  return (
    <AppRoutes />
  );
}

export default App;
