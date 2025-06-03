import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { cnpj, cpf } from "cpf-cnpj-validator";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DocumentInput } from "./DocumentInput";
import { api } from "../services/api";
import { RequestStatus, ServiceType } from "../types/service-request";
import { serviceTypeLabels } from "../constants/serviceRequestLabels";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  type: z.nativeEnum(ServiceType, {
    errorMap: () => ({ message: "Selecione um tipo válido." }),
  }),
  address: z.string().min(1, "Endereço é obrigatório."),
  description: z.string().min(1, "Descrição é obrigatória."),
  requesterName: z.string().min(1, "Nome do solicitante é obrigatório."),
  document: z.string().min(1, "Documento é obrigatório"),
});

export function ServiceRequestForm() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj">("cpf");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      type: undefined,
      address: "",
      description: "",
      requesterName: "",
      document: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    try {
      const numericDocument = data.document.replace(/\D/g, "");
      const isValid =
        documentType === "cpf"
          ? cpf.isValid(numericDocument)
          : cnpj.isValid(numericDocument);

      if (!isValid) {
        setError(`${documentType.toUpperCase()} inválido`);
        return;
      }

      await api.post("/service-requests", {
        ...data,
        document: numericDocument,
        status: RequestStatus.PENDING,
      });

      setSuccess("Solicitação criada com sucesso!");
      reset();
      setDocumentType("cpf");

      setTimeout(() => {
        navigate("/list");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Erro ao criar solicitação. Tente novamente.");
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
              <FormControl fullWidth error={!!errors.document}>
                <DocumentInput
                  {...field}
                  error={!!errors.document}
                  documentType={documentType}
                  onTypeChange={(type: "cpf" | "cnpj") => {
                    setDocumentType(type);
                    field.onChange("");
                  }}
                />
                {errors.document && (
                  <FormHelperText>{errors.document.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
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
