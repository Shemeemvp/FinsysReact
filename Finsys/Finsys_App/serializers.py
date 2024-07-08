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

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        
class EmployeeBloodgroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Blood_Group
        fields = '__all__'
        
class EmployeeHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_History
        fields = '__all__'

class EmployeeCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee_Comment
        fields = '__all__'

# Stock Adjustment
class StockAdjustSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_Adjustment
        fields = '__all__'

class StockAdjustCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_Adjustment_Comment
        fields = '__all__'

class StockAdjustItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_Adjustment_Items
        fields = '__all__'

class StockReasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock_Reason
        fields = '__all__'

# Sales Order
class SalesOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Sales_Order
        fields = '__all__'

class SalesOrderCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Sales_Order_Comments
        fields = '__all__'

class SalesOrderItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Sales_Order_Items
        fields = '__all__'

#Vendor
class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Vendor
        fields = '__all__'

class VendorHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Vendor_History
        fields = '__all__'

class VendorCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Vendor_Comments
        fields = '__all__'
        
#End
#Bankholder
class BankHolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_BankHolder
        fields = '__all__'

class BankHolderCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_BankHolderComment
        fields = '__all__'
#End

# Invoice
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Invoice
        fields = '__all__'

class InvoiceCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Invoice_Comments
        fields = '__all__'

# Delivery Challan
class DeliveryChallanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Delivery_Challan
        fields = '__all__'

class DeliveryChallanCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Delivery_Challan_Comments
        fields = '__all__'

# Estimate
class FinEstimateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Estimate
        fields = '__all__'
        
class FinEstimateCommentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Estimate_Comments
        fields = '__all__'
        
class FinEstimateItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Estimate_Items
        fields = '__all__'

#End

# Rec. Invoice
class RecInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Recurring_Invoice
        fields = '__all__'

class RecInvoiceCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Recurring_Invoice_Comments
        fields = '__all__'

class RepeatEverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_CompanyRepeatEvery
        fields = '__all__'

# Ret. Invoice
class RetInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Retainer_Invoice
        fields = '__all__'

class RetInvoiceCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fin_Retainer_Invoice_Comments
        fields = '__all__'