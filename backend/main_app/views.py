from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, Django Project is working!")
