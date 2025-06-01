// src/components/ServiceRequestForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { serviceTypeLabels } from "../constants/serviceRequestLabels";
import { api } from "../services/api";
import { RequestStatus, ServiceType } from "../types/service-request";

const schema = z.object({
  type: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: "Selecione um tipo válido." }),
  }),
  address: z.string().min(1, "Endereço é obrigatório."),
  description: z.string().min(1, "Descrição é obrigatória."),
  requesterName: z.string().min(1, "Nome do solicitante é obrigatório."),
  document: z
    .string()
    .refine((val) => cpf.isValid(val) || cnpj.isValid(val), {
      message: "CPF ou CNPJ inválido.",
    }),
});

type FormData = z.infer<typeof schema>;

export function ServiceRequestForm() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: undefined,
      address: "",
      description: "",
      requesterName: "",
      document: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await api.post("/service-requests", {
        ...data,
        status: RequestStatus.PENDING,
      });
      setSuccess("Solicitação criada com sucesso!");
      reset();
    } catch {
      setError("Erro ao criar solicitação.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={3}>
        Criar nova Solicitação
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel id="type-label">Tipo da Solicitação</InputLabel>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="type-label"
                  label="Tipo da Solicitação"
                  required
                >
                  {Object.values(ServiceType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {serviceTypeLabels[type] || type}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.type && (
              <Typography color="error" variant="caption">
                {errors.type.message}
              </Typography>
            )}
          </FormControl>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Endereço"
                fullWidth
                required
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição detalhada"
                fullWidth
                multiline
                minRows={3}
                required
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Controller
            name="requesterName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome do Solicitante"
                fullWidth
                required
                error={!!errors.requesterName}
                helperText={errors.requesterName?.message}
              />
            )}
          />

          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="CPF ou CNPJ"
                fullWidth
                required
                error={!!errors.document}
                helperText={errors.document?.message}
              />
            )}
          />

          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </Stack>
      </form>

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

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
