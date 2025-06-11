import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { DataProvider } from './contexts/DataContext';
import {Routes, Route} from "react-router-dom";
import Header from "./scenes/global/Header";
import Home from "./scenes/home";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./scenes/auth/login";
import Register from "./scenes/auth/register";
import AdminPanel from "./scenes/admin";
import Dashboard from "./scenes/dashboard";
import Charts from "./scenes/charts";
import Reports from "./scenes/reports";
import Map from "./scenes/map";
import ExportPage from "./scenes/exportation";
import ImportData from "./scenes/importation";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Calendar from "./scenes/calendar";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Geography from "./scenes/geography";



function App() {
  const [theme, colorMode]= useMode();

  return (
    <DataProvider>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <div className="app">
        
          <main className="content">
          <Header/>
          <Routes> 
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/importation" element={<ImportData/> }/>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

           <Route path="/dashboard"  element={
              <ProtectedRoute>
               <Dashboard/>
             </ProtectedRoute>
            } />
            <Route path="/charts" element={<Charts/> }/>

           <Route path="/reports" element={<Reports/> }/>
           <Route path="/map" element={<Map/> }/>
           <Route path="/invoices" element={<Invoices/> }/>
           <Route path="/form" element={<Form/> }/>
           <Route path="/calendar" element={<Calendar/> }/>
           <Route path="/faq" element={<FAQ/> }/> 
           <Route path="/bar" element={<Bar/> }/>
           <Route path="/pie" element={<Pie/> }/>
           <Route path="/line" element={<Line/> }/> 
           <Route path="/geography" element={<Geography/> }/>
            
            {/* Route admin (protégée + adminOnly) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
          </main>
        </div>
     </ThemeProvider>
    </ColorModeContext.Provider>
    </DataProvider>
  );
}

export default App;
