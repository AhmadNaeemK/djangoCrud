import json
import os

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse
from django.template.loader import render_to_string
from django.middleware.csrf import get_token
from django.conf import settings
from django.urls import resolve


from .models import Post, Comment
from .forms import CommentForm
# Create your views here.


def post_list_view(request):
    posts = Post.objects.order_by('-pub_date')
    comment_form = CommentForm()
    return render(request, 'posts/post_list.html', context={'posts_list': posts, 'comment_form': comment_form})


def detail_view(request, pk):
    post = Post.objects.get(pk=pk)
    comment_form = CommentForm()
    return render(request, 'posts/details.html', context={'post': post, 'comment_form': comment_form})


def react(request):
    post_id = request.GET['post_id']
    post = get_object_or_404(Post, pk=post_id)
    post.reacts += 1
    post.save()
    return HttpResponse(
        json.dumps({'reacts': post.reacts}),
        content_type='application/json'
    )


def search_post(request):
    query_parameter = request.GET['q']
    posts = Post.objects.filter(title__icontains=query_parameter).order_by('-pub_date')
    html = render_to_string('posts/list_view.html', {'posts_list': posts, 'comment_form': CommentForm, 'csrf_token': get_token(request)})
    return HttpResponse(html)


def add_comment(request):
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            post_id = request.POST['post_id']
            post = get_object_or_404(Post, pk=post_id)
            comment = post.comment_set.create(comment_text=request.POST['comment_text'])
            html = render_to_string('posts/comment.html',
                                    {'comment': comment, 'csrf_token': get_token(request), 'comment_form': CommentForm})
            return HttpResponse(
                json.dumps({'comment_id': comment.id, 'html_view': html}),
                content_type='application/json'
            )
    else:
        form = CommentForm()
    return HttpResponseRedirect('/')


def update_comment(request):
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment_id = request.POST['comment_id']
            comment = get_object_or_404(Comment, pk=comment_id)
            comment.comment_text = request.POST['comment_text']
            comment.save()
            return HttpResponse(
                json.dumps(form.cleaned_data),
                content_type='application/json'
            )
    else:
        form = CommentForm()
    return HttpResponseRedirect('/')


def delete_comment(request):
    comment_id = request.GET['comment_id'];
    comment = get_object_or_404(Comment, pk=comment_id);
    comment.delete()
    return HttpResponse()


def add_post(request):
    if request.method == 'POST':
        if request.FILES:
            post = Post.objects.create(title=request.POST['post_title'], image=request.FILES['post_file'],
                                       description=request.POST['post_desc'])
        else:
            post = Post.objects.create(title=request.POST['post_title'],
                                       description=request.POST['post_desc'])

    return HttpResponseRedirect('/')


def delete_post(request):
    if request.method == 'POST':
        post = get_object_or_404(Post, pk=request.POST.get('post_id'))
        os.remove(settings.MEDIA_ROOT+'/' +post.image.name)
        post.delete()
    return HttpResponse()


def update_post(request):
    if request.method == 'POST':
        post = get_object_or_404(Post, pk=request.POST.get('post_id'))
        post.title = request.POST.get('post_title')
        post.description = request.POST.get('post_desc')
        post.save()
        return HttpResponse(
            json.dumps({'post_title': post.title,
                        'post_desc': post.description}),
            content_type='application.json'
        )
