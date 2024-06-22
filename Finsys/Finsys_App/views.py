from django.shortcuts import render
from Finsys_App.models import *
from django.http import HttpResponse, JsonResponse
from .serializers import *
from django.contrib import auth
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
import json
from rest_framework.decorators import api_view, parser_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
import random
import string
from datetime import date
from datetime import timedelta
from django.db.models import Q
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.core.mail import send_mail, EmailMessage
from io import BytesIO
from django.conf import settings

# Create your views here.


def home(request):
    return HttpResponse("Okay")


@api_view(("POST",))
def Fin_companyReg_action(request):
    if request.method == "POST":
        if Fin_Login_Details.objects.filter(
            User_name=request.data["User_name"]
        ).exists():
            return Response(
                {
                    "status": False,
                    "message": "This username already exists. Sign up again",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif Fin_Company_Details.objects.filter(Email=request.data["Email"]).exists():
            return Response(
                {
                    "status": False,
                    "message": "This email already exists. Sign up again",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            request.data["User_Type"] = "Company"

            serializer = LoginDetailsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                loginId = Fin_Login_Details.objects.get(id=serializer.data["id"]).id

                code_length = 8
                characters = string.ascii_letters + string.digits  # Letters and numbers

                while True:
                    unique_code = "".join(
                        random.choice(characters) for _ in range(code_length)
                    )
                    # Check if the code already exists in the table
                    if not Fin_Company_Details.objects.filter(
                        Company_Code=unique_code
                    ).exists():
                        break

                request.data["Login_Id"] = loginId
                request.data["Company_Code"] = unique_code
                request.data["Admin_approval_status"] = "NULL"
                request.data["Distributor_approval_status"] = "NULL"
                companySerializer = CompanyDetailsSerializer(data=request.data)
                if companySerializer.is_valid():
                    companySerializer.save()
                    return Response(
                        {"status": True, "data": companySerializer.data},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"status": False, "data": companySerializer.errors},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )


@api_view(("PUT",))
@parser_classes((MultiPartParser, FormParser))
def Fin_CompanyReg2_action2(request):
    try:
        login_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        com = Fin_Company_Details.objects.get(Login_Id=data.id)

        dis_code = request.data.get("distId", "")
        print(dis_code)
        distr_id = None
        if dis_code:
            if not Fin_Distributors_Details.objects.filter(
                Distributor_Code=dis_code
            ).exists():
                return Response(
                    {
                        "status": False,
                        "message": "Sorry, distributor id does not exist",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                distr_id = Fin_Distributors_Details.objects.get(
                    Distributor_Code=dis_code
                )
                # request.data["Distributor_id"] = Fin_Distributors_Details.objects.filter(Distributor_Code=dis_code).first().id
                # print('distrId==',request.data['Distributor_id'])
        serializer = CompanyDetailsSerializer(com, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            # Update the company with trial period dates
            com.Start_Date = date.today()
            com.End_date = date.today() + timedelta(days=30)
            com.Distributor_id = distr_id
            com.save()

            # Create a trial period instance
            trial_period = TrialPeriod(
                company=com, start_date=com.Start_Date, end_date=com.End_date
            )
            trial_period.save()

            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_Add_Modules(request):
    try:
        login_id = request.data["Login_Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        com = Fin_Company_Details.objects.get(Login_Id=data.id)

        request.data["company_id"] = com.id

        serializer = ModulesListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Adding Default Units under company
            Fin_Units.objects.create(Company=com, name="BOX")
            Fin_Units.objects.create(Company=com, name="NUMBER")
            Fin_Units.objects.create(Company=com, name="PACK")

            # Adding Default loan terms under company by TINTO MT
            Fin_Loan_Term.objects.create(company=com, duration=3, term="MONTH", days=90)
            Fin_Loan_Term.objects.create(
                company=com, duration="6", term="MONTH", days=180
            )
            Fin_Loan_Term.objects.create(company=com, duration=1, term="YEAR", days=365)

            # Adding default accounts for companies

            created_date = date.today()
            account_info = [
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Accounts Payable",
                    "account_name": "Accounts Payable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "This is an account of all the money which you owe to others like a pending bill payment to a vendor,etc.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Accounts Receivable",
                    "account_name": "Accounts Receivable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The money that customers owe you becomes the accounts receivable. A good example of this is a payment expected from an invoice sent to your customer.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Advance Tax",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Any tax which is paid in advance is recorded into the advance tax account. This advance tax payment could be a quarterly, half yearly or yearly payment",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Advertising and Marketing",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Your expenses on promotional, marketing and advertising activities like banners, web-adds, trade shows, etc. are recorded in advertising and marketing account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Automobile Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Transportation related expenses like fuel charges and maintenance charges for automobiles, are included to the automobile expense account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Bad Debt",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Any amount which is lost and is unrecoverable is recorded into the bad debt account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Bank Fees and Charges",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Consultant Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Charges for availing the services of a consultant is recorded as a consultant expenses. The fees paid to a soft skills consultant to impart personality development training for your employees is a good example.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cost Of Goods Sold",
                    "account_name": "Cost of Goods Sold",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account which tracks the value of the goods sold.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Credit Card Charges",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " Service fees for transactions , balance transfer fees, annual credit fees and other charges levied on a credit card are recorded into the credit card account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Depreciation Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Any depreciation in value of your assets can be captured as a depreciation expense.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "Discount",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Any reduction on your selling price as a discount can be recorded into the discount account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Drawings",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The money withdrawn from a business by its owner can be tracked with this account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Employee Advance",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Money paid out to an employee in advance can be tracked here till it's repaid or shown to be spent for company purposes",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Employee Reimbursements",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "This account can be used to track the reimbursements that are due to be paid out to employees.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Expense",
                    "account_name": "Exchange Gain or Loss",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Changing the conversion rate can result in a gain or a loss. You can record this into the exchange gain or loss account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Fixed Asset",
                    "account_name": "Furniture and Equipment",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Purchases of furniture and equipment for your office that can be used for a long period of time usually exceeding one year can be tracked with this account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "General Income",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "A general category of account where you can record any income which cannot be recorded into any other category",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "Interest Income",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "A percentage of your balances and deposits are given as interest to you by your banks and financial institutions. This interest is recorded into the interest income account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Stock",
                    "account_name": "Inventory Asset",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An account which tracks the value of goods in your inventory.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "IT and Internet Expenses",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Money spent on your IT infrastructure and usage like internet connection, purchasing computer equipment etc is recorded as an IT and Computer Expense",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Janitorial Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "All your janitorial and cleaning expenses are recorded into the janitorial expenses account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "Late Fee Income",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Any late fee income is recorded into the late fee income account. The late fee is levied when the payment for an invoice is not received by the due date",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Lodging",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Any expense related to putting up at motels etc while on business travel can be entered here.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Meals and Entertainment",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Expenses on food and entertainment are recorded into this account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Office Supplies",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "All expenses on purchasing office supplies like stationery are recorded into the office supplies account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Opening Balance Adjustments",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "This account will hold the difference in the debits and credits entered during the opening balance.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Opening Balance Offset",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "This is an account where you can record the balance from your previous years earning or the amount set aside for some activities. It is like a buffer account for your funds.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "Other Charges",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Miscellaneous charges like adjustments made to the invoice can be recorded in this account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Other Expenses",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " Any minor expense on activities unrelated to primary business operations is recorded under the other expense account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Owner's Equity",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The owners rights to the assets of a company can be quantified in the owner's equity account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cash",
                    "account_name": "Petty Cash",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "It is a small amount of cash that is used to pay your minor or casual expenses rather than writing a check.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Postage",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Your expenses on ground mails, shipping and air mails can be recorded under the postage account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Prepaid Expenses",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An asset account that reports amounts paid in advance while purchasing goods or services from a vendor.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Printing and Stationery",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " Expenses incurred by the organization towards printing and stationery.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Rent Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The rent paid for your office or any space related to your business can be recorded as a rental expense.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Repairs and Maintenance",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The costs involved in maintenance and repair of assets is recorded under this account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Retained Earnings",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The earnings of your company which are not distributed among the share holders is accounted as retained earnings.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Salaries and Employee Wages",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Salaries for your employees and the wages paid to workers are recorded under the salaries and wages account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "Sales",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " The income from the sales in your business is recorded under the sales account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Income",
                    "account_name": "Shipping Charge",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Shipping charges made to the invoice will be recorded in this account.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Liability",
                    "account_name": "Tag Adjustments",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " This adjustment account tracks the transfers between different reporting tags.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Tax Payable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The amount of money which you owe to your tax authority is recorded under the tax payable account. This amount is a sum of your outstanding in taxes and the tax charged on sales.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Telephone Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The expenses on your telephone, mobile and fax usage are accounted as telephone expenses.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Travel Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " Expenses on business travels like hotel bookings, flight charges, etc. are recorded as travel expenses.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Uncategorized",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "This account can be used to temporarily track expenses that are yet to be identified and classified into a particular category.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cash",
                    "account_name": "Undeposited Funds",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "Record funds received by your company yet to be deposited in a bank as undeposited funds and group them as a current asset in your balance sheet.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Unearned Revenue",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "A liability account that reports amounts received in advance of providing goods or services. When the goods or services are provided, this account balance is decreased and a revenue account is increased.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Capital Stock",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " An equity account that tracks the capital introduced when a business is operated through a company or corporation.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Long Term Liability",
                    "account_name": "Construction Loans",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account that tracks the amount you repay for construction loans.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Contract Assets",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An asset account to track the amount that you receive from your customers while you're yet to complete rendering the services.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Depreciation And Amortisation",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account that is used to track the depreciation of tangible assets and intangible assets, which is amortization.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Distributions",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An equity account that tracks the payment of stock, cash or physical products to its shareholders.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Dividends Paid",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An equity account to track the dividends paid when a corporation declares dividend on its common stock.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "GST Payable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Output CGST",
                    "credit_card_no": "",
                    "sub_account": True,
                    "parent_account": "GST Payable",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Output IGST",
                    "credit_card_no": "",
                    "sub_account": True,
                    "parent_account": "GST Payable",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "Output SGST",
                    "credit_card_no": "",
                    "sub_account": True,
                    "parent_account": "GST Payable",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "GST TCS Receivable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "GST TDS Receivable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Input Tax Credits",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Input CGST",
                    "credit_card_no": "",
                    "sub_account": True,
                    "parent_account": "Input Tax Credits",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Input IGST",
                    "credit_card_no": "",
                    "sub_account": True,
                    "parent_account": "Input Tax Credits",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Input SGST",
                    "credit_card_no": "",
                    "sub_account": True,
                    "parent_account": "Input Tax Credits",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Equity",
                    "account_name": "Investments",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An equity account used to track the amount that you invest.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cost Of Goods Sold",
                    "account_name": "Job Costing",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account to track the costs that you incur in performing a job or a task.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cost Of Goods Sold",
                    "account_name": "Labor",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account that tracks the amount that you pay as labor.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cost Of Goods Sold",
                    "account_name": "Materials",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account that tracks the amount you use in purchasing materials.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Merchandise",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account to track the amount spent on purchasing merchandise.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Long Term Liability",
                    "account_name": "Mortgages",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account that tracks the amounts you pay for the mortgage loan.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Raw Materials And Consumables",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account to track the amount spent on purchasing raw materials and consumables.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Reverse Charge Tax Input but not due",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "The amount of tax payable for your reverse charge purchases can be tracked here.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "Sales to Customers (Cash)",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cost Of Goods Sold",
                    "account_name": "Subcontractor",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": " An expense account to track the amount that you pay subcontractors who provide service to you.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Liability",
                    "account_name": "TDS Payable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Other Current Asset",
                    "account_name": "TDS Receivable",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Expense",
                    "account_name": "Transportation Expense",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "An expense account to track the amount spent on transporting goods or providing services.",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Bank",
                    "account_name": "Bank Account",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Cash",
                    "account_name": "Cash Account",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Credit Card",
                    "account_name": "Credit Card Account",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
                {
                    "company_id": com,
                    "Login_Id": data,
                    "account_type": "Payment Clearing Account",
                    "account_name": "Payment Clearing Account",
                    "credit_card_no": "",
                    "sub_account": "",
                    "parent_account": "",
                    "bank_account_no": None,
                    "account_code": "",
                    "description": "",
                    "balance": 0.0,
                    "balance_type": "",
                    "date": created_date,
                    "create_status": "default",
                    "status": "active",
                },
            ]

            for account in account_info:
                if not Fin_Chart_Of_Account.objects.filter(
                    Company=com, account_name=account["account_name"]
                ).exists():
                    new_account = Fin_Chart_Of_Account(
                        Company=account["company_id"],
                        LoginDetails=account["Login_Id"],
                        account_name=account["account_name"],
                        account_type=account["account_type"],
                        credit_card_no=account["credit_card_no"],
                        sub_account=account["sub_account"],
                        parent_account=account["parent_account"],
                        bank_account_no=account["bank_account_no"],
                        account_code=account["account_code"],
                        description=account["description"],
                        balance=account["balance"],
                        balance_type=account["balance_type"],
                        create_status=account["create_status"],
                        status=account["status"],
                        date=account["date"],
                    )
                    new_account.save()

            # Adding Default Customer payment under company
            Fin_Company_Payment_Terms.objects.create(
                Company=com, term_name="Due on Receipt", days=0
            )
            Fin_Company_Payment_Terms.objects.create(
                Company=com, term_name="NET 30", days=30
            )
            Fin_Company_Payment_Terms.objects.create(
                Company=com, term_name="NET 60", days=60
            )

            # sumayya-------- Adding default repeat every values for company

            Fin_CompanyRepeatEvery.objects.create(
                company=com,
                repeat_every="3 Month",
                repeat_type="Month",
                duration=3,
                days=90,
            )
            Fin_CompanyRepeatEvery.objects.create(
                company=com,
                repeat_every="6 Month",
                repeat_type="Month",
                duration=6,
                days=180,
            )
            Fin_CompanyRepeatEvery.objects.create(
                company=com,
                repeat_every="1 Year",
                repeat_type="Year",
                duration=1,
                days=360,
            )

            # Creating default transport entries with company information---aiswarya
            Fin_Eway_Transportation.objects.create(Name="Bus", Type="Road", Company=com)
            Fin_Eway_Transportation.objects.create(
                Name="Train", Type="Rail", Company=com
            )
            Fin_Eway_Transportation.objects.create(Name="Car", Type="Road", Company=com)

            Stock_Reason.objects.create(
                company=com, login_details=data, reason="Stock on fire"
            )
            Stock_Reason.objects.create(
                company=com, login_details=data, reason="High demand of goods"
            )
            Stock_Reason.objects.create(
                company=com, login_details=data, reason="Stock written off"
            )
            Stock_Reason.objects.create(
                company=com, login_details=data, reason="Inventory Revaluation"
            )

            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_DReg_Action(request):
    if request.method == "POST":
        if Fin_Login_Details.objects.filter(
            User_name=request.data["User_name"]
        ).exists():
            return Response(
                {
                    "status": False,
                    "message": "This username already exists. Sign up again",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif Fin_Company_Details.objects.filter(Email=request.data["Email"]).exists():
            return Response(
                {
                    "status": False,
                    "message": "This email already exists. Sign up again",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            request.data["User_Type"] = "Distributor"

            serializer = LoginDetailsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                loginId = Fin_Login_Details.objects.get(id=serializer.data["id"]).id

                code_length = 8
                characters = string.ascii_letters + string.digits  # Letters and numbers

                while True:
                    unique_code = "".join(
                        random.choice(characters) for _ in range(code_length)
                    )
                    # Check if the code already exists in the table
                    if not Fin_Company_Details.objects.filter(
                        Company_Code=unique_code
                    ).exists():
                        break

                request.data["Login_Id"] = loginId
                request.data["Distributor_Code"] = unique_code
                request.data["Admin_approval_status"] = "NULL"

                distributorSerializer = DistributorDetailsSerializer(data=request.data)
                if distributorSerializer.is_valid():
                    distributorSerializer.save()
                    return Response(
                        {"status": True, "data": distributorSerializer.data},
                        status=status.HTTP_201_CREATED,
                    )
                else:
                    return Response(
                        {"status": False, "data": distributorSerializer.errors},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )


@api_view(["GET"])
def Fin_getPaymentTerms(request):
    try:
        terms = Fin_Payment_Terms.objects.all()
        if terms:
            serializer = PaymentTermsSerializer(terms, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"status": False}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
def Fin_getDistributorData(request, id):
    try:
        login_id = id
        data = Fin_Login_Details.objects.get(id=login_id)
        if data:
            distr = Fin_Distributors_Details.objects.get(Login_Id=data)
            dict = {
                "fName": data.First_name,
                "lName": data.Last_name,
                "uName": data.User_name,
                "email": distr.Email,
            }
            return JsonResponse(
                {"status": True, "data": dict}, status=status.HTTP_200_OK
            )
        else:
            return JsonResponse({"status": False}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
@parser_classes((MultiPartParser, FormParser))
def Fin_DReg2_Action2(request):
    try:
        login_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        ddata = Fin_Distributors_Details.objects.get(Login_Id=data)

        serializer = DistributorDetailsSerializer(
            ddata, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()

            # Update the company with trial period dates
            payment_term = request.data["Payment_Term"]
            terms = Fin_Payment_Terms.objects.get(id=payment_term)

            start_date = date.today()
            days = int(terms.days)
            end = date.today() + timedelta(days=days)

            ddata.Start_Date = start_date
            ddata.End_date = end
            ddata.save()

            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_staffReg_action(request):
    if not Fin_Company_Details.objects.filter(
        Company_Code=request.data["Company_code"]
    ).exists():
        return Response(
            {
                "status": False,
                "message": "This company code does not exists. try again.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    elif Fin_Login_Details.objects.filter(User_name=request.data["User_name"]).exists():
        return Response(
            {
                "status": False,
                "message": "This username already exists. Sign up again",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    elif Fin_Staff_Details.objects.filter(Email=request.data["Email"]).exists():
        return Response(
            {
                "status": False,
                "message": "This email already exists. Sign up again",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
    else:
        com = Fin_Company_Details.objects.get(Company_Code=request.data["Company_code"])

        request.data["User_Type"] = "Staff"

        serializer = LoginDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            loginId = Fin_Login_Details.objects.get(id=serializer.data["id"]).id

            request.data["Login_Id"] = loginId
            request.data["Company_approval_status"] = "Null"
            request.data["company_id"] = com.id
            staffSerializer = StaffDetailsSerializer(data=request.data)
            if staffSerializer.is_valid():
                staffSerializer.save()
                return Response(
                    {"status": True, "data": staffSerializer.data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"status": False, "data": staffSerializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["GET"])
def Fin_getStaffData(request, id):
    try:
        login_id = id
        data = Fin_Login_Details.objects.get(id=login_id)
        if data:
            stf = Fin_Staff_Details.objects.get(Login_Id=data)
            dict = {
                "name": data.First_name + " " + data.Last_name,
                "uName": data.User_name,
                "email": stf.Email,
            }
            return JsonResponse(
                {"status": True, "data": dict}, status=status.HTTP_200_OK
            )
        else:
            return JsonResponse({"status": False}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
@parser_classes((MultiPartParser, FormParser))
def Fin_StaffReg2_Action(request):
    try:
        login_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        sdata = Fin_Staff_Details.objects.get(Login_Id=data)

        serializer = StaffDetailsSerializer(sdata, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Staff_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Staff details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_login(request):
    try:
        user_name = request.data["username"]
        passw = request.data["password"]

        log_user = auth.authenticate(username=user_name, password=passw)

        if log_user is not None:
            auth.login(request, log_user)

            # ---super admin---

            if request.user.is_staff == 1:
                return Response(
                    {
                        "status": True,
                        "redirect": "admin_home",
                        "user": "Admin",
                        "Login_id": "",
                    },
                    status=status.HTTP_200_OK,
                )

        # -------distributor ------

        if Fin_Login_Details.objects.filter(
            User_name=user_name, password=passw
        ).exists():
            data = Fin_Login_Details.objects.get(User_name=user_name, password=passw)
            if data.User_Type == "Distributor":
                did = Fin_Distributors_Details.objects.get(Login_Id=data.id)
                if did.Admin_approval_status == "Accept":
                    request.session["s_id"] = data.id
                    current_day = date.today()
                    if current_day > did.End_date:
                        print("wrong")

                        if not Fin_Payment_Terms_updation.objects.filter(
                            Login_Id=data, status="New"
                        ).exists():
                            return Response(
                                {
                                    "status": False,
                                    "redirect": "wrong",
                                    "message": "Terms Expired",
                                }
                            )
                        else:
                            return Response(
                                {
                                    "status": False,
                                    "redirect": "distributor_registration",
                                    "message": "Term Updation Request is pending..",
                                }
                            )
                    else:
                        return Response(
                            {
                                "status": True,
                                "redirect": "distributor_home",
                                "user": "Distributor",
                                "Login_id": data.id,
                            },
                            status=status.HTTP_200_OK,
                        )

                else:
                    return Response(
                        {"status": False, "message": "Approval is Pending"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            if data.User_Type == "Company":
                cid = Fin_Company_Details.objects.get(Login_Id=data.id)
                if (
                    cid.Admin_approval_status == "Accept"
                    or cid.Distributor_approval_status == "Accept"
                ):
                    request.session["s_id"] = data.id

                    com = Fin_Company_Details.objects.get(Login_Id=data.id)

                    current_day = date.today()
                    if current_day > com.End_date:
                        print("wrong")

                        if not Fin_Payment_Terms_updation.objects.filter(
                            Login_Id=data, status="New"
                        ).exists():
                            return Response(
                                {
                                    "status": False,
                                    "redirect": "wrong",
                                    "message": "Terms Expired",
                                }
                            )
                        else:
                            return Response(
                                {
                                    "status": False,
                                    "redirect": "company_registration",
                                    "message": "Term Updation Request is pending..",
                                }
                            )

                    else:
                        return Response(
                            {
                                "status": True,
                                "redirect": "company_home",
                                "user": "Company",
                                "Login_id": data.id,
                            },
                            status=status.HTTP_200_OK,
                        )
                else:
                    return Response(
                        {"status": False, "message": "Approval is Pending"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            if data.User_Type == "Staff":
                cid = Fin_Staff_Details.objects.get(Login_Id=data.id)
                if cid.Company_approval_status == "Accept":
                    request.session["s_id"] = data.id
                    com = Fin_Staff_Details.objects.get(Login_Id=data.id)

                    current_day = date.today()
                    if current_day > com.company_id.End_date:
                        print("wrong")
                        return Response(
                            {
                                "status": False,
                                "redirect": "staff_registration",
                                "message": "Your account is temporarily blocked",
                            }
                        )
                    else:
                        return Response(
                            {
                                "status": True,
                                "redirect": "company_home",
                                "user": "Staff",
                                "Login_id": data.id,
                            },
                            status=status.HTTP_200_OK,
                        )
                else:
                    return Response(
                        {"status": False, "message": "Approval is Pending"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        else:
            return Response(
                {"status": False, "message": "Invalid username or password, try again"},
                status=status.HTTP_404_NOT_FOUND,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_add_payment_terms(request):
    try:
        num = int(request.data["num"])
        select = request.data["value"]
        if select == "Years":
            days = int(num) * 365
            pt = Fin_Payment_Terms(
                payment_terms_number=num, payment_terms_value=select, days=days
            )
            pt.save()
            return Response({"status": True}, status=status.HTTP_201_CREATED)
        else:
            days = int(num * 30)
            pt = Fin_Payment_Terms(
                payment_terms_number=num, payment_terms_value=select, days=days
            )
            pt.save()
            return Response({"status": True}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_delete_payment_terms(request, id):
    try:
        term = Fin_Payment_Terms.objects.get(id=id)
        term.delete()
        return Response({"status": True}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getDistributorsRequests(request):
    try:
        data = Fin_Distributors_Details.objects.filter(Admin_approval_status="NULL")
        # serializer = DistributorDetailsSerializer(data, many=True)
        requests = []
        for i in data:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.Contact,
                "term": (
                    str(i.Payment_Term.payment_terms_number)
                    + " "
                    + i.Payment_Term.payment_terms_value
                    if i.Payment_Term
                    else ""
                ),
                "endDate": i.End_date,
            }
            requests.append(req)
        print("DIST DATA==", requests)
        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getDistributors(request):
    try:
        data = Fin_Distributors_Details.objects.filter(Admin_approval_status="Accept")
        # serializer = DistributorDetailsSerializer(data, many=True)
        requests = []
        for i in data:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.Contact,
                "term": (
                    str(i.Payment_Term.payment_terms_number)
                    + " "
                    + i.Payment_Term.payment_terms_value
                    if i.Payment_Term
                    else ""
                ),
                "endDate": i.End_date,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
def Fin_DReq_Accept(request, id):
    try:
        data = Fin_Distributors_Details.objects.get(id=id)
        data.Admin_approval_status = "Accept"
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_DReq_Reject(request, id):
    print("session", request.session)
    try:
        data = Fin_Distributors_Details.objects.get(id=id)
        data.Login_Id.delete()
        data.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getDistributorsOverviewData(request, id):
    try:
        data = Fin_Distributors_Details.objects.get(id=id)
        # serializer = DistributorDetailsSerializer(data, many=True)
        req = {
            "id": data.id,
            "name": data.Login_Id.First_name + " " + data.Login_Id.Last_name,
            "email": data.Email,
            "code": data.Distributor_Code,
            "contact": data.Contact,
            "username": data.Login_Id.User_name,
            "image": data.Image.url if data.Image else None,
            "endDate": data.End_date,
            "term": (
                str(data.Payment_Term.payment_terms_number)
                + " "
                + data.Payment_Term.payment_terms_value
                if data.Payment_Term
                else ""
            ),
        }
        return Response({"status": True, "data": req}, status=status.HTTP_200_OK)
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getClientsRequests(request):
    try:
        data = Fin_Company_Details.objects.filter(
            Registration_Type="self", Admin_approval_status="NULL"
        )
        requests = []
        for i in data:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.Contact,
                "term": (
                    str(i.Payment_Term.payment_terms_number)
                    + " "
                    + i.Payment_Term.payment_terms_value
                    if i.Payment_Term
                    else "Trial Period"
                ),
                "endDate": i.End_date,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
def Fin_Client_Req_Accept(request, id):
    try:
        data = Fin_Company_Details.objects.get(id=id)
        data.Admin_approval_status = "Accept"
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Client details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_Client_Req_Reject(request, id):
    try:
        data = Fin_Company_Details.objects.get(id=id)
        data.Login_Id.delete()
        data.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Client details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getClients(request):
    try:
        data = Fin_Company_Details.objects.filter(Admin_approval_status="Accept")
        # serializer = DistributorDetailsSerializer(data, many=True)
        requests = []
        for i in data:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.Contact,
                "term": (
                    str(i.Payment_Term.payment_terms_number)
                    + " "
                    + i.Payment_Term.payment_terms_value
                    if i.Payment_Term
                    else "Trial Period"
                ),
                "endDate": i.End_date,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getClientsOverviewData(request, id):
    try:
        data = Fin_Company_Details.objects.get(id=id)
        modules = Fin_Modules_List.objects.get(company_id=id, status="New")
        serializer = ModulesListSerializer(modules)
        req = {
            "id": data.id,
            "name": data.Login_Id.First_name + " " + data.Login_Id.Last_name,
            "email": data.Email,
            "code": data.Company_Code,
            "contact": data.Contact,
            "username": data.Login_Id.User_name,
            "image": data.Image.url if data.Image else "",
            "endDate": data.End_date,
            "term": (
                str(data.Payment_Term.payment_terms_number)
                + " "
                + data.Payment_Term.payment_terms_value
                if data.Payment_Term
                else "Trial Period"
            ),
        }
        return Response(
            {"status": True, "data": req, "modules": serializer.data},
            status=status.HTTP_200_OK,
        )
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Client details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_DClient_req(request, id):
    try:
        data = Fin_Distributors_Details.objects.get(Login_Id=id)
        lst = Fin_Company_Details.objects.filter(
            Registration_Type="distributor",
            Distributor_approval_status="NULL",
            Distributor_id=data.id,
        )
        requests = []
        for i in lst:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.Contact,
                "term": (
                    str(i.Payment_Term.payment_terms_number)
                    + " "
                    + i.Payment_Term.payment_terms_value
                    if i.Payment_Term
                    else "Trial Period"
                ),
                "endDate": i.End_date,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_DClients(request, id):
    try:
        data = Fin_Distributors_Details.objects.get(Login_Id=id)
        lst = Fin_Company_Details.objects.filter(
            Registration_Type="distributor",
            Distributor_approval_status="Accept",
            Distributor_id=data.id,
        )
        requests = []
        for i in lst:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.Contact,
                "term": (
                    str(i.Payment_Term.payment_terms_number)
                    + " "
                    + i.Payment_Term.payment_terms_value
                    if i.Payment_Term
                    else "Trial Period"
                ),
                "endDate": i.End_date,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
def Fin_DClient_Req_Accept(request, id):
    try:
        data = Fin_Company_Details.objects.get(id=id)
        data.Distributor_approval_status = "Accept"
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Client details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_DClient_Req_Reject(request, id):
    try:
        data = Fin_Company_Details.objects.get(id=id)
        data.Login_Id.delete()
        data.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Client details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getSelfData(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        img = None
        name = None
        if data.User_Type == "Company":
            usrData = Fin_Company_Details.objects.get(Login_Id=data)
            img = usrData.Image.url if usrData.Image else None
            name = usrData.Company_name
        elif data.User_Type == "Distributor":
            usrData = Fin_Distributors_Details.objects.get(Login_Id=data)
            img = usrData.Image.url if usrData.Image else None
            name = data.First_name + " " + data.Last_name
        elif data.User_Type == "Staff":
            usrData = Fin_Staff_Details.objects.get(Login_Id=data)
            img = usrData.img.url if usrData.img else None
            name = data.First_name + " " + data.Last_name
        else:
            usrData = None

        details = {"name": name, "image": img}

        return Response({"status": True, "data": details})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getStaffRequests(request, id):
    try:
        # data = Fin_Login_Details.objects.get(id=id)
        com = Fin_Company_Details.objects.get(Login_Id=id)
        data1 = Fin_Staff_Details.objects.filter(
            company_id=com.id, Company_approval_status="NULL"
        )
        requests = []
        for i in data1:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.contact,
                "username": i.Login_Id.User_name,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getAllStaffs(request, id):
    try:
        # data = Fin_Login_Details.objects.get(id=id)
        com = Fin_Company_Details.objects.get(Login_Id=id)
        data1 = Fin_Staff_Details.objects.filter(
            company_id=com.id, Company_approval_status="Accept"
        )
        requests = []
        for i in data1:
            req = {
                "id": i.id,
                "name": i.Login_Id.First_name + " " + i.Login_Id.Last_name,
                "email": i.Email,
                "contact": i.contact,
                "username": i.Login_Id.User_name,
            }
            requests.append(req)

        return Response({"status": True, "data": requests})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
def Fin_Staff_Req_Accept(request, id):
    try:
        data = Fin_Staff_Details.objects.get(id=id)
        data.Company_approval_status = "Accept"
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Staff_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Staff details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_Staff_Req_Reject(request, id):
    try:
        data = Fin_Staff_Details.objects.get(id=id)
        data.Login_Id.delete()
        data.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Fin_Staff_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Staff details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getProfileData(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            usrData = Fin_Company_Details.objects.get(Login_Id=data)
            payment_request = Fin_Payment_Terms_updation.objects.filter(
                Login_Id=data, status="New"
            ).exists()
            personal = {
                "companyLogo": usrData.Image.url if usrData.Image else False,
                "userImage": False,
                "firstName": data.First_name,
                "lastName": data.Last_name,
                "email": usrData.Email,
                "username": data.User_name,
                "companyContact": usrData.Contact,
                "userContact": "",
            }
            company = {
                "businessName": usrData.Business_name,
                "companyName": usrData.Company_name,
                "companyType": usrData.Company_Type,
                "industry": usrData.Industry,
                "companyCode": usrData.Company_Code,
                "companyEmail": usrData.Email,
                "panNumber": usrData.Pan_NO,
                "gstType": usrData.GST_Type,
                "gstNo": usrData.GST_NO,
                "paymentTerm": (
                    str(usrData.Payment_Term.payment_terms_number)
                    + " "
                    + usrData.Payment_Term.payment_terms_value
                    if usrData.Payment_Term
                    else "Trial Period"
                ),
                "endDate": usrData.End_date,
                "address": usrData.Address,
                "city": usrData.City,
                "state": usrData.State,
                "pincode": usrData.Pincode,
            }

        if data.User_Type == "Staff":
            staffData = Fin_Staff_Details.objects.get(Login_Id=data)
            payment_request = Fin_Payment_Terms_updation.objects.filter(
                Login_Id=staffData.company_id.Login_Id, status="New"
            ).exists()

            personal = {
                "companyLogo": False,
                "userImage": staffData.img.url if staffData.img else False,
                "firstName": data.First_name,
                "lastName": data.Last_name,
                "email": staffData.Email,
                "username": data.User_name,
                "companyContact": staffData.company_id.Contact,
                "userContact": staffData.contact,
            }
            company = {
                "businessName": staffData.company_id.Business_name,
                "companyName": staffData.company_id.Company_name,
                "companyType": staffData.company_id.Company_Type,
                "industry": staffData.company_id.Industry,
                "companyCode": staffData.company_id.Company_Code,
                "companyEmail": staffData.company_id.Email,
                "panNumber": staffData.company_id.Pan_NO,
                "gstType": staffData.company_id.GST_Type,
                "gstNo": staffData.company_id.GST_NO,
                "paymentTerm": (
                    str(staffData.company_id.Payment_Term.payment_terms_number)
                    + " "
                    + staffData.company_id.Payment_Term.payment_terms_value
                    if staffData.company_id.Payment_Term
                    else "Trial Period"
                ),
                "endDate": staffData.company_id.End_date,
                "address": staffData.company_id.Address,
                "city": staffData.company_id.City,
                "state": staffData.company_id.State,
                "pincode": staffData.company_id.Pincode,
            }

        return Response(
            {
                "status": True,
                "personalData": personal,
                "companyData": company,
                "payment_request": payment_request,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
@parser_classes((MultiPartParser, FormParser))
def Fin_editCompanyProfile(request):
    try:
        login_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        com = Fin_Company_Details.objects.get(Login_Id=data.id)

        logSerializer = LoginDetailsSerializer(data, data=request.data)
        serializer = CompanyDetailsSerializer(com, data=request.data, partial=True)
        if logSerializer.is_valid():
            logSerializer.save()
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"status": False, "data": logSerializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
@parser_classes((MultiPartParser, FormParser))
def Fin_editStaffProfile(request):
    try:
        login_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        stf = Fin_Staff_Details.objects.get(Login_Id=data.id)

        logSerializer = LoginDetailsSerializer(data, data=request.data)
        serializer = StaffDetailsSerializer(stf, data=request.data, partial=True)
        if logSerializer.is_valid():
            logSerializer.save()
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"status": False, "data": logSerializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Staff_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Staff details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def company_gsttype_change(request):
    try:
        s_id = request.data["ID"]
        data = Fin_Login_Details.objects.get(id=s_id)
        com = Fin_Company_Details.objects.get(Login_Id=s_id)

        # Get data from the form

        # gstno = request.POST.get('gstno')
        gsttype = request.data["gsttype"]

        com.GST_Type = gsttype

        com.save()

        # Check if gsttype is one of the specified values
        if gsttype in ["unregistered Business", "Overseas", "Consumer"]:
            com.GST_NO = ""
            com.save()
            return Response(
                {"status": True, "message": "GST Type changed"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"status": True, "message": "GST Type changed, add GST Number"},
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_Change_payment_terms(request):
    try:
        s_id = request.data["ID"]
        data = Fin_Login_Details.objects.get(id=s_id)
        com = Fin_Company_Details.objects.get(Login_Id=s_id)
        pt = request.data["payment_term"]

        pay = Fin_Payment_Terms.objects.get(id=pt)

        data1 = Fin_Payment_Terms_updation(Login_Id=data, Payment_Term=pay)
        data1.save()

        if com.Registration_Type == "self":
            noti = Fin_ANotification(
                Login_Id=data,
                PaymentTerms_updation=data1,
                Title="Change Payment Terms",
                Discription=com.Company_name + " wants to subscribe a new plan",
            )
            noti.save()
        else:
            noti = Fin_DNotification(
                Distributor_id=com.Distributor_id,
                Login_Id=data,
                PaymentTerms_updation=data1,
                Title="Change Payment Terms",
                Discription=com.Company_name + " wants to subscribe a new plan",
            )
            noti.save()

        return Response(
            {"status": True, "message": "Request Sent.!"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def getDistributorProfileData(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        usrData = Fin_Distributors_Details.objects.get(Login_Id=data)
        payment_request = Fin_Payment_Terms_updation.objects.filter(
            Login_Id=data, status="New"
        ).exists()
        personal = {
            "userImage": usrData.Image.url if usrData.Image else False,
            "distributorCode": usrData.Distributor_Code,
            "firstName": data.First_name,
            "lastName": data.Last_name,
            "email": usrData.Email,
            "username": data.User_name,
            "userContact": usrData.Contact,
            "joinDate": usrData.Start_Date,
            "paymentTerm": (
                str(usrData.Payment_Term.payment_terms_number)
                + " "
                + usrData.Payment_Term.payment_terms_value
                if usrData.Payment_Term
                else ""
            ),
            "endDate": usrData.End_date,
        }

        return Response(
            {
                "status": True,
                "personalData": personal,
                "payment_request": payment_request,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_Change_distributor_payment_terms(request):
    try:
        s_id = request.data["ID"]
        data = Fin_Login_Details.objects.get(id=s_id)
        com = Fin_Distributors_Details.objects.get(Login_Id=s_id)
        pt = request.data["payment_term"]

        pay = Fin_Payment_Terms.objects.get(id=pt)

        data1 = Fin_Payment_Terms_updation(Login_Id=data, Payment_Term=pay)
        data1.save()

        noti = Fin_ANotification(
            Login_Id=data,
            PaymentTerms_updation=data1,
            Title="Change Payment Terms",
            Discription=com.Login_Id.First_name
            + " "
            + com.Login_Id.Last_name
            + " wants to subscribe a new plan",
        )
        noti.save()

        return Response(
            {"status": True, "message": "Request Sent.!"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("PUT",))
@parser_classes((MultiPartParser, FormParser))
def Fin_editDistributorProfile(request):
    try:
        login_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        distr = Fin_Distributors_Details.objects.get(Login_Id=data.id)

        logSerializer = LoginDetailsSerializer(data, data=request.data)
        serializer = DistributorDetailsSerializer(
            distr, data=request.data, partial=True
        )
        if logSerializer.is_valid():
            logSerializer.save()
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"status": False, "data": logSerializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_checkPaymentTerms(request, id):
    try:
        s_id = id
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
            payment_request = Fin_Payment_Terms_updation.objects.filter(
                Login_Id=com.Login_Id, status="New"
            ).exists()

            title2 = ["Modules Updated..!", "New Plan Activated..!"]
            today_date = date.today()
            notification = Fin_CNotification.objects.filter(
                status="New", Company_id=com, Title__in=title2, Noti_date__lt=today_date
            ).order_by("-id", "-Noti_date")
            notification.update(status="old")

            diff = (com.End_date - today_date).days

            # payment term and trial period alert notifications for notification page
            cmp_name = com.Company_name
            if com.Payment_Term:
                if (
                    not Fin_CNotification.objects.filter(
                        Company_id=com, Title="Payment Terms Alert", status="New"
                    ).exists()
                    and diff <= 20
                ):

                    n = Fin_CNotification(
                        Login_Id=data,
                        Company_id=com,
                        Title="Payment Terms Alert",
                        Discription="Your Payment Terms End Soon",
                    )
                    n.save()
                    if com.Registration_Type == "self":
                        d = Fin_ANotification(
                            Login_Id=data,
                            Title="Payment Terms Alert",
                            Discription=f"Current  payment terms of {cmp_name} is expiring",
                        )
                    else:
                        d = Fin_DNotification(
                            Login_Id=data,
                            Distributor_id=com.Distributor_id,
                            Title="Payment Terms Alert",
                            Discription=f"Current  payment terms of {cmp_name} is expiring",
                        )

                    d.save()
            else:
                if (
                    not Fin_CNotification.objects.filter(
                        Company_id=com, Title="Trial Period Alert", status="New"
                    ).exists()
                    and diff <= 10
                ):
                    n = Fin_CNotification(
                        Login_Id=data,
                        Company_id=com,
                        Title="Trial Period Alert",
                        Discription="Your Trial Period End Soon",
                    )
                    n.save()
                    print("NOTIFICATION SAVED>>>")
                    if com.Registration_Type == "self":
                        d = Fin_ANotification(
                            Login_Id=data,
                            Title="Payment Terms Alert",
                            Discription=f"Current  payment terms of {cmp_name} is expiring",
                        )
                    else:
                        d = Fin_DNotification(
                            Login_Id=data,
                            Distributor_id=com.Distributor_id,
                            Title="Payment Terms Alert",
                            Discription=f"Current  payment terms of {cmp_name} is expiring",
                        )

                    d.save()

            # Calculate the date 20 days before the end date for payment term renew and 10 days before for trial period renew
            if com.Payment_Term:
                term = True
                reminder_date = com.End_date - timedelta(days=20)
            else:
                term = False
                reminder_date = com.End_date - timedelta(days=10)
            current_date = date.today()
            alert_message = current_date >= reminder_date

            # Calculate the number of days between the reminder date and end date
            days_left = (com.End_date - current_date).days
            return Response(
                {
                    "status": True,
                    "alert_message": alert_message,
                    "endDate": com.End_date,
                    "days_left": days_left,
                    "paymentTerm": term,
                    "payment_request": payment_request,
                    "companyName": cmp_name,
                },
                status=status.HTTP_200_OK,
            )
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id
            return Response(
                {"status": True, "companyName": com.Company_name},
                status=status.HTTP_200_OK,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchNotifications(request, id):
    try:
        s_id = id
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
            noti = Fin_CNotification.objects.filter(
                status="New", Company_id=com
            ).order_by("-id", "-Noti_date")
            serializer = CNotificationsSerializer(noti, many=True)
            return Response(
                {"status": True, "notifications": serializer.data, 'count':len(noti)},
                status=status.HTTP_200_OK,
            )
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id
            nCount = Fin_CNotification.objects.filter(Company_id = com, status = 'New')
            return Response(
                {"status": True, "notifications": None, 'count':len(nCount)}, status=status.HTTP_200_OK
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchDistNotifications(request, id):
    try:
        s_id = id
        data = Fin_Login_Details.objects.get(id=s_id)
        com = Fin_Distributors_Details.objects.get(Login_Id=s_id)
        noti = Fin_DNotification.objects.filter(
            status="New", Distributor_id=com.id
        ).order_by("-id", "-Noti_date")
        serializer = DNotificationsSerializer(noti, many=True)
        return Response(
            {"status": True, "notifications": serializer.data},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_checkDistributorPaymentTerms(request, id):
    try:
        s_id = id
        data = Fin_Login_Details.objects.get(id=s_id)
        com = Fin_Distributors_Details.objects.get(Login_Id=s_id)
        payment_request = Fin_Payment_Terms_updation.objects.filter(
            Login_Id=com.Login_Id, status="New"
        ).exists()

        title2 = ["Modules Updated..!", "New Plan Activated..!", "Change Payment Terms"]
        today_date = date.today()
        notification = Fin_DNotification.objects.filter(
            status="New", Distributor_id=com, Title__in=title2, Noti_date__lt=today_date
        )
        notification.update(status="old")

        diff = (com.End_date - today_date).days

        # payment term and trial period alert notifications for notification page
        dis_name = com.Login_Id.First_name + "  " + com.Login_Id.Last_name
        if (
            not Fin_DNotification.objects.filter(
                Login_Id=com.Login_Id,
                Distributor_id=com,
                Title="Payment Terms Alert",
                status="New",
            ).exists()
            and diff <= 20
        ):
            n = Fin_DNotification(
                Login_Id=com.Login_Id,
                Distributor_id=com,
                Title="Payment Terms Alert",
                Discription="Your Payment Terms End Soon",
            )
            n.save()
            d = Fin_ANotification(
                Login_Id=data.Login_Id,
                Title="Payment Terms Alert",
                Discription=f"Current  payment terms of {dis_name} is expiring",
            )
            d.save()
        noti = Fin_DNotification.objects.filter(
            status="New", Distributor_id=com.id
        ).order_by("-id", "-Noti_date")
        n = len(noti)

        # Calculate the date 20 days before the end date for payment term renew and 10 days before for trial period renew
        reminder_date = com.End_date - timedelta(days=20)
        current_date = date.today()
        alert_message = current_date >= reminder_date

        # Calculate the number of days between the reminder date and end date
        days_left = (com.End_date - current_date).days
        return Response(
            {
                "status": True,
                "alert_message": alert_message,
                "endDate": com.End_date,
                "days_left": days_left,
                "payment_request": payment_request,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getModules(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        com = Fin_Company_Details.objects.get(Login_Id=data)
        modules = Fin_Modules_List.objects.get(Login_Id=data, status="New")
        module_request = Fin_Modules_List.objects.filter(
            company_id=com, status="pending"
        ).exists()
        serializer = ModulesListSerializer(modules)
        return Response(
            {
                "status": True,
                "module_request": module_request,
                "modules": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_EditModules(request):
    try:
        login_id = request.data["Login_Id"]
        data = Fin_Login_Details.objects.get(id=login_id)
        com = Fin_Company_Details.objects.get(Login_Id=data.id)

        request.data["company_id"] = com.id
        request.data["status"] = "pending"

        serializer = ModulesListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data1 = Fin_Modules_List.objects.filter(company_id=com).update(
                update_action=1
            )
            modules = Fin_Modules_List.objects.get(id=serializer.data["id"])
            if com.Registration_Type == "self":
                noti = Fin_ANotification(
                    Login_Id=data,
                    Modules_List=modules,
                    Title="Module Updation",
                    Discription=com.Company_name + " wants to update current Modules",
                )
                noti.save()
            else:
                noti = Fin_DNotification(
                    Distributor_id=com.Distributor_id,
                    Login_Id=data,
                    Modules_List=modules,
                    Title="Module Updation",
                    Discription=com.Company_name + " wants to update current Modules",
                )
                noti.save()

            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Fin_Login_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Login details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company details not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchAdminNotifications(request):
    try:
        noti = Fin_ANotification.objects.filter(status="New").order_by(
            "-id", "-Noti_date"
        )
        serializer = ANotificationsSerializer(noti, many=True)
        return Response(
            {"status": True, "notifications": serializer.data},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchDistributorNotifications(request, id):
    try:
        dist = Fin_Distributors_Details.objects.get(Login_Id=id)
        noti = Fin_DNotification.objects.filter(
            Distributor_id=dist, status="New"
        ).order_by("-id", "-Noti_date")
        serializer = DNotificationsSerializer(noti, many=True)
        return Response(
            {"status": True, "notifications": serializer.data},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getAdminNotificationOverview(request, id):
    try:
        data = Fin_ANotification.objects.get(id=id)
        if data.Login_Id.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=data.Login_Id)
            modules = Fin_Modules_List.objects.get(company_id=com, status="New")
            serializer = ModulesListSerializer(modules)
            req = {
                "id": data.id,
                "user": "Company",
                "name": com.Company_name,
                "email": com.Email,
                "code": com.Company_Code,
                "contact": com.Contact,
                "username": com.Login_Id.User_name,
                "image": com.Image.url if com.Image else "",
                "endDate": com.End_date,
                "termUpdation": True if data.PaymentTerms_updation else False,
                "moduleUpdation": True if data.Modules_List else False,
                "term": (
                    str(com.Payment_Term.payment_terms_number)
                    + " "
                    + com.Payment_Term.payment_terms_value
                    if com.Payment_Term
                    else "Trial Period"
                ),
                "newTerm": (
                    str(data.PaymentTerms_updation.Payment_Term.payment_terms_number)
                    + " "
                    + data.PaymentTerms_updation.Payment_Term.payment_terms_value
                    if data.PaymentTerms_updation
                    else ""
                ),
            }
            if data.Modules_List:
                modules_pending = Fin_Modules_List.objects.filter(
                    Login_Id=data.Login_Id, status="pending"
                )
                current_modules = Fin_Modules_List.objects.filter(
                    Login_Id=data.Login_Id, status="New"
                )

                # Extract the field names related to modules
                module_fields = [
                    field.name
                    for field in Fin_Modules_List._meta.fields
                    if field.name
                    not in [
                        "id",
                        "company",
                        "status",
                        "update_action",
                        "company_id",
                        "Login_Id",
                    ]
                ]

                # Get the previous and new values for the selected modules
                previous_values = current_modules.values(*module_fields).first()
                new_values = modules_pending.values(*module_fields).first()

                # Iterate through the dictionary and replace None with 0
                for key, value in previous_values.items():
                    if value is None:
                        previous_values[key] = 0

                # Iterate through the dictionary and replace None with 0
                for key, value in new_values.items():
                    if value is None:
                        new_values[key] = 0

                # Identify added and deducted modules
                added_modules = {}
                deducted_modules = {}

                for field in module_fields:
                    if new_values[field] > previous_values[field]:
                        added_modules[field] = (
                            new_values[field] - previous_values[field]
                        )
                    elif new_values[field] < previous_values[field]:
                        deducted_modules[field] = (
                            previous_values[field] - new_values[field]
                        )

                return Response(
                    {
                        "status": True,
                        "data": req,
                        "modules": serializer.data,
                        "added_modules": added_modules,
                        "deducted_modules": deducted_modules,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"status": True, "data": req}, status=status.HTTP_200_OK
                )
        else:
            com = Fin_Distributors_Details.objects.get(Login_Id=data.Login_Id)
            req = {
                "id": data.id,
                "user": "Distributor",
                "name": com.Login_Id.First_name + " " + com.Login_Id.Last_name,
                "email": com.Email,
                "code": com.Distributor_Code,
                "contact": com.Contact,
                "username": com.Login_Id.User_name,
                "image": com.Image.url if com.Image else "",
                "endDate": com.End_date,
                "termUpdation": True if data.PaymentTerms_updation else False,
                "moduleUpdation": False,
                "term": (
                    str(com.Payment_Term.payment_terms_number)
                    + " "
                    + com.Payment_Term.payment_terms_value
                    if com.Payment_Term
                    else "Trial Period"
                ),
                "newTerm": (
                    str(data.PaymentTerms_updation.Payment_Term.payment_terms_number)
                    + " "
                    + data.PaymentTerms_updation.Payment_Term.payment_terms_value
                    if data.PaymentTerms_updation
                    else ""
                ),
            }
            return Response({"status": True, "data": req}, status=status.HTTP_200_OK)
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_Module_Updation_Accept(request):
    try:
        id = request.data["id"]
        data = Fin_ANotification.objects.get(id=id)
        allmodules = Fin_Modules_List.objects.get(Login_Id=data.Login_Id, status="New")
        allmodules.delete()

        allmodules1 = Fin_Modules_List.objects.get(
            Login_Id=data.Login_Id, status="pending"
        )
        allmodules1.status = "New"
        allmodules1.save()

        data.status = "old"
        data.save()

        # notification
        Fin_CNotification.objects.create(
            Login_Id=allmodules1.Login_Id,
            Company_id=allmodules1.company_id,
            Title="Modules Updated..!",
            Discription="Your module update request is approved",
        )

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_Module_Updation_Reject(request):
    try:
        id = request.data["id"]
        data = Fin_ANotification.objects.get(id=id)
        allmodules = Fin_Modules_List.objects.get(
            Login_Id=data.Login_Id, status="pending"
        )
        allmodules.delete()

        data.delete()

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getDistributorNotificationOverview(request, id):
    try:
        data = Fin_DNotification.objects.get(id=id)
        com = Fin_Company_Details.objects.get(Login_Id=data.Login_Id)
        modules = Fin_Modules_List.objects.get(company_id=com, status="New")
        serializer = ModulesListSerializer(modules)
        req = {
            "id": data.id,
            "user": "Company",
            "name": com.Company_name,
            "email": com.Email,
            "code": com.Company_Code,
            "contact": com.Contact,
            "username": com.Login_Id.User_name,
            "image": com.Image.url if com.Image else None,
            "endDate": com.End_date,
            "termUpdation": True if data.PaymentTerms_updation else False,
            "moduleUpdation": True if data.Modules_List else False,
            "term": (
                str(com.Payment_Term.payment_terms_number)
                + " "
                + com.Payment_Term.payment_terms_value
                if com.Payment_Term
                else "Trial Period"
            ),
            "newTerm": (
                str(data.PaymentTerms_updation.Payment_Term.payment_terms_number)
                + " "
                + data.PaymentTerms_updation.Payment_Term.payment_terms_value
                if data.PaymentTerms_updation
                else ""
            ),
        }
        if data.Modules_List:
            modules_pending = Fin_Modules_List.objects.filter(
                Login_Id=data.Login_Id, status="pending"
            )
            current_modules = Fin_Modules_List.objects.filter(
                Login_Id=data.Login_Id, status="New"
            )

            # Extract the field names related to modules
            module_fields = [
                field.name
                for field in Fin_Modules_List._meta.fields
                if field.name
                not in [
                    "id",
                    "company",
                    "status",
                    "update_action",
                    "company_id",
                    "Login_Id",
                ]
            ]

            # Get the previous and new values for the selected modules
            previous_values = current_modules.values(*module_fields).first()
            new_values = modules_pending.values(*module_fields).first()

            # Iterate through the dictionary and replace None with 0
            for key, value in previous_values.items():
                if value is None:
                    previous_values[key] = 0

            # Iterate through the dictionary and replace None with 0
            for key, value in new_values.items():
                if value is None:
                    new_values[key] = 0

            # Identify added and deducted modules
            added_modules = {}
            deducted_modules = {}

            for field in module_fields:
                if new_values[field] > previous_values[field]:
                    added_modules[field] = new_values[field] - previous_values[field]
                elif new_values[field] < previous_values[field]:
                    deducted_modules[field] = previous_values[field] - new_values[field]

            return Response(
                {
                    "status": True,
                    "data": req,
                    "modules": serializer.data,
                    "added_modules": added_modules,
                    "deducted_modules": deducted_modules,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({"status": True, "data": req}, status=status.HTTP_200_OK)
    except Fin_Company_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Company not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Fin_Distributors_Details.DoesNotExist:
        return Response(
            {"status": False, "message": "Distributor not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_DModule_Updation_Accept(request):
    try:
        id = request.data["id"]
        data = Fin_DNotification.objects.get(id=id)
        allmodules = Fin_Modules_List.objects.get(Login_Id=data.Login_Id, status="New")
        allmodules.delete()

        allmodules1 = Fin_Modules_List.objects.get(
            Login_Id=data.Login_Id, status="pending"
        )
        allmodules1.status = "New"
        allmodules1.save()

        data.status = "old"
        data.save()

        # notification
        Fin_CNotification.objects.create(
            Login_Id=allmodules1.Login_Id,
            Company_id=allmodules1.company_id,
            Title="Modules Updated..!",
            Discription="Your module update request is approved",
        )

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_DModule_Updation_Reject(request):
    try:
        id = request.data["id"]
        data = Fin_DNotification.objects.get(id=id)
        allmodules = Fin_Modules_List.objects.get(
            Login_Id=data.Login_Id, status="pending"
        )
        allmodules.delete()

        data.delete()

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ITEMS
@api_view(("GET",))
def Fin_getCompanyItemUnits(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = id).company_id
        units = Fin_Units.objects.filter(Company=cmp)
        serializer = ItemUnitSerializer(units, many=True)
        return Response(
            {"status": True, "units": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_getCompanyAccounts(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = id).company_id
        acc = Fin_Chart_Of_Account.objects.filter(
            Q(account_type="Expense")
            | Q(account_type="Other Expense")
            | Q(account_type="Cost Of Goods Sold"),
            Company=cmp,
        ).order_by("account_name")
        serializer = AccountsSerializer(acc, many=True)
        return Response(
            {"status": True, "accounts": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_createNewItem(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        createdDate = date.today()
        if request.data["item_type"] == "Goods":
            request.data["sac"] = None
        else:
            request.data["hsn"] = None
        request.data["intra_state_tax"] = (
            0
            if request.data["tax_reference"] == "non taxable"
            else request.data["intra_state_tax"]
        )
        request.data["inter_state_tax"] = (
            0
            if request.data["tax_reference"] == "non taxable"
            else request.data["inter_state_tax"]
        )
        request.data["sales_account"] = (
            None
            if request.data["sales_account"] == ""
            else request.data["sales_account"]
        )
        request.data["purchase_account"] = (
            None
            if request.data["purchase_account"] == ""
            else request.data["purchase_account"]
        )
        request.data["created_date"] = createdDate

        # save item and transaction if item or hsn doesn't exists already
        if Fin_Items.objects.filter(
            Company=com, name__iexact=request.data["name"]
        ).exists():
            return Response({"status": False, "message": "Item Name already exists"})
        elif Fin_Items.objects.filter(
            Q(Company=com) & (Q(hsn__iexact=request.data["hsn"]) & Q(hsn__isnull=False))
        ).exists():
            return Response({"status": False, "message": "HSN already exists"})
        elif Fin_Items.objects.filter(
            Q(Company=com) & (Q(sac__iexact=request.data["sac"]) & Q(sac__isnull=False))
        ).exists():
            return Response({"status": False, "message": "SAC already exists"})
        else:
            request.data["Company"] = com.id
            request.data["LoginDetails"] = com.Login_Id.id
            serializer = ItemSerializer(data=request.data)
            if serializer.is_valid():
                # save transaction
                serializer.save()

                Fin_Items_Transaction_History.objects.create(
                    Company=com,
                    LoginDetails=data,
                    item=Fin_Items.objects.get(id=serializer.data["id"]),
                    action="Created",
                )

                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_createNewUnit(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id
        request.data["Company"] = com.id
        serializer = ItemUnitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": True, "data": serializer.data},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchItems(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        items = Fin_Items.objects.filter(Company=com)
        serializer = ItemSerializer(items, many=True)
        return Response(
            {"status": True, "items": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchItemDetails(request, id):
    try:
        item = Fin_Items.objects.get(id=id)
        hist = Fin_Items_Transaction_History.objects.filter(item=item).last()
        his = None
        if hist:
            his = {
                "action": hist.action,
                "date": hist.date,
                "doneBy": hist.LoginDetails.First_name
                + " "
                + hist.LoginDetails.Last_name,
            }
        cmt = Fin_Items_Comments.objects.filter(item=item)
        itemSerializer = ItemSerializer(item)
        commentsSerializer = ItemCommentsSerializer(cmt, many=True)
        return Response(
            {
                "status": True,
                "item": itemSerializer.data,
                "history": his,
                "comments": commentsSerializer.data,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchItemHistory(request, id):
    try:
        item = Fin_Items.objects.get(id=id)
        hist = Fin_Items_Transaction_History.objects.filter(item=item)
        his = []
        if hist:
            for i in hist:
                h = {
                    "action": i.action,
                    "date": i.date,
                    "name": i.LoginDetails.First_name + " " + i.LoginDetails.Last_name,
                }
                his.append(h)
        itemSerializer = ItemSerializer(item)
        return Response(
            {"status": True, "item": itemSerializer.data, "history": his},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_deleteItem(request, id):
    try:
        item = Fin_Items.objects.get(id=id)
        item.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("DELETE",))
def Fin_deleteItemComment(request, id):
    try:
        cmt = Fin_Items_Comments.objects.get(id=id)
        cmt.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_changeItemStatus(request):
    try:
        itemId = request.data["id"]
        data = Fin_Items.objects.get(id=itemId)
        data.status = request.data["status"]
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_addItemComment(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        request.data["Company"] = com.id
        serializer = ItemCommentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_itemTransactionPdf(request, itemId, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        item = Fin_Items.objects.get(id=itemId)
        stock = int(item.current_stock)
        rate = float(item.stock_unit_rate)
        stockValue = float(stock * rate)

        transactions = []

        context = {"item": item, "stockValue": stockValue, "transactions": transactions}

        template_path = "company/Fin_Item_Transaction_Pdf.html"
        fname = "Item_transactions_" + item.name
        # return render(request, 'company/Fin_Item_Transaction_Pdf.html',context)
        # Create a Django response object, and specify content_type as pdftemp_
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename = {fname}.pdf"
        # find the template and render it.
        template = get_template(template_path)
        html = template.render(context)

        # create a pdf
        pisa_status = pisa.CreatePDF(html, dest=response)
        # if error then show some funny view
        if pisa_status.err:
            return HttpResponse("We had some errors <pre>" + html + "</pre>")
        return response
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_shareItemTransactionsToEmail(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        itemId = request.data["itemId"]
        item = Fin_Items.objects.get(id=itemId)
        emails_string = request.data["email_ids"]

        # Split the string by commas and remove any leading or trailing whitespace
        emails_list = [email.strip() for email in emails_string.split(",")]
        email_message = request.data["email_message"]
        # print(emails_list)

        stock = int(item.current_stock)
        rate = float(item.stock_unit_rate)
        stockValue = float(stock * rate)

        transactions = []

        context = {"item": item, "stockValue": stockValue, "transactions": transactions}
        template_path = "company/Fin_Item_Transaction_Pdf.html"
        template = get_template(template_path)

        html = template.render(context)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        pdf = result.getvalue()
        filename = f"Item_transactions-{item.name}.pdf"
        subject = f"Item_transactions_{item.name}"
        email = EmailMessage(
            subject,
            f"Hi,\nPlease find the attached Transaction details - ITEM-{item.name}. \n{email_message}\n\n--\nRegards,\n{com.Company_name}\n{com.Address}\n{com.State} - {com.Country}\n{com.Contact}",
            from_email=settings.EMAIL_HOST_USER,
            to=emails_list,
        )
        email.attach(filename, pdf, "application/pdf")
        email.send(fail_silently=False)

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_checkAccounts(request):
    try:
        s_id = request.GET["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        if Fin_Chart_Of_Account.objects.filter(
            Company=com, account_type=request.GET["type"]
        ).exists():
            list = []
            account_objects = Fin_Chart_Of_Account.objects.filter(
                Company=com, account_type=request.GET["type"]
            )

            for account in account_objects:
                accounts = {
                    "name": account.account_name,
                }
                list.append(accounts)

            return Response(
                {"status": True, "accounts": list}, status=status.HTTP_200_OK
            )
        else:
            return Response({"status": False})
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_createNewAccountFromItems(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        createdDate = date.today()
        request.data["Company"] = com.id
        request.data["LoginDetails"] = com.Login_Id.id
        request.data["parent_account"] = (
            request.data["parent_account"]
            if request.data["sub_account"] == True
            else None
        )
        request.data["balance"] = 0.0
        request.data["balance_type"] = None
        request.data["credit_card_no"] = None
        request.data["bank_account_no"] = None
        request.data["date"] = createdDate
        request.data["create_status"] = "added"
        request.data["status"] = "active"

        # save account and transaction if account doesn't exists already
        if Fin_Chart_Of_Account.objects.filter(
            Company=com, account_name__iexact=request.data["account_name"]
        ).exists():
            return Response(
                {"status": False, "message": "Account Name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = AccountsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                # save transaction

                Fin_ChartOfAccount_History.objects.create(
                    Company=com,
                    LoginDetails=data,
                    account=Fin_Chart_Of_Account.objects.get(id=serializer.data["id"]),
                    action="Created",
                )
                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(("GET",))
def minStock(request, id):
    try:
        s_id = id
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type != 'Distributor':
            if data.User_Type == "Company":
                com = Fin_Company_Details.objects.get(Login_Id = s_id)
            elif data.User_Type == 'Staff':
                com = Fin_Staff_Details.objects.get(Login_Id = s_id).company_id
            
            itemsAvailable = Fin_Items.objects.filter(Company = com)

            if Fin_CNotification.objects.filter(Company_id=com, Item__isnull=False).exists():
                alertItems = Fin_CNotification.objects.filter(Company_id=com, Item__isnull=False)
                for item in alertItems:
                    stockItem = Fin_Items.objects.get(id = item.Item.id)
                    if stockItem.current_stock > stockItem.min_stock:
                        item.status = 'Old'
                        item.save()
                    else:
                        item.status = 'New'
                        item.save()
                
                for itm in itemsAvailable:
                    if not Fin_CNotification.objects.filter(Item = itm).exists():
                        if itm.min_stock > 0 and itm.current_stock < itm.min_stock:
                            Fin_CNotification.objects.create(Company_id = com, Login_Id = data, Item = itm, Title = 'Stock Alert.!!', Discription = f'{itm.name} is below the minimum stock threshold..')

            else:
                for itm in itemsAvailable:
                    if itm.min_stock > 0 and itm.current_stock < itm.min_stock:
                        Fin_CNotification.objects.create(Company_id = com, Login_Id = data, Item = itm, Title = 'Stock Alert.!!', Discription = f'{itm.name} is below the minimum stock threshold..')
            
            stockLow = Fin_CNotification.objects.filter(Company_id = com, Item__isnull=False, status = 'New')
            nCount = Fin_CNotification.objects.filter(Company_id = com, status = 'New')
            if stockLow:
                serializer = CNotificationsSerializer(stockLow, many=True)
                return Response(
                    {"status": True, "minStockAlerts": serializer.data, 'count':len(nCount)},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"status": True, "minStockAlerts": None, 'count':len(nCount)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response({"status": False},status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("PUT",))
def Fin_updateItem(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id
        
        item = Fin_Items.objects.get(id=request.data['itemId'])
        if request.data["item_type"] == "Goods":
            request.data["sac"] = None
        else:
            request.data["hsn"] = None
        request.data["intra_state_tax"] = (
            0
            if request.data["tax_reference"] == "non taxable"
            else request.data["intra_state_tax"]
        )
        request.data["inter_state_tax"] = (
            0
            if request.data["tax_reference"] == "non taxable"
            else request.data["inter_state_tax"]
        )
        request.data["sales_account"] = (
            None
            if request.data["sales_account"] == ""
            else request.data["sales_account"]
        )
        request.data["purchase_account"] = (
            None
            if request.data["purchase_account"] == ""
            else request.data["purchase_account"]
        )

        #save item and transaction if item or hsn doesn't exists already
        name = request.data['name']
        hsn = request.data['hsn']
        sac = request.data['sac']
        
        if item.name != name and Fin_Items.objects.filter(Company=com, name__iexact=name).exists():
            return Response({'status':False, 'message':'Item Name exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if item.hsn and hsn != None:
            if int(item.hsn) != int(hsn) and Fin_Items.objects.filter(Company = com, hsn__iexact=hsn).exists():
                return Response({'status':False, 'message':'HSN Code Exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if item.sac and sac != None:
            if int(item.sac) != int(sac) and Fin_Items.objects.filter(Company = com, sac__iexact=sac).exists():
                return Response({'status':False, 'message':'SAC Code Exists'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ItemSerializer(item,data=request.data)
        if serializer.is_valid():
            stock = item.opening_stock if request.data['opening_stock'] == "" else request.data['opening_stock']
            oldOpen = int(item.opening_stock)
            newOpen = int(stock)
            diff = abs(oldOpen - newOpen)
            if item.opening_stock != int(stock) and oldOpen > newOpen:
                request.data['current_stock'] = item.current_stock - diff
            elif item.opening_stock != int(stock) and oldOpen < newOpen:
                request.data['current_stock'] = item.current_stock + diff

            # save transaction
            serializer.save()

            Fin_Items_Transaction_History.objects.create(
                Company=com,
                LoginDetails=data,
                item=Fin_Items.objects.get(id=serializer.data["id"]),
                action="Edited",
            )

            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Customers
@api_view(("GET",))
def Fin_fetchCustomers(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        customers = Fin_Customers.objects.filter(Company=com)
        serializer = CustomerSerializer(customers, many=True)
        return Response(
            {"status": True, "customers": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_getCompanyPaymentTerms(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = id).company_id
        pTerms = Fin_Company_Payment_Terms.objects.filter(Company=cmp)
        serializer = CompanyPaymentTermsSerializer(pTerms, many=True)
        return Response(
            {"status": True, "terms": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(("GET",))
def Fin_getSalesPriceLists(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = id).company_id
        lists = Fin_Price_List.objects.filter(Company=cmp)
        serializer = PriceListSerializer(lists, many=True)
        return Response(
            {"status": True, "salesPriceLists": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_createNewCompanyPaymentTerm(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id
        request.data["Company"] = com.id
        if not Fin_Company_Payment_Terms.objects.filter(Company = com, term_name__iexact = request.data['term_name']).exists():
            serializer = CompanyPaymentTermsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"status": True, "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"status": False, "message": 'Term name exists'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_checkGstIn(request):
    try:
        data = Fin_Login_Details.objects.get(id=request.GET['Id'])
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=data)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = data).company_id
        
        gstIn = request.GET['gstin']
        if Fin_Customers.objects.filter(Company = cmp, gstin__iexact = gstIn).exists():
            return Response({'is_exist':True, 'message':f'{gstIn} already exists, Try another.!'})
        else:
            return Response({'is_exist':False})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_checkPan(request):
    try:
        data = Fin_Login_Details.objects.get(id=request.GET['Id'])
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=data)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = data).company_id
        
        pan = request.GET['pan']
        if Fin_Customers.objects.filter(Company = cmp, pan_no__iexact = pan).exists():
            return Response({'is_exist':True, 'message':f'{pan} already exists, Try another.!'})
        else:
            return Response({'is_exist':False})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_checkPhone(request):
    try:
        data = Fin_Login_Details.objects.get(id=request.GET['Id'])
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=data)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = data).company_id
        
        phn = request.GET['phone']
        if Fin_Customers.objects.filter(Company = cmp, mobile__iexact = phn).exists():
            return Response({'is_exist':True, 'message':f'{phn} already exists, Try another.!'})
        else:
            return Response({'is_exist':False})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_checkEmail(request):
    try:
        data = Fin_Login_Details.objects.get(id=request.GET['Id'])
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=data)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = data).company_id
        
        eml = request.GET['email']
        if Fin_Customers.objects.filter(Company = cmp, email__iexact = eml).exists():
            return Response({'is_exist':True, 'message':f'{eml} already exists, Try another.!'})
        else:
            return Response({'is_exist':False})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_checkCustomerName(request):
    try:
        data = Fin_Login_Details.objects.get(id=request.GET['Id'])
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=data)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = data).company_id
        
        fName = request.GET['fName']
        lName = request.GET['lName']

        if Fin_Customers.objects.filter(Company = cmp, first_name__iexact = fName, last_name__iexact = lName).exists():
            msg = f'{fName} {lName} already exists, Try another.!'
            return Response({'is_exist':True, 'message':msg})
        else:
            return Response({'is_exist':False})
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("POST",))
def Fin_createNewCustomer(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        fName = request.data['first_name']
        lName = request.data['last_name']
        gstIn = request.data['gstin']
        pan = request.data['pan_no']
        email = request.data['email']
        phn = request.data['mobile']

        if Fin_Customers.objects.filter(Company = com, first_name__iexact = fName, last_name__iexact = lName).exists():
            return Response({"status": False, "message": f"Customer `{fName} {lName}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif Fin_Customers.objects.filter(Company = com, gstin__iexact = gstIn).exists():
            return Response({"status": False, "message": f"GSTIN `{gstIn}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif Fin_Customers.objects.filter(Company = com, pan_no__iexact = pan).exists():
            return Response({"status": False, "message": f"PAN No `{pan}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif Fin_Customers.objects.filter(Company = com, mobile__iexact = phn).exists():
            return Response({"status": False, "message": f"Phone Number `{phn}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif Fin_Customers.objects.filter(Company = com, email__iexact = email).exists():
            return Response({"status": False, "message": f"Email `{email}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            request.data["Company"] = com.id
            request.data["LoginDetails"] = com.Login_Id.id
            request.data['gstin'] = None if request.data['gst_type'] == "Unregistered Business" or request.data['gst_type'] == 'Overseas' or request.data['gst_type'] == 'Consumer' else request.data['gstin']
            request.data['price_list'] = None if request.data['price_list'] ==  "" else request.data['price_list']
            request.data['payment_terms'] = None if request.data['payment_terms'] == "" else request.data['payment_terms']
            request.data['opening_balance'] = 0 if request.data['opening_balance'] == "" else float(request.data['opening_balance'])
            request.data['current_balance'] = 0 if request.data['opening_balance'] == "" else float(request.data['opening_balance'])
            request.data['credit_limit'] = 0 if request.data['credit_limit'] == "" else float(request.data['credit_limit'])

            serializer = CustomerSerializer(data=request.data)
            if serializer.is_valid():
                # save transaction
                serializer.save()

                Fin_Customers_History.objects.create(
                    Company = com,
                    LoginDetails = data,
                    customer = Fin_Customers.objects.get(id=serializer.data['id']),
                    action = 'Created'
                )

                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_addCustomerComment(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        request.data["Company"] = com.id
        serializer = CustomerCommentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("DELETE",))
def Fin_deleteCustomerComment(request, id):
    try:
        cmt = Fin_Customers_Comments.objects.get(id=id)
        cmt.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(("GET",))
def Fin_fetchCustomerDetails(request, id):
    try:
        cust = Fin_Customers.objects.get(id=id)
        hist = Fin_Customers_History.objects.filter(customer=cust).last()
        his = None
        if hist:
            his = {
                "action": hist.action,
                "date": hist.date,
                "doneBy": hist.LoginDetails.First_name
                + " "
                + hist.LoginDetails.Last_name,
            }
        cmt = Fin_Customers_Comments.objects.filter(customer=cust)
        customerSerializer = CustomerSerializer(cust)
        commentsSerializer = CustomerCommentsSerializer(cmt, many=True)
        extObj = {
            'paymentTerms': cust.payment_terms.term_name if cust.payment_terms else 'Nill',
            'priceList': cust.price_list.name if cust.price_list else 'Nill'
        }
        return Response(
            {
                "status": True,
                "customer": customerSerializer.data,
                "history": his,
                "comments": commentsSerializer.data,
                "extraDetails": extObj
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_changeCustomerStatus(request):
    try:
        custId = request.data["id"]
        data = Fin_Customers.objects.get(id=custId)
        data.status = request.data["status"]
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_fetchCustomerHistory(request, id):
    try:
        cust = Fin_Customers.objects.get(id=id)
        hist = Fin_Customers_History.objects.filter(customer=cust)
        his = []
        if hist:
            for i in hist:
                h = {
                    "action": i.action,
                    "date": i.date,
                    "name": i.LoginDetails.First_name + " " + i.LoginDetails.Last_name,
                }
                his.append(h)
        customerSerializer = CustomerSerializer(cust)
        return Response(
            {"status": True, "customer": customerSerializer.data, "history": his},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("DELETE",))
def Fin_deleteCustomer(request, id):
    try:
        cust = Fin_Customers.objects.get(id=id)
        cust.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_customerTransactionPdf(request):
    try:
        id = request.GET['Id']
        custId = request.GET['c_id']

        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        cust = Fin_Customers.objects.get(id=custId)
        context = {"customer": cust}

        template_path = "company/Fin_Customer_Transaction_Pdf.html"
        fname = "Customer_transaction_" + cust.first_name
        # Create a Django response object, and specify content_type as pdftemp_
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename = {fname}.pdf"
        # find the template and render it.
        template = get_template(template_path)
        html = template.render(context)

        # create a pdf
        pisa_status = pisa.CreatePDF(html, dest=response)
        # if error then show some funny view
        if pisa_status.err:
            return HttpResponse("We had some errors <pre>" + html + "</pre>")
        return response
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_shareCustomerTransactionsToEmail(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        custId = request.data["c_id"]
        cust = Fin_Customers.objects.get(id=custId)
        emails_string = request.data["email_ids"]

        # Split the string by commas and remove any leading or trailing whitespace
        emails_list = [email.strip() for email in emails_string.split(",")]
        email_message = request.data["email_message"]
        # print(emails_list)

        context = {"customer": cust}
        template_path = "company/Fin_Customer_Transaction_Pdf.html"
        template = get_template(template_path)

        html = template.render(context)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        pdf = result.getvalue()
        filename = f"Customer_transactions-{cust.first_name}.pdf"
        subject = f"Customer_transactions_{cust.first_name}"
        email = EmailMessage(
            subject,
            f"Hi,\nPlease find the attached Transaction details - Customer-{cust.first_name}. \n{email_message}\n\n--\nRegards,\n{com.Company_name}\n{com.Address}\n{com.State} - {com.Country}\n{com.Contact}",
            from_email=settings.EMAIL_HOST_USER,
            to=emails_list,
        )
        email.attach(filename, pdf, "application/pdf")
        email.send(fail_silently=False)

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(("PUT",))
def Fin_updateCustomer(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        cust = Fin_Customers.objects.get(id=request.data['c_id'])
        fName = request.data['first_name']
        lName = request.data['last_name']
        gstIn = request.data['gstin']
        pan = request.data['pan_no']
        email = request.data['email']
        phn = request.data['mobile']

        if cust.first_name != fName and cust.last_name != lName and Fin_Customers.objects.filter(Company = com, first_name__iexact = fName, last_name__iexact = lName).exists():
            return Response({"status": False, "message": f"Customer `{fName} {lName}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif cust.gstin != gstIn and Fin_Customers.objects.filter(Company = com, gstin__iexact = gstIn).exists():
            return Response({"status": False, "message": f"GSTIN `{gstIn}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif cust.pan_no != pan and Fin_Customers.objects.filter(Company = com, pan_no__iexact = pan).exists():
            return Response({"status": False, "message": f"PAN No `{pan}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif cust.mobile != phn and Fin_Customers.objects.filter(Company = com, mobile__iexact = phn).exists():
            return Response({"status": False, "message": f"Phone Number `{phn}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        elif cust.email != email and Fin_Customers.objects.filter(Company = com, email__iexact = email).exists():
            return Response({"status": False, "message": f"Email `{email}` already exists, try another!"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            request.data['gstin'] = None if request.data['gst_type'] == "Unregistered Business" or request.data['gst_type'] == 'Overseas' or request.data['gst_type'] == 'Consumer' else request.data['gstin']
            request.data['price_list'] = None if request.data['price_list'] ==  "" else request.data['price_list']
            request.data['payment_terms'] = None if request.data['payment_terms'] == "" else request.data['payment_terms']
            request.data['opening_balance'] = 0 if request.data['opening_balance'] == "" else float(request.data['opening_balance'])
            request.data['current_balance'] = 0 if request.data['opening_balance'] == "" else float(request.data['opening_balance'])
            request.data['credit_limit'] = 0 if request.data['credit_limit'] == "" else float(request.data['credit_limit'])

            serializer = CustomerSerializer(cust,data=request.data)
            if serializer.is_valid():
                # save transaction
                serializer.save()

                Fin_Customers_History.objects.create(
                    Company = com,
                    LoginDetails = data,
                    customer = Fin_Customers.objects.get(id=serializer.data['id']),
                    action = 'Edited'
                )

                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def custCreditLimitAlerts(request, id):
    try:
        s_id = id
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type != 'Distributor':
            if data.User_Type == "Company":
                com = Fin_Company_Details.objects.get(Login_Id = s_id)
            elif data.User_Type == 'Staff':
                com = Fin_Staff_Details.objects.get(Login_Id = s_id).company_id
            
            customers = Fin_Customers.objects.filter(Company = com)

            if Fin_CNotification.objects.filter(Company_id=com, Customers__isnull=False).exists():
                alertItems = Fin_CNotification.objects.filter(Company_id=com, Customers__isnull=False)
                for c in alertItems:
                    cust = Fin_Customers.objects.get(id = c.Customers.id)
                    if cust.credit_limit > 0 and cust.credit_limit > cust.current_balance:
                        c.status = 'Old'
                        c.save()
                    else:
                        c.status = 'New'
                        c.save()
                
                for itm in customers:
                    if not Fin_CNotification.objects.filter(Customers = itm).exists():
                        if itm.credit_limit > 0 and itm.current_balance > itm.credit_limit:
                            Fin_CNotification.objects.create(Company_id = com, Login_Id = data, Customers = itm, Title = 'Customer Credit Limit Alert.!!', Discription = f'{itm.first_name} {itm.last_name} has been exceeded the credit limit..')

            else:
                for itm in customers:
                    if itm.credit_limit > 0 and itm.current_balance > itm.credit_limit:
                        Fin_CNotification.objects.create(Company_id = com, Login_Id = data, Customers = itm, Title = 'Customer Credit Limit Alert.!!', Discription = f'{itm.first_name} {itm.last_name} has been exceeded the credit limit..')
            
            custCreditLimit = Fin_CNotification.objects.filter(Company_id = com, Customers__isnull=False, status = 'New')
            nCount = Fin_CNotification.objects.filter(Company_id = com, status = 'New')
            if custCreditLimit:
                serializer = CNotificationsSerializer(custCreditLimit, many=True)
                return Response(
                    {"status": True, "custCreditLimit": serializer.data, 'count':len(nCount)},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"status": True, "custCreditLimit": None, 'count':len(nCount)},
                    status=status.HTTP_200_OK,
                )
        else:
            return Response({"status": False},status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Price Lists
@api_view(("GET",))
def Fin_getNewPriceListItems(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == 'Company':
            cmp = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            cmp = Fin_Staff_Details.objects.get(Login_Id = id).company_id
        
        items = Fin_Items.objects.filter(Company = cmp, status = 'Active').order_by('name')
        serializer = ItemSerializer(items, many=True)
        return Response(
            {"status": True, "items": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_createNewPriceList(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        name = request.data['name']
        if Fin_Price_List.objects.filter(Company = com, name__iexact = name).exists():
            return Response({'status':False,'message':f'{name} already exists, try another'})
        else:
            request.data['LoginDetails'] = data.id
            request.data['Company'] = com.id

            itmRt = request.data['item_rate']

            serializer = PriceListSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                priceList = Fin_Price_List.objects.get(id=serializer.data['id'])

                if itmRt == 'Customized individual rate':
                    items = request.data['list_items']
                    for i in items:

                        itemId = i.get('id')
                        stdRate = i.get('salesRate') if request.data['type'] == 'Sales' else i.get('purchaseRate')
                        customRate = 0 if i.get('customRate') == "" else i.get('customRate')
                        Fin_PriceList_Items.objects.create(Company = com, LoginDetails = data, list = priceList, item = Fin_Items.objects.get(id = itemId), standard_rate = float(stdRate), custom_rate = float(customRate))
                    
                Fin_PriceList_Transaction_History.objects.create(
                    Company = com,
                    LoginDetails = data,
                    list = priceList,
                    action = 'Created'
                )

                return Response({'status':True, 'data':serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({'status':False, 'data':serializer.errors}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(("GET",))
def Fin_fetchPriceLists(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        priceLists = Fin_Price_List.objects.filter(Company=com)
        serializer = PriceListSerializer(priceLists, many=True)
        return Response(
            {"status": True, "priceLists": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_fetchPLDetails(request, id):
    try:
        pl = Fin_Price_List.objects.get(id=id)
        plItems = Fin_PriceList_Items.objects.filter(list = pl)
        hist = Fin_PriceList_Transaction_History.objects.filter(list=pl).last()
        his = None
        plItms = []
        if hist:
            his = {
                "action": hist.action,
                "date": hist.date,
                "doneBy": hist.LoginDetails.First_name
                + " "
                + hist.LoginDetails.Last_name,
            }
        
        if plItems:
            for i in plItems:
                p = {
                    'id':i.item.id,
                    'name': i.item.name,
                    'salesRate': i.item.selling_price,
                    'purchaseRate': i.item.purchase_price,
                    'stdRate': i.standard_rate,
                    'customRate': i.custom_rate
                }
                plItms.append(p)
                
        cmt = Fin_PriceList_Comments.objects.filter(list=pl)
        plSerializer = PriceListSerializer(pl)
        commentsSerializer = PriceListCommentsSerializer(cmt, many=True)
     
        return Response(
            {
                "status": True,
                "priceList": plSerializer.data,
                "history": his,
                "comments": commentsSerializer.data,
                "items": plItms
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_changePLStatus(request):
    try:
        plId = request.data["id"]
        data = Fin_Price_List.objects.get(id=plId)
        data.status = request.data["status"]
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_addPLComment(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        request.data["Company"] = com.id
        serializer = PriceListCommentsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"status": False, "data": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("DELETE",))
def Fin_deletePLComment(request, id):
    try:
        cmt = Fin_PriceList_Comments.objects.get(id=id)
        cmt.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("DELETE",))
def Fin_deletePriceList(request, id):
    try:
        pl = Fin_Price_List.objects.get(id=id)
        pl.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_fetchPLHistory(request, id):
    try:
        pl = Fin_Price_List.objects.get(id=id)
        hist = Fin_PriceList_Transaction_History.objects.filter(list=pl)
        his = []
        if hist:
            for i in hist:
                h = {
                    "action": i.action,
                    "date": i.date,
                    "name": i.LoginDetails.First_name + " " + i.LoginDetails.Last_name,
                }
                his.append(h)
        plSerializer = PriceListSerializer(pl)
        return Response(
            {"status": True, "priceList": plSerializer.data, "history": his},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_priceListPdf(request):
    try:
        id = request.GET['Id']
        plId = request.GET['pl_id']

        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        lst = Fin_Price_List.objects.get(id=plId)
        plItems = Fin_PriceList_Items.objects.filter(list = lst)
        context = {'list': lst, 'plItems':plItems}
        
        template_path = 'company/Fin_PriceListView_Pdf.html'
        fname = 'Price_List_'+lst.name
        # Create a Django response object, and specify content_type as pdftemp_
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename = {fname}.pdf"
        # find the template and render it.
        template = get_template(template_path)
        html = template.render(context)

        # create a pdf
        pisa_status = pisa.CreatePDF(html, dest=response)
        # if error then show some funny view
        if pisa_status.err:
            return HttpResponse("We had some errors <pre>" + html + "</pre>")
        return response
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_sharePLDetailsToEmail(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        plId = request.data["pl_id"]
        lst = Fin_Price_List.objects.get(id=plId)
        plItems = Fin_PriceList_Items.objects.filter(list = lst)
        emails_string = request.data["email_ids"]

        # Split the string by commas and remove any leading or trailing whitespace
        emails_list = [email.strip() for email in emails_string.split(",")]
        email_message = request.data["email_message"]
        # print(emails_list)

        context = {'list': lst, 'plItems':plItems}
        template_path = 'company/Fin_PriceListView_Pdf.html'
        template = get_template(template_path)

        html = template.render(context)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        pdf = result.getvalue()
        filename = f'Price_list_{lst.name}.pdf'
        subject = f"Price_list_{lst.name}"
        email = EmailMessage(
            subject,
            f"Hi,\nPlease find the attached details - Price List-{lst.name}. \n{email_message}\n\n--\nRegards,\n{com.Company_name}\n{com.Address}\n{com.State} - {com.Country}\n{com.Contact}",
            from_email=settings.EMAIL_HOST_USER,
            to=emails_list,
        )
        email.attach(filename, pdf, "application/pdf")
        email.send(fail_silently=False)

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("PUT",))
def Fin_updatePriceList(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        list = Fin_Price_List.objects.get(id=request.data['pl_id'])
        name = request.data['name']
        if name != list.name and Fin_Price_List.objects.filter(Company = com, name__iexact = name).exists():
            return Response({'status':False,'message':f'{name} already exists, try another'})
        else:
            itmRt = request.data['item_rate']

            serializer = PriceListSerializer(list,data=request.data)
            if serializer.is_valid():
                serializer.save()
                priceList = Fin_Price_List.objects.get(id=serializer.data['id'])

                Fin_PriceList_Items.objects.filter(list=list).delete()
                if itmRt == 'Customized individual rate':
                    items = request.data['list_items']
                    for i in items:

                        itemId = i.get('id')
                        stdRate = i.get('salesRate') if request.data['type'] == 'Sales' else i.get('purchaseRate')
                        customRate = 0 if i.get('customRate') == "" else i.get('customRate')
                        Fin_PriceList_Items.objects.create(Company = com, LoginDetails = data, list = priceList, item = Fin_Items.objects.get(id = itemId), standard_rate = float(stdRate), custom_rate = float(customRate))
                    
                Fin_PriceList_Transaction_History.objects.create(
                    Company = com,
                    LoginDetails = data,
                    list = priceList,
                    action = 'Edited'
                )

                return Response({'status':True, 'data':serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({'status':False, 'data':serializer.errors}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# Chart of Accounts

@api_view(("GET",))
def Fin_fetchChartOfAccounts(request, id):
    try:
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        acc = Fin_Chart_Of_Account.objects.filter(Company = com)
        serializer = AccountsSerializer(acc, many=True)
        return Response(
            {"status": True, "accounts": serializer.data}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    
@api_view(("POST",))
def Fin_createNewAccount(request):
    try:
        s_id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        createdDate = date.today()
        request.data["Company"] = com.id
        request.data["LoginDetails"] = com.Login_Id.id
        request.data["parent_account"] = (
            request.data["parent_account"]
            if request.data["sub_account"] == True
            else None
        )
        request.data["bank_account_no"] = None if request.data["bank_account_no"] == "" else request.data["bank_account_no"]
        request.data["date"] = createdDate

        # save account and transaction if account doesn't exists already
        if Fin_Chart_Of_Account.objects.filter(
            Company=com, account_name__iexact=request.data["account_name"]
        ).exists():
            return Response(
                {"status": False, "message": "Account Name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = AccountsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                # save transaction

                Fin_ChartOfAccount_History.objects.create(
                    Company=com,
                    LoginDetails=data,
                    account=Fin_Chart_Of_Account.objects.get(id=serializer.data["id"]),
                    action="Created",
                )
                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_fetchAccountDetails(request, id):
    try:
        acc = Fin_Chart_Of_Account.objects.get(id=id)
        hist = Fin_ChartOfAccount_History.objects.filter(account=acc).last()
        his = None
        if hist:
            his = {
                "action": hist.action,
                "date": hist.date,
                "doneBy": hist.LoginDetails.First_name
                + " "
                + hist.LoginDetails.Last_name,
            }
        accSerializer = AccountsSerializer(acc)
        return Response(
            {
                "status": True,
                "account": accSerializer.data,
                "history": his,
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_changeAccountStatus(request):
    try:
        acId = request.data["id"]
        data = Fin_Chart_Of_Account.objects.get(id=acId)
        data.status = request.data["status"]
        data.save()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("DELETE",))
def Fin_deleteAccount(request, id):
    try:
        acc = Fin_Chart_Of_Account.objects.get(id=id)
        acc.delete()
        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_accountsPdf(request):
    try:
        id = request.GET['Id']
        acId = request.GET['ac_id']

        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        acc = Fin_Chart_Of_Account.objects.get(id=acId)
        context = {'account': acc}
        
        template_path = 'company/Fin_Account_Transaction_Pdf.html'
        fname = 'Account_transactions_'+acc.account_name
        # Create a Django response object, and specify content_type as pdftemp_
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = f"attachment; filename = {fname}.pdf"
        # find the template and render it.
        template = get_template(template_path)
        html = template.render(context)

        # create a pdf
        pisa_status = pisa.CreatePDF(html, dest=response)
        # if error then show some funny view
        if pisa_status.err:
            return HttpResponse("We had some errors <pre>" + html + "</pre>")
        return response
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("POST",))
def Fin_shareAccountTransactionsToEmail(request):
    try:
        id = request.data["Id"]
        data = Fin_Login_Details.objects.get(id=id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=id).company_id

        acId = request.data["ac_id"]
        acc = Fin_Chart_Of_Account.objects.get(id=acId)
        emails_string = request.data["email_ids"]

        # Split the string by commas and remove any leading or trailing whitespace
        emails_list = [email.strip() for email in emails_string.split(",")]
        email_message = request.data["email_message"]
        # print(emails_list)

        context = {'account': acc}
        template_path = 'company/Fin_Account_Transaction_Pdf.html'
        template = get_template(template_path)

        html = template.render(context)
        result = BytesIO()
        pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        pdf = result.getvalue()
        filename = f'Account_transactions-{acc.account_name}.pdf'
        subject = f"Account_transactions_{acc.account_name}"
        email = EmailMessage(
            subject,
            f"Hi,\nPlease find the attached Transaction details - ACCOUNT-{acc.account_name}. \n{email_message}\n\n--\nRegards,\n{com.Company_name}\n{com.Address}\n{com.State} - {com.Country}\n{com.Contact}",
            from_email=settings.EMAIL_HOST_USER,
            to=emails_list,
        )
        email.attach(filename, pdf, "application/pdf")
        email.send(fail_silently=False)

        return Response({"status": True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("GET",))
def Fin_fetchAccountHistory(request, id):
    try:
        acc = Fin_Chart_Of_Account.objects.get(id=id)
        hist = Fin_ChartOfAccount_History.objects.filter(account=acc)
        his = []
        if hist:
            for i in hist:
                h = {
                    "action": i.action,
                    "date": i.date,
                    "name": i.LoginDetails.First_name + " " + i.LoginDetails.Last_name,
                }
                his.append(h)
        accSerializer = AccountsSerializer(acc)
        return Response(
            {"status": True, "account": accSerializer.data, "history": his},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(("PUT",))
def Fin_updateAccount(request):
    try:
        s_id = request.data["Id"]
        acId = request.data['ac_id']
        acc = Fin_Chart_Of_Account.objects.get(id=acId)

        data = Fin_Login_Details.objects.get(id=s_id)
        if data.User_Type == "Company":
            com = Fin_Company_Details.objects.get(Login_Id=s_id)
        else:
            com = Fin_Staff_Details.objects.get(Login_Id=s_id).company_id

        request.data["parent_account"] = (
            request.data["parent_account"]
            if request.data["sub_account"] == True
            else None
        )
        request.data["bank_account_no"] = None if request.data["bank_account_no"] == "" else request.data["bank_account_no"]

        # save account and transaction if account doesn't exists already
        if acc.account_name != request.data['account_name'] and Fin_Chart_Of_Account.objects.filter(
            Company=com, account_name__iexact=request.data["account_name"]
        ).exists():
            return Response(
                {"status": False, "message": "Account Name already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            serializer = AccountsSerializer(acc,data=request.data)
            if serializer.is_valid():
                serializer.save()
                # save transaction

                Fin_ChartOfAccount_History.objects.create(
                    Company=com,
                    LoginDetails=data,
                    account = acc,
                    action="Edited",
                )
                return Response(
                    {"status": True, "data": serializer.data}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"status": False, "data": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    except Exception as e:
        return Response(
            {"status": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )