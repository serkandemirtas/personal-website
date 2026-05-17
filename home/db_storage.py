import uuid
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.db import models


class StoredFile(models.Model):
    key = models.CharField(max_length=100, unique=True)
    filename = models.CharField(max_length=255)
    content_type = models.CharField(max_length=100, default='application/octet-stream')
    data = models.BinaryField()

    class Meta:
        app_label = 'home'

    def __str__(self):
        return self.filename


class DatabaseStorage(Storage):
    def deconstruct(self):
        return ('home.db_storage.DatabaseStorage', [], {})

    def _save(self, name, content):
        key = f"{uuid.uuid4().hex}_{name}"
        data = content.read()
        import mimetypes
        content_type, _ = mimetypes.guess_type(name)
        StoredFile.objects.create(
            key=key,
            filename=name,
            content_type=content_type or 'application/octet-stream',
            data=data,
        )
        return key

    def _open(self, name, mode='rb'):
        try:
            obj = StoredFile.objects.get(key=name)
            return ContentFile(bytes(obj.data))
        except StoredFile.DoesNotExist:
            raise FileNotFoundError(name)

    def exists(self, name):
        return StoredFile.objects.filter(key=name).exists()

    def url(self, name):
        return f'/media/files/{name}/'

    def delete(self, name):
        StoredFile.objects.filter(key=name).delete()
