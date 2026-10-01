import AppRoutes from "./routes/AppRoutes";
import { useMergeCartApiMutation } from "./store/apiSlice";
import { useCartSync } from "./hooks/useCartSync";
import { useRoutePrefetch } from "./hooks/useRoutePrefetch";

function App() {
  const [mergeCartApi] = useMergeCartApiMutation();

  // Cart merge on login
  useCartSync(mergeCartApi);

  // Route chunks ko pehle se load rakho -> links instant khulte hain
  useRoutePrefetch();

  return (
    <AppRoutes />
  );
}

export default App;
