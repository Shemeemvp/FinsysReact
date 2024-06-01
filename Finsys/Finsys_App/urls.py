from django.urls import path
from Finsys_App.views import *

urlpatterns = [
    path("companyReg_action/", Fin_companyReg_action, name="Fin_companyReg_action"),
    path('CompanyReg2_action2/',Fin_CompanyReg2_action2,name='Fin_CompanyReg2_action2'),
    path('Add_Modules/',Fin_Add_Modules,name='Fin_Add_Modules'),
    path('Distributor_Registration_Action/',Fin_DReg_Action,name='Fin_DReg_Action'),
    path('get_payment_terms/',Fin_getPaymentTerms,name='Fin_get_payment_terms'),


]
