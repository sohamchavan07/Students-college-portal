import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import supabase from "./utils/supabase";

const queryClient = new QueryClient();

function Page() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data: todos } = await supabase.from("todos").select();
      if (todos && todos.length > 1) {
        setTodos(todos);
      }
    }
    getTodos();
  }, []);

  return (
    <div>
      {todos.map((todo, idx) => (
        <li key={idx}>{JSON.stringify(todo)}</li>
      ))}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/page" element={<Page />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
