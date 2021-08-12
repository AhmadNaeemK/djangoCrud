from django.urls import path
from . import views

app_name = 'posts'
urlpatterns = [
    # / /
    path('', views.post_list_view, name='post_list'),
    path('react/', views.react, name='react'),
    path('add_comment/', views.add_comment, name='add_comment'),
    path('delete_comment/', views.delete_comment, name='delete_comment'),
    path('update_comment/', views.update_comment, name='update_comment'),
    path('search/', views.search_post, name='search'),
    path('add_post/', views.add_post, name='add_post'),
    path('delete_post/', views.delete_post, name='delete_post'),
    path('update_post/', views.update_post, name='update_post'),
    path('<int:pk>/detail_view', views.detail_view, name='post_detail'),
]
