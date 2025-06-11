import { useLocation } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import Sidebardash from "../../components/Sidebardash";

const Geography = () => {
  const location = useLocation();
  const initialData = location.state?.initialData || [];
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="flex">
      <Box width="250px">
        <Sidebardash />
      </Box>

      <Box m="40px" flexGrow={1}>
        <Header title="Geography" subtitle="Carte dynamique géographique" />
        <Box
          height="75vh"
          border={`1px solid ${colors.grey[100]}`}
          borderRadius="4px"
        >
          <GeographyChart 
            data={initialData}
            regionKey="country"     // Colonne avec nom pays ou code ISO (ex: "FR", "US")
            valueKey="value"        // Colonne à afficher sur la carte
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Geography;
