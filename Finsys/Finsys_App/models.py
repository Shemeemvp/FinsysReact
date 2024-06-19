from django.db import models
from django.utils import timezone

# Create your models here.

class Fin_Payment_Terms(models.Model):
    payment_terms_number = models.IntegerField(null=True,blank=True)  
    payment_terms_value = models.CharField(max_length=100,null=True,blank=True) 
    days = models.CharField(max_length=100,null=True,blank=True) 

class Fin_Login_Details(models.Model):
    First_name = models.CharField(max_length=255,null=True,blank=True)
    Last_name = models.CharField(max_length=255,null=True,blank=True)
    User_name = models.CharField(max_length=255,null=True,blank=True)
    password = models.CharField(max_length=100,null=True,blank=True)
    User_Type = models.CharField(max_length=255,null=True,blank=True) 

class Fin_Distributors_Details(models.Model):  
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Payment_Term =  models.ForeignKey(Fin_Payment_Terms, on_delete=models.CASCADE,null=True,blank=True)
    Distributor_Code = models.CharField(max_length=100,null=True,blank=True)
    Email = models.CharField(max_length=255,null=True,blank=True) 
    Contact = models.CharField(max_length=255,null=True,blank=True)
    Image = models.ImageField(null=True,blank = True,upload_to = 'image/distributor') 
    Start_Date = models.DateField(auto_now_add=True,null=True)
    End_date = models.DateField(max_length=255,null=True,blank=True)
    Admin_approval_status = models.CharField(max_length=255,null=True,blank=True)   

class Fin_Company_Details(models.Model): 
    Payment_Term = models.ForeignKey(Fin_Payment_Terms, on_delete=models.CASCADE,null=True,blank=True)
    Distributor_id = models.ForeignKey(Fin_Distributors_Details, on_delete=models.CASCADE,null=True,blank=True)
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Company_name = models.CharField(max_length=255,null=True,blank=True)
    Business_name = models.CharField(max_length=255,null=True,blank=True)
    Industry = models.CharField(max_length=255,null=True,blank=True)
    Company_Type = models.CharField(max_length=255,null=True,blank=True)

    Company_Code = models.CharField(max_length=100,null=True,blank=True)
    Email = models.CharField(max_length=255,null=True,blank=True) 
    Contact = models.CharField(max_length=255,null=True,blank=True)
    Address = models.TextField(max_length=255,null=True,blank=True)
    City = models.CharField(max_length=255,null=True,blank=True)
    State = models.CharField(max_length=255,null=True,blank=True)
    Country = models.CharField(max_length=255,null=True,blank=True)
    Pincode = models.IntegerField(null=True,blank=True)
    Pan_NO = models.CharField(max_length=255,null=True,blank=True)
    GST_Type = models.CharField(max_length=255,null=True,blank=True)
    GST_NO = models.CharField(max_length=255,null=True,blank=True)
    Image = models.ImageField(null=True,blank = True,upload_to = 'image/company') 
    Start_Date = models.DateField(auto_now_add=True,null=True)
    End_date = models.DateField(max_length=255,null=True,blank=True)
    Payment_Type = models.CharField(max_length=255,null=True,blank=True)
    Accountant = models.CharField(max_length=255,null=True,blank=True)
    Admin_approval_status = models.CharField(max_length=255,null=True,blank=True)
    Distributor_approval_status = models.CharField(max_length=255,null=True,blank=True)
    Registration_Type = models.CharField(max_length=255,null=True,blank=True)

