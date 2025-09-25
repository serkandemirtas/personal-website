# home/views.py
from .forms import ContactForm
from .models import Hero, AboutMe, Certificate, Project, SocialLink , CV
from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ContactForm
from django.core.mail import send_mail
from django.conf import settings
from django_ratelimit.decorators import ratelimit
from django.http import HttpResponse

def home(request):
    hero = Hero.objects.first()               
    about = AboutMe.objects.first()          
    certificates = Certificate.objects.all() 
    projects = Project.objects.all().order_by('-release_date') 
    social_links = SocialLink.objects.all()  
    form = ContactForm()
    cv = CV.objects.last()  

    context = {
        "hero": hero,
        "about": about,
        "certificates": certificates,
        "projects": projects,
        "social_links": social_links,
        "form" : form,
        "cv" : cv,
    }
    return render(request, "home/home.html", context)



@ratelimit(key='ip', rate='5/m', block=True)
def contact_view(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            phone = form.cleaned_data.get('phone', '')
            message_text = form.cleaned_data['message']

            subject = f"There is a message from your personal portfolio {name}"
            message = f"""
You have a new message:
Full Name: {name}
Email: {email}
Phone: {phone}
Message:
    {message_text}
                        """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [settings.ADMIN_EMAIL]

            try:
                send_mail(subject, message, from_email, recipient_list)
            except Exception as e:
                print("Mail gönderilemedi:", e)

            messages.success(request, "Your message has been sent successfully ✅")
            return redirect('/')
        else:
            messages.error(request, "Please correct any errors in the form ❌")
            return redirect('/')
    else:
        form = ContactForm()

    return render(request, 'contact.html', {"form": form})


