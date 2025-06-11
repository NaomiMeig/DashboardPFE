import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import {
  Delete,
  Edit,
  Refresh,
  PersonAdd,
  LockReset,
  People,
  AdminPanelSettings,
  ListAlt,
  Search,
} from "@mui/icons-material";
import Sidebardash from "../../components/Sidebardash";
import LogTable from "../../components/LogTable";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsCount, setLogsCount] = useState(0);
  const [search, setSearch] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUser, setEditUser] = useState({
    id: "",
    email: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchData();
    fetchLogStats();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/users");
      const validUsers = (res.data || []).filter((user) => user.id || user._id);
      setUsers(validUsers);
    } catch (err) {
      console.error("Erreur fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogStats = async () => {
    try {
      const res = await axiosInstance.get("/admin/logs/today-count");
      setLogsCount(res.data.count || 0);
    } catch (err) {
      console.error("Erreur fetch logs:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      fetchData();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId || u._id === userId);
    if (user) {
      setEditUser({
        id: user.id || user._id,
        email: user.email,
        password: "",
        role: user.role || "user",
      });
      setOpenEditDialog(true);
    }
  };

  const handleSubmitEditUser = async () => {
    try {
      await axiosInstance.put(`/admin/users/${editUser.id}`, {
        email: editUser.email,
        password: editUser.password,
        role: editUser.role,
      });
      setOpenEditDialog(false);
      fetchData();
    } catch (err) {
      console.error("Erreur modification utilisateur:", err);
      alert(err.response?.data?.detail || "Erreur lors de la modification");
    }
  };

  const handleResetPassword = (userId) => {
    console.log("Réinitialiser MDP", userId);
  };

  const handleAddUser = () => setOpenAddDialog(true);

  const handleSubmitNewUser = async () => {
    try {
      await axiosInstance.post("/register", newUser);
      setOpenAddDialog(false);
      setNewUser({ email: "", password: "", role: "user" });
      fetchData();
    } catch (err) {
      console.error("Erreur ajout utilisateur:", err);
      alert(err.response?.data?.detail || "Erreur lors de l'ajout");
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.role || "").toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === "admin").length;

  const userColumns = [
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "role",
      headerName: "Rôle",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "admin" ? "primary" : "default"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      flex: 0.6,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Modifier"
          onClick={() => handleEditUser(params.id)}
        />,
        <GridActionsCellItem
          icon={<LockReset />}
          label="Réinitialiser MDP"
          onClick={() => handleResetPassword(params.id)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Supprimer"
          onClick={() => handleDeleteUser(params.id)}
          showInMenu
        />,
      ],
    },
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarExport />
      <IconButton onClick={fetchData}>
        <Refresh />
      </IconButton>
      <IconButton onClick={handleAddUser}>
        <PersonAdd />
      </IconButton>
    </GridToolbarContainer>
  );

  return (
    <Box display="flex">
      <Sidebardash />
      <Box flexGrow={1} p={3}>
        <Typography variant="h4" gutterBottom>
          👤 Administration
        </Typography>

        {/* Statistiques */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <People sx={{ mr: 1 }} color="primary" />
              <Typography>Total utilisateurs : {users.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <AdminPanelSettings sx={{ mr: 1 }} color="secondary" />
              <Typography>Administrateurs : {adminCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <ListAlt sx={{ mr: 1 }} color="action" />
              <Typography>Logs aujourd’hui : {logsCount}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Barre de recherche */}
        <Box mb={1} display="flex" alignItems="center" gap={2}>
          <Search />
          <TextField
            placeholder="Rechercher un utilisateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
          />
        </Box>

        {/* Tableau des utilisateurs */}
        <DataGrid
          rows={filteredUsers}
          columns={userColumns}
          loading={loading}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          components={{ Toolbar: CustomToolbar }}
          getRowId={(row) => row.id || row._id}
        />

        {/* Logs */}
        <Typography variant="h5" mt={5} gutterBottom>
          🕒 Historique des actions
        </Typography>
        <LogTable />

        {/* Dialog ajout utilisateur */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              label="Mot de passe"
              fullWidth
              margin="normal"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <TextField
              label="Rôle"
              fullWidth
              margin="normal"
              select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Annuler</Button>
            <Button onClick={handleSubmitNewUser} variant="contained">Ajouter</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog modification utilisateur */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            />
            <TextField
              label="Nouveau mot de passe (laisser vide pour ne pas changer)"
              fullWidth
              margin="normal"
              type="password"
              value={editUser.password}
              onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
            />
            <TextField
              label="Rôle"
              fullWidth
              margin="normal"
              select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            >
              <MenuItem value="user">Utilisateur</MenuItem>
              <MenuItem value="admin">Administrateur</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Annuler</Button>
            <Button onClick={handleSubmitEditUser} variant="contained">Enregistrer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
