import React, { useEffect, useState } from "react";
import axiosInstance from "../scenes/api/axiosInstance";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/user.png";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function LogTable() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, searchText, selectedDate]);

  const fetchLogs = async () => {
    try {
      const res = await axiosInstance.get("/admin/logs");
      setLogs(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des logs :", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = logs;

    if (searchText) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.user_email.toLowerCase().includes(lower) ||
          log.action.toLowerCase().includes(lower)
      );
    }

    if (selectedDate) {
      const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      filtered = filtered.filter((log) =>
        log.timestamp.startsWith(dateStr)
      );
    }

    setFilteredLogs(filtered);
  };

  const logColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "user_email", headerName: "Utilisateur", flex: 1 },
    { field: "action", headerName: "Action", flex: 2 },
    {
      field: "timestamp",
      headerName: "Horodatage",
      flex: 1.5,
      valueGetter: (params) =>
        new Date(params.value).toLocaleString("fr-FR"),
    },
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = Logo;

    // Important : il faut attendre que l’image soit chargée avant d’ajouter sinon risque que logo n’apparaisse pas.
    logoImg.onload = () => {
      doc.addImage(logoImg, "PNG", 10, 10, 30, 30);
      doc.setFontSize(18);
      doc.text("Rapport des logs - DataDASH", 50, 20);
      doc.setFontSize(12);
      doc.text(
        `Date de génération : ${new Date().toLocaleString("fr-FR")}`,
        50,
        30
      );

      autoTable(doc, {
        startY: 45,
        head: [["ID", "Utilisateur", "Action", "Horodatage"]],
        body: filteredLogs.map((log) => [
          log.id,
          log.user_email,
          log.action,
          new Date(log.timestamp).toLocaleString("fr-FR"),
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 45 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Page ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      doc.save("logs_datadash.pdf");
    };
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Historique des actions
      </Typography>

      <Stack direction="row" spacing={2} mb={2} alignItems="center">
        <TextField
          label="Rechercher..."
          variant="outlined"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Filtrer par date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{ textField: { variant: "outlined" } }}
          />
        </LocalizationProvider>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchText("");
            setSelectedDate(null);
          }}
        >
          Réinitialiser
        </Button>
        <CSVLink
          data={filteredLogs}
          filename="logs_datadash.csv"
          className="MuiButton-root MuiButton-contained"
        >
          <Button variant="contained" color="primary">
            Exporter CSV
          </Button>
        </CSVLink>
        <Button variant="outlined" color="secondary" onClick={exportPDF}>
          Exporter PDF
        </Button>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={filteredLogs}
          columns={logColumns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          getRowId={(row) => row.id}
        />
      )}
    </Box>
  );
}
