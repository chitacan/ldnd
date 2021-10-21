import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "../hooks/live_socket";

const queryClient = new QueryClient();

export const Providers = ({socket, children}) => (
  <QueryClientProvider client={queryClient}>
    <Provider value={socket}>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </Provider>
  </QueryClientProvider>
);