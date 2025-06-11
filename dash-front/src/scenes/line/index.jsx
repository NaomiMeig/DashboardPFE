import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import Sidebardash from "../../components/Sidebardash";

const Line = () => {
  const location = useLocation();
  const initialData = location.state?.initialData || [];

  return (
    <Box display="flex">
      <Box width="250px">
        <Sidebardash />
      </Box>

      <Box m="40px" flexGrow={1}>
        <Header title="Line Chart" subtitle="Graphique linéaire dynamique" />
        <Box height="75vh">
          <LineChart 
            data={initialData}
            xAxisKey="date"      // nom de la colonne pour l'axe X
            yAxisKey="value"     // nom de la colonne pour l'axe Y
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Line;
