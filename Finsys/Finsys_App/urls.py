from django.urls import path
from Finsys_App.views import *

urlpatterns = [
    path("companyReg_action/", Fin_companyReg_action, name="Fin_companyReg_action"),
    path('CompanyReg2_action2/',Fin_CompanyReg2_action2,name='Fin_CompanyReg2_action2'),
    path('Add_Modules/',Fin_Add_Modules,name='Fin_Add_Modules'),
    path('Distributor_Registration_Action/',Fin_DReg_Action,name='Fin_DReg_Action'),
    path('get_payment_terms/',Fin_getPaymentTerms,name='Fin_get_payment_terms'),
    path('get_distributor_data/<int:id>/',Fin_getDistributorData,name='Fin_get_distributor_data'),
    path('Distributor_Registration_Action2/',Fin_DReg2_Action2,name='Fin_DReg2_Action2'),
    path('Fin_staffReg_action/',Fin_staffReg_action,name='Fin_staffReg_action'),
    path('get_staff_data/<int:id>/',Fin_getStaffData,name='Fin_get_staff_data'),
    path('StaffReg2_Action/',Fin_StaffReg2_Action,name='Fin_StaffReg2_Action'),

    path('LogIn/',Fin_login,name='Fin_login'),
    path('add_payment_terms/',Fin_add_payment_terms,name='Fin_add_payment_terms'),
    path('delete_payment_term/<int:id>/',Fin_delete_payment_terms,name='Fin_delete_payment_terms'),
    path('get_distributors_requests/',Fin_getDistributorsRequests, name='Fin_getDistributorsRequests'),
    path('get_distributors/',Fin_getDistributors, name='Fin_getDistributors'),
    path('DReq_Accept/<int:id>/',Fin_DReq_Accept,name='Fin_DReq_Accept'),
    path('DReq_Reject/<int:id>/',Fin_DReq_Reject,name='Fin_DReq_Reject'),
    path('get_distributors_overview_data/<int:id>/',Fin_getDistributorsOverviewData, name='Fin_getDistributorsOverviewData'),
    path('get_clients_requests/',Fin_getClientsRequests, name='Fin_getClientsRequests'),
    path('get_clients/',Fin_getClients, name='Fin_getClients'),
    path('Client_Req_Accept/<int:id>/',Fin_Client_Req_Accept,name='Fin_Client_Req_Accept'),
    path('Client_Req_Reject/<int:id>/',Fin_Client_Req_Reject,name='Fin_Client_Req_Reject'),
    path('get_clients_overview_data/<int:id>/',Fin_getClientsOverviewData, name='Fin_getClientsOverviewData'),

    path('user/<int:id>/',getSelfData),
    path('get_distributor_clients_requests/<int:id>/',Fin_DClient_req,name='Fin_DClient_req'),
    path('get_distributor_clients/<int:id>/',Fin_DClients,name='Fin_DClients'),
    path('DClient_Req_Accept/<int:id>/',Fin_DClient_Req_Accept,name='Fin_DClient_Req_Accept'),
    path('DClient_Req_Reject/<int:id>/',Fin_DClient_Req_Reject,name='Fin_DClient_Req_Reject'),
    path('get_staff_requests/<int:id>/',Fin_getStaffRequests, name='Fin_getStaffRequests'),
    path('get_all_staffs/<int:id>/',Fin_getAllStaffs, name='Fin_getAllStaffs'),
    path('Staff_Req_Accept/<int:id>/',Fin_Staff_Req_Accept,name='Fin_Staff_Req_Accept'),
    path('Staff_Req_Reject/<int:id>/',Fin_Staff_Req_Reject,name='Fin_Staff_Req_Reject'),



]
