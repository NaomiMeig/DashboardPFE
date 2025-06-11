import { Box, Typography} from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import Sidebardash from "../../components/Sidebardash";
import { useLocation } from "react-router-dom";

const Bar = () => {
  const location = useLocation();
  const initialData = location.state?.initialData || [];
  const { data, columns, numeric_columns } = initialData;

  return (
    <Box display="flex">
      <Box width="250px">
        <Sidebardash />
      </Box>
      <Box m="40px" flexGrow={1}>
        <Header title="Bar Chart" subtitle="Simple Bar Chart" />
        <Box height="75vh">
          {data && columns && numeric_columns ? (
            <BarChart 
              data={data}
              xAxisKey={columns[0]}
              yAxisKey={numeric_columns[0]}
              isDashboard={false}
            />
          ) : (
            <Typography variant="h6" color="textSecondary">
              Aucune donnée disponible. Veuillez importer des données depuis le dashboard.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Bar;