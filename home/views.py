# home/views.py
from .forms import ContactForm
from .models import Hero, AboutMe, Certificate, Project, SocialLink, CV, Skill
from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django_ratelimit.decorators import ratelimit
from django.contrib.admin.views.decorators import staff_member_required
import os, shutil, mimetypes, threading, time
from django.http import JsonResponse, HttpResponse


def serve_db_file(request, key):
    from .db_storage import StoredFile
    try:
        obj = StoredFile.objects.get(key=key)
        return HttpResponse(bytes(obj.data), content_type=obj.content_type)
    except StoredFile.DoesNotExist:
        from django.http import Http404
        raise Http404


def home(request):
    hero = Hero.objects.first()               
    about = AboutMe.objects.first()          
    certificates = Certificate.objects.all()
    projects = Project.objects.all().order_by('-release_date')
    social_links = SocialLink.objects.all()
    skills = Skill.objects.all()
    form = ContactForm()
    cv = CV.objects.last()

    context = {
        "hero": hero,
        "about": about,
        "certificates": certificates,
        "projects": projects,
        "social_links": social_links,
        "skills": skills,
        "form": form,
        "cv": cv,
    }
    return render(request, "home/home.html", context)



@ratelimit(key='ip', rate='5/m', block=True)
def contact_view(request):
    if request.method == "POST":
        # Bot timing check: JS sets timestamp on page load; bots skip JS or submit instantly
        try:
            loaded_at = int(request.POST.get('form_loaded_at', 0))
            elapsed = time.time() * 1000 - loaded_at
            if loaded_at == 0 or elapsed < 4000:
                messages.error(request, "Submission blocked. Please try again.")
                return redirect('/')
        except (ValueError, TypeError):
            return redirect('/')

        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            phone = form.cleaned_data.get('phone', '')
            message_text = form.cleaned_data['message']

            subject = f"New message from {name} — Portfolio"
            plain_text = f"From: {name}\nEmail: {email}\nPhone: {phone}\n\n{message_text}"
            html_body = render_to_string('home/email_contact.html', {
                'name': name,
                'email': email,
                'phone': phone,
                'message': message_text,
            })
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [settings.ADMIN_EMAIL]

            def _send():
                try:
                    msg = EmailMultiAlternatives(subject, plain_text, from_email, recipient_list)
                    msg.attach_alternative(html_body, "text/html")
                    msg.send()
                except Exception as e:
                    print("Mail gönderilemedi:", e)

            threading.Thread(target=_send, daemon=True).start()

            messages.success(request, "Your message has been sent successfully.")
            return redirect('/')
        else:
            context = {
                "hero": Hero.objects.first(),
                "about": AboutMe.objects.first(),
                "certificates": Certificate.objects.all(),
                "projects": Project.objects.all().order_by('-release_date'),
                "social_links": SocialLink.objects.all(),
                "skills": Skill.objects.all(),
                "form": form,
                "cv": CV.objects.last(),
            }
            return render(request, 'home/home.html', context)
    else:
        form = ContactForm()

    return render(request, 'home/home.html', {"form": form})

