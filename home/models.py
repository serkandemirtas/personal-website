import os
from django.db import models
from django.core.exceptions import ValidationError
from tinymce.models import HTMLField
from .db_storage import DatabaseStorage, StoredFile

_db_storage = DatabaseStorage()

def validate_file_extension(value):
    allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp']
    ext = os.path.splitext(value.name)[1].lower()
    if ext not in allowed:
        raise ValidationError(f"Desteklenmeyen dosya tipi: {ext}. İzin verilenler: {', '.join(allowed)}")


class Hero(models.Model):
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=150, blank=True)
    description = HTMLField()
    image = models.ImageField(
        storage=_db_storage,
        upload_to='',
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title



class AboutMe(models.Model):
    title = models.CharField(max_length=150)
    content = HTMLField()
    profile_image = models.ImageField(
        storage=_db_storage,
        upload_to='',
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.title



class Certificate(models.Model):
    title = models.CharField(max_length=200)
    platform = models.CharField(max_length=100, blank=True)
    completion_year = models.IntegerField()
    details = HTMLField(blank=True)
    link = models.URLField(blank=True)
    file = models.FileField(
        storage=_db_storage,
        upload_to='',
        blank=True,
        null=True,
        validators=[validate_file_extension],
    )

    def __str__(self):
        return self.title



class Project(models.Model):
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=255)
    details = HTMLField()
    image = models.ImageField(storage=_db_storage, upload_to='', blank=True, null=True)
    video = models.FileField(storage=_db_storage, upload_to='', blank=True, null=True)
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
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


class CV(models.Model):
    title = models.CharField(max_length=100, default="My CV")
    file = models.FileField(
        storage=_db_storage,
        upload_to='',
        blank=True,
        validators=[validate_file_extension],
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name
