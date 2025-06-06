/* eslint-disable @typescript-eslint/no-unused-vars */
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { useEffect, useState } from "react";
import {
  requestStatusLabels,
  serviceTypeLabels,
} from "../constants/serviceRequestLabels";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import {
  RequestStatus,
  ServiceType,
  type ServiceRequest,
  type ServiceRequestFilters,
} from "../types/service-request";

function formatDocument(doc: string): string {
  const numbers = doc.replace(/\D/g, "");

  if (numbers.length === 11) {
    return cpf.format(numbers);
  } else if (numbers.length === 14) {
    return cnpj.format(numbers);
  }

  return doc;
}

export function ServiceRequestList() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filter, setFilter] = useState<ServiceType | "">("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [statusMenu, setStatusMenu] = useState<null | HTMLElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: ServiceRequestFilters = {};

      if (filter) {
        params.type = filter;
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get<ServiceRequest[]>("/service-requests", {
        params,
      });

      setRequests(response.data);
    } catch (err) {
      console.error("Erro ao buscar solicitações:", err);
      setError("Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, statusFilter]);

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!selectedRequest) return;

    try {
      await api.patch(`/service-requests/${selectedRequest.id}/status`, {
        status: newStatus,
      });

      await fetchRequests();
      setStatusMenu(null);
      setSelectedRequest(null);
    } catch (err) {
      setError("Erro ao atualizar status");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/service-requests/${id}`);
      await fetchRequests();
      setDeleteConfirm(null);
      setSuccess("Solicitação excluída com sucesso!");
    } catch (err) {
      setError("Erro ao excluir solicitação");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Solicitações de Serviços</Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <FormControl sx={{ width: 300 }}>
          <InputLabel>Filtrar por Tipo</InputLabel>
          <Select
            value={filter}
            label="Filtrar por Tipo"
            onChange={(e) => setFilter(e.target.value as ServiceType | "")}
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.values(ServiceType).map((type) => (
              <MenuItem key={type} value={type}>
                {serviceTypeLabels[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 200 }}>
          <InputLabel>Filtrar por Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filtrar por Status"
            onChange={(e) =>
              setStatusFilter(e.target.value as RequestStatus | "")
            }
          >
            <MenuItem value="">Todos</MenuItem>
            {Object.values(RequestStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {requestStatusLabels[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {requests.length === 0 ? (
            <Typography color="text.secondary" textAlign="center">
              Nenhuma solicitação encontrada
            </Typography>
          ) : (
            requests.map((req) => (
              <Card key={req.id}>
                <CardContent
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">
                      {serviceTypeLabels[req.type] ||
                        req.type.replace("_", " ")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {req.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Solicitante: {req.requesterName}
                    </Typography>
                    <Typography variant="body2">
                      Endereço: {req.address}
                    </Typography>
                    <Typography variant="body2">
                      Documento: {formatDocument(req.document)}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Chip
                        label={requestStatusLabels[req.status]}
                        color={getStatusColor(req.status)}
                      />
                      {isAuthenticated && (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              setSelectedRequest(req);
                              setStatusMenu(e.currentTarget);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          {req.status === RequestStatus.PENDING && (
                            <IconButton
                              size="small"
                              onClick={() => setDeleteConfirm(req.id)}
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      )}

      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta solicitação?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
          <Button
            color="error"
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={statusMenu}
        open={Boolean(statusMenu)}
        onClose={() => {
          setStatusMenu(null);
          setSelectedRequest(null);
        }}
      >
        {Object.values(RequestStatus).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
            disabled={selectedRequest?.status === status}
          >
            <Chip
              label={requestStatusLabels[status]}
              size="small"
              color={getStatusColor(status)}
              sx={{ mr: 1 }}
            />
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
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
