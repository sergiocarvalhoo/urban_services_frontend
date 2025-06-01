import { Box } from "@mui/material";
import { ServiceRequestList } from "../components/ServiceRequestList";

export default function Home() {
  return (
    <Box sx={{ p: 3 }}>
      <ServiceRequestList />
    </Box>
  );
}
