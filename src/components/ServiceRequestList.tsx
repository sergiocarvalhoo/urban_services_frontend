// src/components/ServiceRequestList.tsx
import {
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ServiceType } from "../types/service-request";
import type { ServiceRequest } from "../types/service-request";

export function ServiceRequestList() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filter, setFilter] = useState<ServiceType | "">("");

  const fetchRequests = async () => {
    try {
      const response = await api.get<ServiceRequest[]>("/service-requests", {
        params: filter ? { type: filter } : {},
      });
      setRequests(response.data);
    } catch (err) {
      console.error("Erro ao buscar solicitações:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Solicitações de Serviços
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Filtrar por Tipo</InputLabel>
        <Select
          value={filter}
          label="Filtrar por Tipo"
          onChange={(e) => setFilter(e.target.value as ServiceType | "")}
        >
          <MenuItem value="">Todos</MenuItem>
          {Object.values(ServiceType).map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace("_", " ")}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={2}>
        {requests.map((req) => (
          <Card key={req.id}>
            <CardContent>
              <Typography variant="h6">{req.type.replace("_", " ")}</Typography>
              <Typography variant="body2" color="text.secondary">
                {req.description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Solicitante: {req.requesterName}
              </Typography>
              <Typography variant="body2">Endereço: {req.address}</Typography>
              <Typography variant="body2">Documento: {req.document}</Typography>
              <Chip
                label={req.status}
                sx={{ mt: 1 }}
                color={getStatusColor(req.status)}
              />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "default";
    case "IN_PROGRESS":
      return "warning";
    case "COMPLETED":
      return "success";
    default:
      return "default";
  }
}
