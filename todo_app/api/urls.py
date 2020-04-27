from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name='api-overview'),
    path('task-list/', views.tastList, name='task-list'),
    path('task-detail/<str:pk>/', views.tastDetail, name='task-detail'),
    path('task-create/', views.tastCreate, name='task-create'),
    path('task-update/<str:pk>/', views.tastUpdate, name='task-update'),
    path('task-delete/<str:pk>/', views.tastDelete, name='task-delete'),
]