class Fin_Modules_List(models.Model):
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    company_id = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE,null=True,blank=True)

    # -----items-----
    Items = models.IntegerField(null=True,default=0) 
    Price_List = models.IntegerField(null=True,default=0) 
    Stock_Adjustment = models.IntegerField(null=True,default=0) 

    # --------- CASH & BANK-----
    Cash_in_hand = models.IntegerField(null=True,default=0) 
    Offline_Banking = models.IntegerField(null=True,default=0)
    Bank_Reconciliation = models.IntegerField(null=True,default=0)
    UPI = models.IntegerField(null=True,default=0)
    Bank_Holders = models.IntegerField(null=True,default=0)
    Cheque = models.IntegerField(null=True,default=0)
    Loan_Account = models.IntegerField(null=True,default=0)

    #  ------SALES MODULE -------
    Customers  = models.IntegerField(null=True,default=0)
    Invoice = models.IntegerField(null=True,default=0) 
    Estimate = models.IntegerField(null=True,default=0) 
    Sales_Order = models.IntegerField(null=True,default=0) 
    Recurring_Invoice = models.IntegerField(null=True,default=0) 
    Retainer_Invoice = models.IntegerField(null=True,default=0) 
    Credit_Note = models.IntegerField(null=True,default=0) 
    Payment_Received = models.IntegerField(null=True,default=0) 
    Delivery_Challan = models.IntegerField(null=True,default=0)

    #  ---------PURCHASE MODULE--------- 
    Vendors = models.IntegerField(null=True,default=0) 
    Bills = models.IntegerField(null=True,default=0) 
    Recurring_Bills = models.IntegerField(null=True,default=0) 
    Debit_Note = models.IntegerField(null=True,default=0) 
    Purchase_Order = models.IntegerField(null=True,default=0) 
    Expenses = models.IntegerField(null=True,default=0) 
    Recurring_Expenses = models.IntegerField(null=True,default=0) 
    Payment_Made = models.IntegerField(null=True,default=0) 

    # --------EWay_Bill-----
    EWay_Bill = models.IntegerField(null=True,default=0) 

    #  -------ACCOUNTS--------- 
    Chart_of_Accounts = models.IntegerField(null=True,default=0)  
    Manual_Journal = models.IntegerField(null=True,default=0)  
    Reconcile = models.IntegerField(null=True,default=0) 

    # -------PAYROLL------- 
    Employees = models.IntegerField(null=True,default=0) 
    Employees_Loan = models.IntegerField(null=True,default=0)  
    Holiday = models.IntegerField(null=True,default=0) 
    Attendance = models.IntegerField(null=True,default=0) 
    Salary_Details = models.IntegerField(null=True,default=0) 

    update_action = models.IntegerField(null=True,default=0) 
    status = models.CharField(max_length=100,null=True,default='New')  


class Fin_Staff_Details(models.Model):
    company_id = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE,null=True,blank=True)
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    contact = models.CharField(max_length=255,null=True,blank=True)
    Email = models.CharField(max_length=255,null=True,blank=True) 
    img = models.ImageField(null=True,blank = True,upload_to = 'image/staff')    
    Company_approval_status = models.CharField(max_length=255,null=True,blank=True)

class TrialPeriod(models.Model):
    company = models.OneToOneField(Fin_Company_Details, on_delete=models.CASCADE)
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField()
    interested_in_buying = models.IntegerField(default=0)
    feedback = models.TextField(blank=True, null=True)

    def is_active(self):
        return self.end_date >= timezone.now().date()

class Fin_Payment_Terms_updation(models.Model):
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Payment_Term = models.ForeignKey(Fin_Payment_Terms, on_delete=models.CASCADE,null=True,blank=True)
    status = models.CharField(max_length=100,null=True,default='New') 

class Fin_ANotification(models.Model): 
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Modules_List = models.ForeignKey(Fin_Modules_List, on_delete=models.CASCADE,null=True,blank=True)
    PaymentTerms_updation = models.ForeignKey(Fin_Payment_Terms_updation, on_delete=models.CASCADE,null=True,blank=True)
    
    Title = models.CharField(max_length=255,null=True,blank=True)
    Discription = models.CharField(max_length=255,null=True,blank=True) 
    Noti_date = models.DateTimeField(auto_now_add=True,null=True)
    date_created = models.DateField(auto_now_add=True,null=True)
    time=models.TimeField(auto_now_add=True,null=True)
    status = models.CharField(max_length=100,null=True,default='New')  

class Fin_DNotification(models.Model): 
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Distributor_id = models.ForeignKey(Fin_Distributors_Details, on_delete=models.CASCADE,null=True,blank=True)
    Modules_List = models.ForeignKey(Fin_Modules_List, on_delete=models.CASCADE,null=True,blank=True)
    PaymentTerms_updation = models.ForeignKey(Fin_Payment_Terms_updation, on_delete=models.CASCADE,null=True,blank=True)
    
    Title = models.CharField(max_length=255,null=True,blank=True)
    Discription = models.CharField(max_length=255,null=True,blank=True) 
    Noti_date = models.DateTimeField(auto_now_add=True,null=True)
    date_created = models.DateField(auto_now_add=True,null=True)
    time=models.TimeField(auto_now_add=True,null=True)
    status = models.CharField(max_length=100,null=True,default='New')     
   
       
class Fin_Units(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE,null=True)
    name = models.CharField(max_length=100,null=True)

