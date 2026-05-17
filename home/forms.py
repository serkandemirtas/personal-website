import re
from django import forms
from .models import ContactMessage

XSS_PATTERNS = re.compile(
    r'(<script|</script|javascript:|onerror\s*=|onload\s*=|onclick\s*=|'
    r'<iframe|<object|<embed|<svg|data:text/html|vbscript:)',
    re.IGNORECASE
)

SPAM_PATTERNS = re.compile(
    r'(https?://|www\.|\[url|viagra|casino|porn|crypto|bitcoin|'
    r'click here|buy now|free money|make money|earn \$)',
    re.IGNORECASE
)

MAX_LENGTHS = {
    'name': 100,
    'message': 2000,
    'phone': 20,
}


def check_xss(value, field_name):
    if XSS_PATTERNS.search(value):
        raise forms.ValidationError(f"{field_name} alanında geçersiz içerik tespit edildi.")


def check_spam(value, field_name):
    if SPAM_PATTERNS.search(value):
        raise forms.ValidationError(f"{field_name} alanında spam içerik tespit edildi.")


def check_length(value, field_name, max_len):
    if len(value) > max_len:
        raise forms.ValidationError(f"{field_name} en fazla {max_len} karakter olabilir.")


class ContactForm(forms.ModelForm):
    website = forms.CharField(required=False, widget=forms.HiddenInput)

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Full Name'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Phone'}),
            'message': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Message', 'rows': 5}),
        }

    def clean_website(self):
        data = self.cleaned_data['website']
        if data:
            raise forms.ValidationError("Spam detected!")
        return data

    def clean_name(self):
        value = self.cleaned_data['name']
        check_length(value, 'Name', MAX_LENGTHS['name'])
        check_xss(value, 'Name')
        check_spam(value, 'Name')
        return value

    def clean_phone(self):
        value = self.cleaned_data['phone']
        if value:
            check_length(value, 'Phone', MAX_LENGTHS['phone'])
            if not re.match(r'^[\d\s\+\-\(\)]+$', value):
                raise forms.ValidationError("Phone numarası yalnızca rakam ve +, -, () içerebilir.")
        return value

    def clean_message(self):
        value = self.cleaned_data['message']
        check_length(value, 'Message', MAX_LENGTHS['message'])
        check_xss(value, 'Message')
        check_spam(value, 'Message')
        return value

    def clean_email(self):
        value = self.cleaned_data['email']
        check_xss(value, 'Email')
        return value
