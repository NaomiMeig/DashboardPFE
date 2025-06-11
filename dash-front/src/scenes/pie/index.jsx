import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import Sidebardash from "../../components/Sidebardash";

const Pie = () => {
  const location = useLocation();
  const initialData = location.state?.initialData || [];

  return (
    <Box display="flex">
      <Box width="250px">
        <Sidebardash />
      </Box>

      <Box m="40px" flexGrow={1}>
        <Header title="Pie Chart" subtitle="Graphique en camembert dynamique" />
        <Box height="75vh">
          {/* Choisis ici les colonnes que tu veux pour idKey, valueKey, labelKey */}
          <PieChart 
            data={initialData}
            idKey="category"       // remplace par la bonne colonne
            valueKey="value"       // remplace par la bonne colonne
            labelKey="category"    // ou autre champ à afficher comme libellé
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Pie;
