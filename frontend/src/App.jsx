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
import CompanyProfile from './components/company/CompanyProfile';
import CompanyStaffPrivateRoutes from './components/routes/CompanyStaffPrivateRoutes';
import EditCompanyProfile from './components/company/EditCompanyProfile';
import EditStaffProfile from './components/staff/EditStaffProfile';
import DistributorProfile from './components/distributor/DistributorProfile';
import DistributorProfileEdit from './components/distributor/DistributorProfileEdit';
import EditModules from './components/company/EditModules';
import AdminNotifications from './components/admin/AdminNotifications';
import Wrong from './components/company/Wrong';
import NotificationOverview from './components/admin/NotificationOverview';
import DistNotifications from './components/distributor/DistNotifications';
import DistNotificationOverview from './components/distributor/DistNotificationOverview';
import Items from './components/company/items/Items';
import AddItem from './components/company/items/AddItem';
import ViewItem from './components/company/items/ViewItem';
import ItemHistory from './components/company/items/ItemHistory';
import EditItem from './components/company/items/EditItem';
import Customers from './components/company/customers/Customers';
import AddCustomer from './components/company/customers/AddCustomer';
import ViewCustomer from './components/company/customers/ViewCustomer';
import CustomerHistory from './components/company/customers/CustomerHistory';
import EditCustomer from './components/company/customers/EditCustomer';
import PriceList from './components/company/pricelist/PriceList';
import AddPriceList from './components/company/pricelist/AddPriceList';
import ViewPriceList from './components/company/pricelist/ViewPriceList';
import PriceListHistory from './components/company/pricelist/PriceListHistory';
import EditPriceList from './components/company/pricelist/EditPriceList';
import ChartOfAccounts from './components/company/chartofaccounts/ChartOfAccounts';
import AddAccount from './components/company/chartofaccounts/AddAccount';
import ViewAccount from './components/company/chartofaccounts/ViewAccount';
import AccountHistory from './components/company/chartofaccounts/AccountHistory';
import EditAccount from './components/company/chartofaccounts/EditAccount';
import Banking from './components/company/banking/Banking';
import AddBank from './components/company/banking/AddBank';
import ViewBank from './components/company/banking/ViewBank';
import BankTransactionHistory from './components/company/banking/BankTransactionHistory';
import EditBank from './components/company/banking/EditBank';
import BankToCash from './components/company/banking/BankToCash';
import CashToBank from './components/company/banking/CashToBank';
import BankToBank from './components/company/banking/BankToBank';
import BankAdjust from './components/company/banking/BankAdjust';
import EditTransactions from './components/company/banking/EditTransactions';
import StockAdjustment from './components/company/stockadjust/StockAdjustment';
import AddStockAdjust from './components/company/stockadjust/AddStockAdjust';
import ViewStockAdjust from './components/company/stockadjust/ViewStockAdjust';
import StockAdjustHistory from './components/company/stockadjust/StockAdjustHistory';

