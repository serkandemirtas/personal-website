from django.db import models
from tinymce.models import HTMLField


class Hero(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=150, blank=True)
    description = HTMLField()  
    lottie_url = models.URLField(blank=True)

    def __str__(self):
        return self.title



class AboutMe(models.Model):
    title = models.CharField(max_length=150)
    content = HTMLField()  
    profile_image = models.ImageField(
        upload_to='profile/',
        null=True,
        blank=True,
        default='defaults/default.png'
    )

    def __str__(self):
        return self.title



class Certificate(models.Model):
    title = models.CharField(max_length=200)
    platform = models.CharField(max_length=100, blank=True)
    completion_year = models.IntegerField()
    details = HTMLField(blank=True) 
    link = models.URLField(blank=True)
    file = models.FileField(upload_to='certificates/', blank=True, null=True)

    def __str__(self):
        return self.title



class Project(models.Model):
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=255)
    details = HTMLField()  
    image = models.ImageField(upload_to='projects/images/', blank=True, null=True)
    video = models.FileField(upload_to='projects/videos/', blank=True, null=True)
    github_link = models.URLField(blank=True)
    release_date = models.DateField()

    def __str__(self):
        return self.title



class SocialLink(models.Model):
    platform = models.CharField(max_length=50)
    icon_class = models.CharField(max_length=50)  
    url = models.URLField()

    def __str__(self):
        return self.platform



class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=200)
    phone = models.CharField(max_length=11, blank=True)
    message = HTMLField()  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"
    
from django.db import models

class CV(models.Model):
    title = models.CharField(max_length=100, default="My CV")
    file = models.FileField(upload_to='cv/')  
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

