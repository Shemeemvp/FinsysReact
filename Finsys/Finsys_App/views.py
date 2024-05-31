from django.shortcuts import render
from Finsys_App.models import *
from django.http import HttpResponse, JsonResponse
from .serializers import *
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
import json
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
import random
import string

# Create your views here.

@api_view(('POST',))
def Fin_companyReg_action(request):
   if request.method == 'POST':
        if Fin_Login_Details.objects.filter(User_name=request.data['User_name']).exists():
            return Response({'status':False, 'message':'This username already exists. Sign up again'}, status=status.HTTP_400_BAD_REQUEST)
        elif Fin_Company_Details.objects.filter(Email=request.data['Email']).exists():
            return Response({'status':False, 'message':'This email already exists. Sign up again'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            request.data['User_Type'] = 'Company'

            serializer = LoginDetailsSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                loginId = Fin_Login_Details.objects.get(id = serializer.data['id']).id
                
                code_length = 8
                characters = string.ascii_letters + string.digits  # Letters and numbers

                while True:
                    unique_code = ''.join(random.choice(characters) for _ in range(code_length))
                    # Check if the code already exists in the table
                    if not Fin_Company_Details.objects.filter(Company_Code = unique_code).exists():
                        break  
                
                request.data['Login_Id'] = loginId
                request.data['Company_Code'] = unique_code
                request.data['Admin_approval_status'] = "NULL"
                request.data['Distributor_approval_status'] = "NULL"
                companySerializer = CompanyDetailsSerializer(data=request.data)
                if companySerializer.is_valid():
                    companySerializer.save()
                    return Response({'status':True,'data':companySerializer.data}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'status':False,'data':companySerializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'status':False,'data':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
 