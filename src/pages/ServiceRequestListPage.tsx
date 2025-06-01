import { Box, Typography } from "@mui/material";
import { ServiceRequestList } from "../components/ServiceRequestList";

export default function ServiceRequestListPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h4" mb={3}>
        Lista de Solicitações
      </Typography>
      <ServiceRequestList />
    </Box>
  );
}
