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

class StaffDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Staff_Details
        fields = '__all__'

class ModulesListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Modules_List
        fields = '__all__'

class PaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Payment_Terms
        fields = '__all__'

class CNotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_CNotification
        fields = '__all__'

class ANotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_ANotification
        fields = '__all__'

class DNotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_DNotification
        fields = '__all__'

class ItemUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Units
        fields = '__all__'

class AccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Chart_Of_Account
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Items
        fields = '__all__'

class ItemHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Items_Transaction_History
        fields = '__all__'

class ItemCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Items_Comments
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Customers
        fields = '__all__'

class CustomerHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Customers_History
        fields = '__all__'

class CustomerCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Customers_Comments
        fields = '__all__'

class CompanyPaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Company_Payment_Terms
        fields = '__all__'

class PriceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Price_List
        fields = '__all__'

class PriceListCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_PriceList_Comments
        fields = '__all__'

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Banking
        fields = '__all__'

class BankCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_BankingComments
        fields = '__all__'

class BankTransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_BankTransactions
        fields = '__all__'

class BankAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_BankingAttachments
        fields = '__all__'