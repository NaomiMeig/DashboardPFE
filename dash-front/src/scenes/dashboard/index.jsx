import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Paper,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Sidebardash from "../../components/Sidebardash";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
import GeographyChart from "../../components/GeographyChart";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import FunctionsIcon from '@mui/icons-material/Functions';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef();
  const isMobile = useMediaQuery("(max-width:768px)");

  const dataFromImport = location.state?.initialData;

  const [selectedXAxis, setSelectedXAxis] = useState(null);
  const [selectedYAxis, setSelectedYAxis] = useState(null);
  const [selectedPieCategory, setSelectedPieCategory] = useState(null);
  const [selectedPieValue, setSelectedPieValue] = useState(null);
  const [selectedBarXAxis, setSelectedBarXAxis] = useState(null);
  const [selectedBarYAxis, setSelectedBarYAxis] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!dataFromImport) {
      navigate("/importation");
    }
  }, [dataFromImport, navigate]);

  useEffect(() => {
    if (dataFromImport && !isInitialized) {
      const { columns, numeric_columns } = dataFromImport;
      setSelectedXAxis(columns?.[0] || null);
      setSelectedYAxis(numeric_columns?.[0] || null);
      setSelectedPieCategory(columns?.[0] || null);
      setSelectedPieValue(numeric_columns?.[0] || null);
      setSelectedBarXAxis(columns?.[0] || null);
      setSelectedBarYAxis(numeric_columns?.[0] || null);
      setIsInitialized(true);
    }
  }, [dataFromImport, isInitialized]);

  if (!dataFromImport) return null;

  const { data, columns, numeric_columns, stats, row_count } = dataFromImport;

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save("dashboard_report.pdf");
  };

  const handleClearData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/clear", {
        method: "GET",
      });

      if (response.ok) {
        navigate("/importation", { replace: true });
      } else {
        console.error("Erreur lors de la suppression des données");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const calculateBasicStats = (col) => {
    if (!col || !numeric_columns.includes(col)) return {};
    const values = data.map(item => parseFloat(item[col])).filter(v => !isNaN(v));
    if (values.length === 0) return {};
    return {
      sum: values.reduce((a, b) => a + b, 0),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  };

  const StatItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
      <Tooltip title={label} arrow><span>{icon}</span></Tooltip>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );

  return (
    <Box display="flex">
      <Sidebardash />
      <Box flex="1" m="20px" ref={reportRef}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Header title="DASHBOARD" subtitle={`Analyse des données (${row_count} enregistrements)`} />
          <Box>
            <Button onClick={downloadPDF} startIcon={<DownloadOutlinedIcon />} sx={{ mr: 1 }}>Télécharger</Button>
            <Button onClick={handleClearData} startIcon={<DeleteOutlineIcon />} color="error">Effacer</Button>
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 2, my: 3, borderRadius: "16px" }}>
          <Box display="flex" gap="20px" flexWrap="wrap">
            {[{
              label: "Axe X", value: selectedXAxis, setter: setSelectedXAxis, options: columns
            }, {
              label: "Axe Y", value: selectedYAxis, setter: setSelectedYAxis, options: numeric_columns
            }, {
              label: "Catégorie (Camembert)", value: selectedPieCategory, setter: setSelectedPieCategory, options: columns
            }, {
              label: "Valeur (Camembert)", value: selectedPieValue, setter: setSelectedPieValue, options: numeric_columns
            }, {
              label: "Axe X (Bar)", value: selectedBarXAxis, setter: setSelectedBarXAxis, options: columns
            }, {
              label: "Axe Y (Bar)", value: selectedBarYAxis, setter: setSelectedBarYAxis, options: numeric_columns
            }].map(({ label, value, setter, options }) => (
              <FormControl key={label} fullWidth sx={{ minWidth: 150 }}>
                <InputLabel>{label}</InputLabel>
                <Select value={value || ""} onChange={(e) => setter(e.target.value)} label={label}>
                  {options.map((col) => (
                    <MenuItem key={`${label}-${col}`} value={col}>{col}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>
        </Paper>

        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))" gridAutoRows="200px" gap="20px">
          <Box gridColumn="span 2" bgcolor={colors.primary[400]} p={2} borderRadius="16px">
            <StatBox title="Nombre de lignes" value={row_count} />
          </Box>

          {numeric_columns.slice(0, 3).map((col) => {
            const stats = calculateBasicStats(col);
            return (
              <Box key={col} gridColumn="span 3" bgcolor={colors.primary[400]} p={2} borderRadius="16px" >
                <StatBox
                  title={stats.avg?.toFixed(2) || "N/A"}
                  subtitle={`Moyenne ${col}`}
                  progress={stats.max ? stats.avg / stats.max : 0}
                  increase={
                    <Box display="flex" flexDirection="column">
                      <StatItem icon={<TrendingUpIcon fontSize="small" />} label="Maximum" value={stats.max?.toFixed(2) || "-"} />
                      <StatItem icon={<TrendingDownIcon fontSize="small" />} label="Minimum" value={stats.min?.toFixed(2) || "-"} />
                      <StatItem icon={<FunctionsIcon fontSize="small" />} label="Somme" value={stats.sum?.toFixed(2) || "-"} />
                      <StatItem icon={<EqualizerIcon fontSize="small" />} label="Nombre" value={stats.count || "-"} />
                    </Box>
                  }
                />
              </Box>
            );
          })}

          {selectedXAxis && selectedYAxis && (
            <Box 
              gridColumn="span 10" 
              gridRow="span 2" 
                sx={{
                  bgcolor: colors.primary[500],
                  p: 3,
                  borderRadius: "24px",
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)",
                  },
                }}
            >
              <Typography variant="h5" mb={2}>📈 Évolution des {selectedYAxis} par {selectedXAxis}</Typography>
              <Box height="400px">
                <LineChart data={data} xAxisKey={selectedXAxis} yAxisKey={selectedYAxis} isDashboard={true} />
              </Box>
            </Box>
          )}

          {selectedPieCategory && selectedPieValue && (
            <Box 
              gridColumn="span 12" 
              gridRow="span 3" 
              sx={{
                  bgcolor: colors.primary[500],
                  p: 3,
                  borderRadius: "24px",
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)",
                  },
              }}
            >
              <Typography variant="h5" mb={2}>Répartition par {selectedPieCategory}</Typography>
              <Box height="400px">
                <PieChart data={data} idKey={selectedPieCategory} valueKey={selectedPieValue} />
              </Box>
            </Box>
          )}

          {selectedBarXAxis && selectedBarYAxis && (
            <Box 
             gridColumn="span 12" 
             gridRow="span 3" 
             sx={{
                  bgcolor: colors.primary[500],
                  p: 3,
                  borderRadius: "24px",
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)",
                  },
              }}
            >
              <Typography variant="h5" mb={2}>Histogramme des {selectedBarYAxis} par {selectedBarXAxis}</Typography>
              <Box height="400px">
                <BarChart data={data} xAxisKey={selectedBarXAxis} yAxisKey={selectedBarYAxis} />
              </Box>
            </Box>
          )}

          {(() => {
            const detectCountryColumn = (columns) => {
              const keywords = ['country', 'pays', 'state', 'location'];
              return columns.find(col => keywords.some(k => col.toLowerCase().includes(k)));
            };

            const geoKey = detectCountryColumn(columns);
            const valueKey = numeric_columns?.[0];
            const isValid = geoKey && valueKey && data.some(d => d[geoKey] && !isNaN(parseFloat(d[valueKey])));

            if (!isValid) return null;

            return (
              <Box 
                gridColumn="span 12" 
                gridRow="span 3" 
                sx={{
                  bgcolor: colors.primary[500],
                  p: 3,
                  borderRadius: "24px",
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)",
                  },
              }}
              >
                <Typography variant="h5" mb={2}>Carte des {valueKey}</Typography>
                <Box height="400px">
                  <GeographyChart data={data} countryKey={geoKey} valueKey={valueKey} />
                </Box>
              </Box>
            );
          })()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;


