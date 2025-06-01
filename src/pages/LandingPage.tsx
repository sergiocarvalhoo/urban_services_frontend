import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 10,
        textAlign: "center",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Bem-vindo ao Sistema de Solicitações Urbanas
      </Typography>
      <Typography variant="h6" gutterBottom>
        Plataforma para cadastro e gerenciamento de solicitações de serviços
        urbanos, como troca de lâmpadas em postes e reparo de vias públicas.
      </Typography>
      <Button
        variant="contained"
        size="large"
        component={RouterLink}
        to="/list"
      >
        Ver Solicitações
      </Button>
    </Box>
  );
}
