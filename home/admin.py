# home/admin.py
from django.contrib import admin
from .models import Hero, AboutMe, Certificate, Project, SocialLink, ContactMessage , CV
from django.utils.html import mark_safe

@admin.register(Hero)
class HeroAdmin(admin.ModelAdmin):
    list_display = ('title', 'subtitle')

@admin.register(AboutMe)
class AboutMeAdmin(admin.ModelAdmin):
    list_display = ('title',)
    readonly_fields = ('profile_image_preview',)

    def profile_image_preview(self, obj):
        if obj.profile_image:
            return mark_safe(f'<img src="{obj.profile_image.url}" width="100" />')
        return ""
    profile_image_preview.allow_tags = True
    profile_image_preview.short_description = "Profile Preview"

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'completion_year')
    search_fields = ('title', 'platform')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'release_date')
    search_fields = ('title',)
    list_filter = ('release_date',)

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'message')
    list_filter = ('created_at',)

@admin.register(CV)
class CVAdmin(admin.ModelAdmin):
    list_display = ("title", "uploaded_at", "file_link") 
    search_fields = ("title",)  
    ordering = ("-uploaded_at",)  

    def file_link(self, obj):
        if obj.file:
            return f'<a href="{obj.file.url}" target="_blank">View CV</a>'
        return "No file"
    file_link.allow_tags = True
    file_link.short_description = "CV File"


