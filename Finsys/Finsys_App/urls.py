from django.urls import path
from Finsys_App.views import *

urlpatterns = [
    path("companyReg_action/", Fin_companyReg_action, name="Fin_companyReg_action"),
]
