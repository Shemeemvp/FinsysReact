from rest_framework import serializers
from Finsys_App.models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

class LoginDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Login_Details
        fields = '__all__'

class CompanyDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Company_Details
        fields = '__all__'

class DistributorDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Distributors_Details
        fields = '__all__'

class ModulesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Modules_List
        fields = '__all__'

class PaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Payment_Terms
        fields = '__all__'