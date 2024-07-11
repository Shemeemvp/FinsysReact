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
import Employee from './components/company/employee/employee';
import AddEmployee from './components/company/employee/addemployee';
import Employeeoverview from './components/company/employee/employeeoverview';
import EmployeeHistory from './components/company/employee/employeehistory';
import EditEmployee from './components/company/employee/editemployee';
import StockAdjustment from './components/company/stockadjust/StockAdjustment';
import AddStockAdjust from './components/company/stockadjust/AddStockAdjust';
import ViewStockAdjust from './components/company/stockadjust/ViewStockAdjust';
import StockAdjustHistory from './components/company/stockadjust/StockAdjustHistory';
import EditStockAdjust from './components/company/stockadjust/EditStockAdjust';
import SalesOrder from './components/company/salesorder/SalesOrder';
import AddSalesOrder from './components/company/salesorder/AddSalesOrder';
import ViewSalesOrder from './components/company/salesorder/ViewSalesOrder';
import SalesOrderHistory from './components/company/salesorder/SalesOrderHistory';
import EditSalesOrder from './components/company/salesorder/EditSalesOrder';
import Vendors from './components/company/vendors/Allvendors';
import Addvendor from './components/company/vendors/Addvendor';
import View_vendor from './components/company/vendors/view_vendor';
import Edit_vendor from './components/company/vendors/Edit_vendor';
import Vendorhistory from './components/company/vendors/vendorhistory';
import Banklist from './components/company/bankholders/banklist';
import Addbankholder from './components/company/bankholders/add_bankholder';
import Viewholder from './components/company/bankholders/viewholder';
import BankHistory from './components/company/bankholders/bankhistory';
import Editholder from './components/company/bankholders/editholder';
import Invoice from './components/company/invoice/Invoice';
import AddInvoice from './components/company/invoice/AddInvoice';
import ViewInvoice from './components/company/invoice/ViewInvoice';
import InvoiceHistory from './components/company/invoice/InvoiceHistory';
import EditInvoice from './components/company/invoice/EditInvoice';
import DeliveryChallan from './components/company/deliverychallan/DeliveryChallan';
import AddDeliveryChallan from './components/company/deliverychallan/AddDeliveryChallan';
import ViewChallan from './components/company/deliverychallan/ViewChallan';
import ChallanHistory from './components/company/deliverychallan/ChallanHistory';
import EditDeliveryChallan from './components/company/deliverychallan/EditDeliveryChallan';
import ConvertChallanToInvoice from './components/company/deliverychallan/ConvertChallanToInvoice';
import Estimate from './components/company/estimate/Estimate';
import AddEstimate from './components/company/estimate/AddEstimate';
import ViewEstimate from './components/company/estimate/ViewEstimate';
import EstimateHistory from './components/company/estimate/EstimateHistory';
import EditEstimate from './components/company/estimate/EditEstimate';
import RecInvoice from './components/company/recurringinvoice/RecInvoice';
import AddRecInvoice from './components/company/recurringinvoice/AddRecInvoice';
import ViewRecInvoice from './components/company/recurringinvoice/ViewRecInvoice';
import RecInvoiceHistory from './components/company/recurringinvoice/RecInvoiceHistory';
import EditRecInvoice from './components/company/recurringinvoice/EditRecInvoice';
import RetInvoice from './components/company/retainerinvoice/RetInvoice';
import AddRetInvoice from './components/company/retainerinvoice/AddRetInvoice';
import ViewRetInvoice from './components/company/retainerinvoice/ViewRetInvoice';
import RetInvoiceHistory from './components/company/retainerinvoice/RetInvoiceHistory';
import EditRetInvoice from './components/company/retainerinvoice/EditRetInvoice';
import CreditNote from './components/company/creditnote/CreditNote';
import AddCreditNote from './components/company/creditnote/AddCreditNote';
import ViewCreditNote from './components/company/creditnote/ViewCreditNote';
import CreditNoteHistory from './components/company/creditnote/CreditNoteHistory';
import EditCreditNote from './components/company/creditnote/EditCreditNote';
import ConvertSalesOrderToInvoice from './components/company/salesorder/ConvertSalesOrderToInvoice';
import ConvertEstimateToInvoice from './components/company/estimate/ConvertEstimateToInvoice';
import ConvertEstimateToRecInvoice from './components/company/estimate/ConvertEstimateToRecInvoice';
import ConvertChallanToRecInvoice from './components/company/deliverychallan/ConvertChallanToRecInvoice';
import ConvertSalesOrderToRecInvoice from './components/company/salesorder/ConvertSalesOrderToRecInvoice';
import ConvertEstimateToSalesOrder from './components/company/estimate/ConvertEstimateToSalesOrder';
import PaymentReceived from './components/company/paymentreceived/PaymentReceived';
import AddPaymentReceived from './components/company/paymentreceived/AddPaymentReceived';
import ViewPayment from './components/company/paymentreceived/ViewPayment';
import PaymentHistory from './components/company/paymentreceived/PaymentHistory';
import EditPaymentReceived from './components/company/paymentreceived/EditPaymentReceived';
import RecBill from './components/company/recurringbill/RecBill';
import AddRecBill from './components/company/recurringbill/AddRecBill';
import ViewRecBill from './components/company/recurringbill/ViewRecBill';
import RecBillHistory from './components/company/recurringbill/RecBillHistory';
import EditRecBill from './components/company/recurringbill/EditRecBill';
import Expense from './components/company/expense/Expense';
import AddExpense from './components/company/expense/AddExpense';


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

            {/* Employee */}
            <Route path="/employee" element={<Employee />}></Route>
            <Route path="/add_employee" element={<AddEmployee />}></Route>
            <Route path="/employeeoverview/:itemId/" element={<Employeeoverview />}></Route>
            <Route path="/employee_history/:itemId/" element={<EmployeeHistory />}></Route>
            <Route path="/edit_employee/:itemId/" element={<EditEmployee />}></Route>

            {/* Stock Adjustment */}
            <Route path="/stock_adjust" element={<StockAdjustment />}></Route>
            <Route path="/add_stock_adjust" element={<AddStockAdjust />}></Route>
            <Route path="/view_stock_adjust/:stockId/" element={<ViewStockAdjust />}></Route>
            <Route path="/stock_adjust_history/:stockId/" element={<StockAdjustHistory />}></Route>
            <Route path="/edit_stock_adjust/:stockId/" element={<EditStockAdjust />}></Route>

            {/* Sales Order */}
            <Route path="/sales_order" element={<SalesOrder />}></Route>
            <Route path="/add_sales_order" element={<AddSalesOrder />}></Route>
            <Route path="/view_sales_order/:salesId/" element={<ViewSalesOrder />}></Route>
            <Route path="/sales_order_history/:salesId/" element={<SalesOrderHistory />}></Route>
            <Route path="/edit_sales_order/:salesId/" element={<EditSalesOrder />}></Route>
            <Route path="/convert_sales_order_to_invoice/:salesId/" element={<ConvertSalesOrderToInvoice />}></Route>
            <Route path="/convert_sales_order_to_rec_invoice/:salesId/" element={<ConvertSalesOrderToRecInvoice />}></Route>

            {/* Vendors */}
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/add_vendor" element={<Addvendor/>} />
            <Route path="/view_vendor/:id/" element={<View_vendor />} />
            <Route path="/edit_vendor/:id/" element={<Edit_vendor />} />
            <Route path="/vendor_history/:id/" element={<Vendorhistory />} />

            {/* Bank holders */}
            <Route path="/banklist" element={<Banklist />}></Route>
            <Route path="/add_bankholder" element={<Addbankholder />}></Route>
            <Route path="/viewholder/:holderId/" element={<Viewholder />}></Route>
            <Route path="/bankhistory/:holderId/" element={<BankHistory />}></Route>
            <Route path="/editholder/:holderId/" element={<Editholder />}></Route>

            {/* Invoice */}
            <Route path="/invoice" element={<Invoice />}></Route>
            <Route path="/add_invoice" element={<AddInvoice />}></Route>
            <Route path="/view_invoice/:invoiceId/" element={<ViewInvoice />}></Route>
            <Route path="/invoice_history/:invoiceId/" element={<InvoiceHistory />}></Route>
            <Route path="/edit_invoice/:invoiceId/" element={<EditInvoice />}></Route>
            
            {/* Delivery Challan */}
            <Route path="/delivery_challan" element={<DeliveryChallan />}></Route>
            <Route path="/add_delivery_challan" element={<AddDeliveryChallan />}></Route>
            <Route path="/view_delivery_challan/:challanId/" element={<ViewChallan />}></Route>
            <Route path="/delivery_challan_history/:challanId/" element={<ChallanHistory />}></Route>
            <Route path="/edit_delivery_challan/:challanId/" element={<EditDeliveryChallan />}></Route>
            <Route path="/convert_challan_to_invoice/:challanId/" element={<ConvertChallanToInvoice />}></Route>
            <Route path="/convert_challan_to_rec_invoice/:challanId/" element={<ConvertChallanToRecInvoice />}></Route>

            {/* Estimate */}
            <Route path="/Estimate" element={<Estimate />}></Route>
            <Route path="/AddEstimate" element={<AddEstimate />}></Route>
            <Route path="/ViewEstimate/:estimateId/" element={<ViewEstimate />}></Route>
            <Route path="/EstimateHistory/:estimateId/" element={<EstimateHistory />}></Route>
            <Route path="/EditEstimate/:estimateId/" element={<EditEstimate />}></Route>
            <Route path="/convert_estimate_to_sales_order/:estimateId/" element={<ConvertEstimateToSalesOrder />}></Route>
            <Route path="/convert_estimate_to_invoice/:estimateId/" element={<ConvertEstimateToInvoice />}></Route>
            <Route path="/convert_estimate_to_rec_invoice/:estimateId/" element={<ConvertEstimateToRecInvoice />}></Route>

            {/* Recurring Invoice */}
            <Route path="/rec_invoice" element={<RecInvoice />}></Route>
            <Route path="/add_rec_invoice" element={<AddRecInvoice />}></Route>
            <Route path="/view_rec_invoice/:invoiceId/" element={<ViewRecInvoice />}></Route>
            <Route path="/rec_invoice_history/:invoiceId/" element={<RecInvoiceHistory />}></Route>
            <Route path="/edit_rec_invoice/:invoiceId/" element={<EditRecInvoice />}></Route>

            {/* Retainer Invoice */}
            <Route path="/ret_invoice" element={<RetInvoice />}></Route>
            <Route path="/add_ret_invoice" element={<AddRetInvoice />}></Route>
            <Route path="/view_ret_invoice/:invoiceId/" element={<ViewRetInvoice />}></Route>
            <Route path="/ret_invoice_history/:invoiceId/" element={<RetInvoiceHistory />}></Route>
            <Route path="/edit_ret_invoice/:invoiceId/" element={<EditRetInvoice />}></Route>
            
            {/* Credit Note */}
            <Route path="/credit_note" element={<CreditNote />}></Route>
            <Route path="/add_credit_note" element={<AddCreditNote />}></Route>
            <Route path="/view_credit_note/:creditNoteId/" element={<ViewCreditNote />}></Route>
            <Route path="/credit_note_history/:creditNoteId/" element={<CreditNoteHistory />}></Route>
            <Route path="/edit_credit_note/:creditNoteId/" element={<EditCreditNote />}></Route>

            {/* Payment Received */}
            <Route path="/payment_received" element={<PaymentReceived />}></Route>
            <Route path="/add_payment" element={<AddPaymentReceived />}></Route>
            <Route path="/view_payment_received/:paymentId/" element={<ViewPayment />}></Route>
            <Route path="/payment_received_history/:paymentId/" element={<PaymentHistory />}></Route>
            <Route path="/edit_payment_received/:paymentId/" element={<EditPaymentReceived />}></Route>

            {/* Recurring Bills */}
            <Route path="/rec_bill" element={<RecBill />}></Route>
            <Route path="/add_rec_bill" element={<AddRecBill />}></Route>
            <Route path="/view_rec_bill/:billId/" element={<ViewRecBill />}></Route>
            <Route path="/rec_bill_history/:billId/" element={<RecBillHistory />}></Route>
            <Route path="/edit_rec_bill/:billId/" element={<EditRecBill />}></Route>

            {/* Expense */}
            <Route path="/expense" element={<Expense />}></Route>
            <Route path="/add_expense" element={<AddExpense />}></Route>
            {/* <Route path="/view_expense/:expenseId/" element={<ViewExpense />}></Route> */}
            {/* <Route path="/expense_history/:expenseId/" element={<ExpenseHistory />}></Route> */}
            {/* <Route path="/edit_expense/:expenseId/" element={<EditExpense />}></Route> */}

          </Route>
        </Routes>
      </BrowserRouter>
  </>
  )
}

export default App;