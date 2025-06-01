import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ServiceRequestListPage from "./pages/ServiceRequestListPage";

export function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Serviços Urbanos
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Início
          </Button>
          <Button color="inherit" component={Link} to="/list">
            Listar Solicitações
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/list" element={<ServiceRequestListPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
