from django.urls import path 
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('contact', views.contact_view, name='contact'),
    path('media/files/<path:key>/', views.serve_db_file, name='serve_db_file'),
]
