import {  useEffect, useState } from "react";
import { Box, Typography, useTheme, Paper, Button } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebardash from "../../components/Sidebardash";
import TimelineChart from "../../components/TimelineChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const Reports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef();
  const dataFromImport = location.state?.initialData;

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

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("analytics_report.pdf");
  };

  useEffect(() => {
    if (!dataFromImport) {
      navigate("/importation");
    }
  }, [dataFromImport, navigate]);

  if (!dataFromImport) return null;

  const { data, columns, numeric_columns, row_count } = dataFromImport;

  return (
    <Box display="flex">
      <Sidebardash />
      <Box flex="1" m="20px" ref={reportRef}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header 
            title="RAPPORTS" 
            subtitle={`Analyse temporelle (${row_count} enregistrements)`} 
          />
          <Button
            onClick={downloadPDF}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Télécharger le rapport
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
          {/* Timeline Chart */}
          <Box gridColumn="span 12" bgcolor={colors.primary[400]} p={2} borderRadius="16px">
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Évolution temporelle
            </Typography>
            <Box height="500px">
              <TimelineChart data={data} />
            </Box>
          </Box>

          {/* Data Summary */}
          <Box gridColumn="span 12" bgcolor={colors.primary[400]} p={2} borderRadius="16px">
            <Typography variant="h5" color={colors.grey[100]} mb={2}>
              Résumé des données
            </Typography>
            <Box>
              <Typography variant="body1" color={colors.grey[100]} mb={1}>
                <strong>Nombre d'enregistrements :</strong> {row_count}
              </Typography>
              <Typography variant="body1" color={colors.grey[100]} mb={1}>
                <strong>Colonnes :</strong> {columns.join(", ")}
              </Typography>
              <Typography variant="body1" color={colors.grey[100]}>
                <strong>Colonnes numériques :</strong> {numeric_columns.join(", ")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;