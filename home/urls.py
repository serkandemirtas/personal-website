from django.urls import path ,include
from . import views
from .views import health

urlpatterns = [
    path('', views.home, name='home'),        
    path('contact', views.contact_view, name='contact'), 
    path('healthz', health),
]