class Fin_Chart_Of_Account(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE, null=True)
    account_type = models.CharField(max_length=255,null=True,blank=True)
    account_name = models.CharField(max_length=255,null=True,blank=True)
    account_code = models.CharField(max_length=255,null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    balance = models.FloatField(null=True, blank=True, default=0.0)
    balance_type = models.CharField(max_length=100,null=True,blank=True)
    credit_card_no = models.CharField(max_length=255,null=True,blank=True)
    sub_account = models.BooleanField(null=True,blank=True, default=False)
    parent_account = models.CharField(max_length=255,null=True,blank=True)
    bank_account_no = models.BigIntegerField(null=True,blank=True)
    date = models.DateField(auto_now_add=True, auto_now=False, null=True, blank=True)
    create_status=models.CharField(max_length=255,null=True,blank=True)
    status = models.CharField(max_length=255,null=True,blank=True)

class Fin_ChartOfAccount_History(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE, null=True)
    account = models.ForeignKey(Fin_Chart_Of_Account, on_delete=models.CASCADE, null=True)
    date = models.DateField(auto_now_add=True, auto_now=False, null=True)
    action_choices = [
        ('Created', 'Created'),
        ('Edited', 'Edited'),
    ]
    action = models.CharField(max_length=20, null=True, blank = True, choices=action_choices)

class Fin_Loan_Term(models.Model):
    duration= models.IntegerField(null=True,blank=True)
    term = models.CharField(max_length=255,null=True,blank=True)
    days = models.IntegerField(null=True,blank=True)
    company = models.ForeignKey(Fin_Company_Details,on_delete=models.CASCADE,null=True,blank=True)


class Fin_Company_Payment_Terms(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    term_name = models.CharField(max_length=100, null=True)
    days = models.IntegerField(null=True, default=0)


class Fin_CompanyRepeatEvery(models.Model):
    company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE,null=True,blank=True)
    repeat_every = models.CharField(max_length=100,null=True,blank=True) 
    repeat_type = models.CharField(max_length=100,null=True,blank=True) 
    duration = models.IntegerField(null=True,blank=True)
    days = models.IntegerField(null=True,blank=True)


class Fin_Eway_Transportation(models.Model):
    Company = models.ForeignKey('Fin_Company_Details', on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey('Fin_Login_Details', on_delete=models.CASCADE, null=True)
    
    Name = models.CharField(max_length=200, null= True)
    Type = models.CharField(max_length=100, null=True)


class Stock_Reason(models.Model):
    company = models.ForeignKey(Fin_Company_Details,on_delete=models.CASCADE,null=True,blank=True)
    login_details = models.ForeignKey(Fin_Login_Details,on_delete=models.CASCADE,null=True,blank=True)
    reason = models.CharField(max_length=500)

# ITEMS
class Fin_Items(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100,null=True)
    item_type = models.CharField(max_length=100,null=True)
    unit = models.CharField(max_length=100,null=True)
    hsn = models.BigIntegerField(null=True, blank = True)
    sac = models.BigIntegerField(null=True, blank = True)
    tax_reference = models.CharField(max_length=100,null=True)
    intra_state_tax = models.IntegerField(null=True, default=0)
    inter_state_tax = models.IntegerField(null=True, default=0)
    sales_account = models.CharField(max_length=100,null=True)
    selling_price = models.FloatField(null=True, default=0.0)
    sales_description = models.CharField(max_length=100,null=True,blank=True)
    purchase_account = models.CharField(max_length=100,null=True)
    purchase_price = models.FloatField(null=True, default=0.0)
    purchase_description = models.CharField(max_length=100,null=True,blank=True)
    item_created = models.DateField(auto_now_add = True, auto_now = False, null=True)
    min_stock=models.IntegerField(null=True,default=0)
    inventory_account = models.CharField(max_length=100, null=True, blank=True)
    opening_stock = models.IntegerField(null=True, blank=True,default = 0)
    current_stock = models.IntegerField(default=0,blank=True,null=True)
    stock_in = models.IntegerField(default=0,blank=True,null=True)
    stock_out = models.IntegerField(default=0,blank=True,null=True)
    stock_unit_rate= models.FloatField(default=0.0,blank=True,null=True)
    status = models.CharField(max_length=100,null=True, default='Active')


class Fin_Items_Transaction_History(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE, null=True)
    item = models.ForeignKey(Fin_Items, on_delete=models.CASCADE, null=True)
    date = models.DateField(auto_now_add=True, auto_now=False, null=True)
    action_choices = [
        ('Created', 'Created'),
        ('Edited', 'Edited'),
    ]
    action = models.CharField(max_length=20, null=True, blank = True, choices=action_choices)


class Fin_Items_Comments(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    item = models.ForeignKey(Fin_Items,on_delete=models.CASCADE,null=True,blank=True)
    comments = models.CharField(max_length=500,null=True,blank=True)


# Price List

class Fin_Price_List(models.Model):
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=255,null=True,blank=True)

    TYPE_CHOICES=(
        ('Sales','Sales'),
        ('Purchase','Purchase'),
    )

    ITEM_RATE_CHOICES=(
        ('percentage','Markup or Markdown the item rates by a percentage'),
        ('individual_rate','Enter the rate individually for each item'),
    )

    type = models.CharField(max_length=15,choices=TYPE_CHOICES,null=True,blank=True,default='Sales')
    item_rate = models.CharField(max_length=100,choices=ITEM_RATE_CHOICES,null=True,blank=True,default='percentage')
    description = models.TextField(blank=True, null=True)
    currency = models.CharField(max_length=255,null=True,blank=True,default='Indian Rupee')
    up_or_down = models.CharField(max_length=100,default='None')
    percentage = models.CharField(max_length=100,null=True,blank=True)
    round_off = models.CharField(max_length=100,default='None', null=True, blank=True)
    created_date = models.DateField(auto_now_add = True, auto_now = False, blank = True, null = True)
    status = models.CharField(max_length=15,default='Active',null=True,blank=True)

# Customers

class Fin_Customers(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=10,null=True,blank=True)
    first_name = models.CharField(max_length=100,null=True,blank=True)
    last_name = models.CharField(max_length=100,null=True,blank=True)
    company = models.CharField(max_length=100,null=True,blank=True)
    location = models.CharField(max_length=100,null=True,blank=True)
    place_of_supply = models.CharField(max_length=100,null=True,blank=True)
    gst_type = models.CharField(max_length=100, null=True)
    gstin = models.CharField(max_length=100,null=True,blank=True,default=None)
    pan_no = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True,blank=True)
    website = models.CharField(max_length=100, default='',null=True,blank=True)
    mobile = models.CharField(max_length=20,null=True,blank=True)
    price_list = models.ForeignKey(Fin_Price_List, on_delete = models.SET_NULL, null = True)
    payment_terms = models.ForeignKey(Fin_Company_Payment_Terms, on_delete = models.SET_NULL,null=True)
    billing_street = models.CharField(max_length=100,null=True,blank=True)
    billing_city = models.CharField(max_length=100,null=True,blank=True)
    billing_state = models.CharField(max_length=100,null=True,blank=True)
    billing_pincode = models.CharField(max_length=100,null=True,blank=True)
    billing_country = models.CharField(max_length=100,null=True,blank=True)
    ship_street = models.CharField(max_length=100,null=True,blank=True)
    ship_city = models.CharField(max_length=100,null=True,blank=True)
    ship_state = models.CharField(max_length=100,null=True,blank=True)
    ship_pincode = models.CharField(max_length=100,null=True,blank=True)
    ship_country = models.CharField(max_length=100,null=True,blank=True)
    opening_balance = models.FloatField(null=True, blank=True, default=0.0)
    opening_balance_due = models.FloatField(null=True, blank=True, default=0.0)
    open_balance_type = models.CharField(max_length=100,null=True,blank=True)
    current_balance = models.FloatField(null=True, blank=True, default=0.0)
    credit_limit = models.FloatField(null=True, blank=True, default=0.0)
    date = models.DateField(null=True, auto_now_add=True,auto_now=False)
    customer_status = (
        ('Active','Active'),
        ('Inactive','Inactive'),
    )
    status =models.CharField(max_length=150,choices=customer_status,default='Active',null=True,blank=True)

class Fin_Customers_History(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    LoginDetails = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(Fin_Customers,on_delete=models.CASCADE,null=True,blank=True)
    date = models.DateField(auto_now_add=True, auto_now=False, null=True)
    action_choices = [
        ('Created', 'Created'),
        ('Edited', 'Edited'),
    ]
    action = models.CharField(max_length=20, null=True, blank = True, choices=action_choices)


class Fin_Customers_Comments(models.Model):
    Company = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(Fin_Customers,on_delete=models.CASCADE,null=True,blank=True)
    comments = models.CharField(max_length=500,null=True,blank=True)


class Fin_CNotification(models.Model): 
    Login_Id = models.ForeignKey(Fin_Login_Details, on_delete=models.CASCADE,null=True,blank=True)
    Company_id = models.ForeignKey(Fin_Company_Details, on_delete=models.CASCADE,null=True,blank=True)
    Item = models.ForeignKey(Fin_Items, on_delete = models.CASCADE, null=True, blank=True) # Added - shemeem -> Handle Item's min stock alerts
    Customers = models.ForeignKey(Fin_Customers, on_delete = models.CASCADE, null=True,blank=True) # Added - shemeem -> Handle customer's credit limit alerts
    # Vendors = models.ForeignKey(Fin_Vendors, on_delete = models.CASCADE, null=True,blank=True) # Added - shemeem -> Handle vendor's credit limit alerts
    
    Title = models.CharField(max_length=255,null=True,blank=True)
    Discription = models.CharField(max_length=255,null=True,blank=True) 
    Noti_date = models.DateTimeField(auto_now_add=True,null=True)
    date_created = models.DateField(auto_now_add=True,null=True)
    time=models.TimeField(auto_now_add=True,null=True)
    status = models.CharField(max_length=100,null=True,default='New')   