function App() {
  return (
  <>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}></Route>
          <Route path="/company_registration" element={<CompanyReg />}></Route>
          <Route path="/Company_Registration2" element={<CompanyReg2 />}></Route>
          <Route path="/modules_list" element={<Modules />}></Route>
          <Route path="/wrong" element={<Wrong />}></Route>

          <Route path="/distributor_registration" element={<DistributorReg />}></Route>
          <Route path="/distributor_registration2" element={<DistributorReg2 />}></Route>
          
          <Route path="/staff_registration" element={<StaffReg />}></Route>
          <Route path="/staff_registration2" element={<StaffReg2 />}></Route>
          
          <Route element={<AdminPrivateRoutes />}>
            <Route path="/admin_home" element={<AdminHome />}></Route>
            <Route path="/admin_notifications" element={<AdminNotifications />}></Route>
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
            <Route path="/anotification_overview/:id/" element={<NotificationOverview />}></Route>
          </Route>
          <Route element={<DistributorPrivateRoutes />}>
            <Route path="/distributor_home" element={<DistributorHome />}></Route>
            <Route path="/distributor_notifications" element={<DistNotifications />}></Route>
            <Route path="/distributor_profile" element={<DistributorProfile />}></Route>
            <Route path="/edit_distributor_profile" element={<DistributorProfileEdit />}></Route>
            <Route path="/DClient_req" element={<DClientReq />}></Route>
            <Route path="/DClients" element={<DAllClients />}></Route>
            <Route path="/DClient_request_overview/:id/" element={<DClientReqOverview />}></Route>
            <Route path="/DClient_overview/:id/" element={<DClientOverview />}></Route>
            <Route path="/dnotification_overview/:id/" element={<DistNotificationOverview />}></Route>
          </Route>

          <Route element={<CompanyPrivateRoutes />}>
            <Route path="/staff_requests" element={<StaffReq />}></Route>
            <Route path="/all_staffs" element={<AllStaffs />}></Route>
            <Route path="/edit_company_profile" element={<EditCompanyProfile />}></Route>
            <Route path="/edit_modules" element={<EditModules />}></Route>
          </Route>

          <Route element={<CompanyStaffPrivateRoutes />}>
            <Route path="/company_home" element={<CompanyHome />}></Route>
            <Route path="/company_profile" element={<CompanyProfile />}></Route>
            <Route path="/edit_staff_profile" element={<EditStaffProfile />}></Route>

            {/* Items */}
            <Route path="/items" element={<Items />}></Route>
            <Route path="/add_item" element={<AddItem />}></Route>
            <Route path="/view_item/:itemId/" element={<ViewItem />}></Route>
            <Route path="/item_history/:itemId/" element={<ItemHistory />}></Route>
            <Route path="/edit_item/:itemId/" element={<EditItem />}></Route>

            {/* Customers */}
            <Route path="/customers" element={<Customers />}></Route>
            <Route path="/add_customer" element={<AddCustomer />}></Route>
            <Route path="/view_customer/:customerId/" element={<ViewCustomer />}></Route>
            <Route path="/customer_history/:customerId/" element={<CustomerHistory />}></Route>
            <Route path="/edit_customer/:customerId/" element={<EditCustomer />}></Route>

            {/* Price List */}
            <Route path="/price_list" element={<PriceList />}></Route>
            <Route path="/add_price_list" element={<AddPriceList />}></Route>
            <Route path="/view_price_list/:priceListId/" element={<ViewPriceList />}></Route>
            <Route path="/price_list_history/:priceListId/" element={<PriceListHistory />}></Route>
            <Route path="/edit_price_list/:priceListId/" element={<EditPriceList />}></Route>

            {/* Chart of Accounts */}
            <Route path="/chart_of_accounts" element={<ChartOfAccounts />}></Route>
            <Route path="/add_account" element={<AddAccount />}></Route>
            <Route path="/view_account/:accountId/" element={<ViewAccount />}></Route>
            <Route path="/account_history/:accountId/" element={<AccountHistory />}></Route>
            <Route path="/edit_account/:accountId/" element={<EditAccount />}></Route>

            {/* Banking */}
            <Route path="/banking" element={<Banking />}></Route>
            <Route path="/add_bank" element={<AddBank />}></Route>
            <Route path="/view_bank/:bankId/" element={<ViewBank />}></Route>
            <Route path="/bank_transaction_history/:transactionId/" element={<BankTransactionHistory />}></Route>
            <Route path="/edit_bank/:bankId/" element={<EditBank />}></Route>
            <Route path="/edit_transaction/:transId/" element={<EditTransactions />}></Route>
            <Route path="/bank_to_cash/:bankId/" element={<BankToCash />}></Route>
            <Route path="/cash_to_bank/:bankId/" element={<CashToBank />}></Route>
            <Route path="/bank_to_bank/:bankId/" element={<BankToBank />}></Route>
            <Route path="/bank_adjust/:bankId/" element={<BankAdjust />}></Route>

            {/* Stock Adjustment */}
            <Route path="/stock_adjust" element={<StockAdjustment />}></Route>
            <Route path="/add_stock_adjust" element={<AddStockAdjust />}></Route>
            <Route path="/view_stock_adjust/:stockId/" element={<ViewStockAdjust />}></Route>
            <Route path="/stock_adjust_history/:stockId/" element={<StockAdjustHistory />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
  </>
  )
}

export default App;
