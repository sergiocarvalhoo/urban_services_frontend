import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { LoginDialog } from "./components/LoginDialog";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CreateServiceRequest } from "./pages/CreateServiceRequest";
import LandingPage from "./pages/LandingPage";
import ServiceRequestListPage from "./pages/ServiceRequestListPage";

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const [loginDialog, setLoginDialog] = useState(false);

  return (
    <BrowserRouter>
      <Box
        sx={{
          margin: 0,
          minHeight: "100vh",
          bgcolor: "background.default",
          paddingTop: "64px",
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
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
            <Button color="inherit" component={Link} to="/create">
              Criar Solicitação
            </Button>

            {!isAuthenticated ? (
              <Button
                color="inherit"
                onClick={() => setLoginDialog(true)}
                startIcon={<LockIcon />}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={logout}
                startIcon={<LogoutIcon />}
                sx={{ ml: 2 }}
              >
                Sair
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/list" element={<ServiceRequestListPage />} />
            <Route path="/create" element={<CreateServiceRequest />} />
          </Routes>
        </Container>

        <LoginDialog open={loginDialog} onClose={() => setLoginDialog(false)} />
      </Box>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
