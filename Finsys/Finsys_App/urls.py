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
    path('get_distributors_requests/',Fin_getDistributorsRequests, name='Fin_getDistributorsRequests'),
    path('DReq_Accept/<int:id>/',Fin_DReq_Accept,name='Fin_DReq_Accept'),
    path('DReq_Reject/<int:id>/',Fin_DReq_Reject,name='Fin_DReq_Reject'),
    path('get_distributors_overview_data/<int:id>/',Fin_getDistributorsOverviewData, name='Fin_get_distributors_overview_data'),



]
