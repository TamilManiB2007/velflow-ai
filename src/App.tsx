import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AdminDashboard } from "./AdminDashboard.tsx";
import SubmitReview from "./pages/SubmitReview.tsx";

const convex = new ConvexReactClient("https://combative-cardinal-264.convex.cloud");
const queryClient = new QueryClient();

const App = () => (
  <ConvexProvider client={convex}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/velflow-admin-2026" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/submit-review" element={<SubmitReview />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ConvexProvider>
);

export default App;
