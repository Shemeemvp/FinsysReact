import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from './components/Index';
import CompanyReg from './components/company/CompanyReg';
import CompanyReg2 from './components/company/CompanyReg2';
import Modules from './components/company/Modules';
import DistributorReg from './components/distributor/DistributorReg';
import DistributorReg2 from './components/distributor/DistributorReg2';
import StaffReg from './components/staff/StaffReg';
import StaffReg2 from './components/staff/StaffReg2';
import AdminHome from './components/admin/AdminHome';
import Distributors from './components/admin/Distributors';
import AdminPrivateRoutes from './components/routes/AdminPrivateRoutes';
import DistributorsReq from './components/admin/DistributorsReq';
import AllDistributors from './components/admin/AllDistributors';
import DistributorReqOverview from './components/admin/DistributorReqOverview';
import AllDistributorsOverview from './components/admin/AllDistributorsOverview';
import Clients from './components/admin/Clients';
import ClientsReq from './components/admin/ClientsReq';
import AllClients from './components/admin/AllClients';
import ClientReqOverview from './components/admin/ClientReqOverview';
import AllClientsOverview from './components/admin/AllClientsOverview';
import PaymentTerms from './components/admin/PaymentTerms';
import DistributorPrivateRoutes from './components/routes/DistributorPrivateRoutes';
import DistributorHome from './components/distributor/DistributorHome';
import DClientReq from './components/distributor/DClientReq';
import DClientReqOverview from './components/distributor/DClientReqOverview';
import DAllClients from './components/distributor/DAllClients';
import DClientOverview from './components/distributor/DClientOverview';
import CompanyHome from './components/company/CompanyHome';
import CompanyPrivateRoutes from './components/routes/CompanyPrivateRoutes';
import StaffReq from './components/company/StaffReq';
import AllStaffs from './components/company/AllStaffs';

function App() {
  return (
  <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/company_registration" element={<CompanyReg />}></Route>
          <Route path="/Company_Registration2" element={<CompanyReg2 />}></Route>
          <Route path="/modules_list" element={<Modules />}></Route>

          <Route path="/distributor_registration" element={<DistributorReg />}></Route>
          <Route path="/distributor_registration2" element={<DistributorReg2 />}></Route>
          
          <Route path="/staff_registration" element={<StaffReg />}></Route>
          <Route path="/staff_registration2" element={<StaffReg2 />}></Route>
          
          <Route element={<AdminPrivateRoutes />}>
            <Route path="/admin_home" element={<AdminHome />}></Route>
            <Route path="/payment_terms" element={<PaymentTerms />}></Route>
            <Route path="/distributors" element={<Distributors />}></Route>
            <Route path="/clients" element={<Clients />}></Route>
            <Route path="/all_distributors" element={<AllDistributors />}></Route>
            <Route path="/distributors_requests" element={<DistributorsReq />}></Route>
            <Route path="/distributors_request_overview/:id/" element={<DistributorReqOverview />}></Route>
            <Route path="/all_distributors_overview/:id/" element={<AllDistributorsOverview />}></Route>
            <Route path="/clients_requests" element={<ClientsReq />}></Route>
            <Route path="/all_clients" element={<AllClients />}></Route>
            <Route path="/client_request_overview/:id/" element={<ClientReqOverview />}></Route>
            <Route path="/all_clients_overview/:id/" element={<AllClientsOverview />}></Route>
          </Route>
          <Route element={<DistributorPrivateRoutes />}>
            <Route path="/distributor_home" element={<DistributorHome />}></Route>
            <Route path="/DClient_req" element={<DClientReq />}></Route>
            <Route path="/DClients" element={<DAllClients />}></Route>
            <Route path="/DClient_request_overview/:id/" element={<DClientReqOverview />}></Route>
            <Route path="/DClient_overview/:id/" element={<DClientOverview />}></Route>
          </Route>

          <Route element={<CompanyPrivateRoutes />}>
            <Route path="/company_home" element={<CompanyHome />}></Route>
            <Route path="/staff_requests" element={<StaffReq />}></Route>
            <Route path="/all_staffs" element={<AllStaffs />}></Route>
          </Route>

        </Routes>
      </BrowserRouter>
  </>
  )
}

export default App;
