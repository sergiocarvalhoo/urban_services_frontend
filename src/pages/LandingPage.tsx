import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 10,
        textAlign: "center",
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Bem-vindo ao Urban Services
      </Typography>
      <Typography variant="h6" paragraph>
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
