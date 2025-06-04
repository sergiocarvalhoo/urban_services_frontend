import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { IMaskInput } from "react-imask";

interface DocumentInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  onTypeChange: (type: "cpf" | "cnpj") => void;
  name: string;
  value: string;
  documentType: "cpf" | "cnpj";
  error?: boolean;
}

export const DocumentInput = React.forwardRef<
  HTMLInputElement,
  DocumentInputProps
>(function DocumentInput(props, ref) {
  const { onChange, onTypeChange, name, value, documentType, error } = props;

  const masks = {
    cpf: "000.000.000-00",
    cnpj: "00.000.000/0000-00",
  };

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <FormControl
        size="small"
        sx={{
          width: 140,
          "& .MuiOutlinedInput-root": {
            height: "56px",
          },
        }}
      >
        <InputLabel>Tipo</InputLabel>
        <Select
          value={documentType}
          label="Tipo"
          onChange={(e) => onTypeChange(e.target.value as "cpf" | "cnpj")}
        >
          <MenuItem value="cpf">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonIcon fontSize="small" />
              <span>CPF</span>
            </Box>
          </MenuItem>
          <MenuItem value="cnpj">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon fontSize="small" />
              <span>CNPJ</span>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Número do Documento"
        error={error}
        InputProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent: IMaskInput as any,
          inputProps: {
            mask: masks[documentType],
            unmask: true,
            ref,
            name,
            value,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onAccept: (_value: string, mask: any) => {
              onChange({
                target: {
                  name,
                  value: mask.unmaskedValue,
                },
              });
            },
            overwrite: true,
          },
        }}
      />
    </Box>
  );
});

DocumentInput.displayName = "DocumentInput";
