import os
import shutil

from sqlalchemy.orm import Session

from app.models.service import Service, ServiceMedia, ServiceTag
from app.models.user import User
from app.schemas.service import ServiceCreate
from app.utils.media import compress_image

UPLOAD_DIRECTORY = "./files/"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


def create_service(db: Session, user: User, service: ServiceCreate) -> Service:
    db_service = Service(
        title=service.title,
        description=service.description,
        category=service.category,
        location=service.location,
        pricing=service.pricing,
        pricing_type=service.pricing_type,
        provider_id=user.id
    )

    db.add(db_service)
    db.commit()

    for tag in service.tags:
        tag = ServiceTag(text=tag, service_id=db_service.id)
        db.add(tag)
        db.commit()

    for file in service.media:
        media = ServiceMedia(url="", service_id=db_service.id)
        db.add(media)
        db.commit()
        db.refresh(media)

        # Define the file paths
        file_extension = file.filename.split(".")[-1]
        file_location = os.path.join(UPLOAD_DIRECTORY, f"{media.id}.{file_extension}")
        compressed_file_location = os.path.join(UPLOAD_DIRECTORY, f"{media.id}_compressed.{file_extension}")

        # Save the uploaded file
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Compress the image
        compress_image(file_location, compressed_file_location)

        # Update the media item URL to the compressed file path
        media.url = f"{media.id}_compressed.{file_extension}"
        db.add(media)

    db.commit()

    return db_service


def update_service(db: Session, db_service: Service, service: ServiceCreate) -> Service:
    db_service.title = service.title
    db_service.description = service.description
    db_service.category = service.category
    db_service.location = service.location
    db_service.pricing = service.pricing
    db_service.pricing_type = service.pricing_type

    for tag in db_service.tags:
        print("TAG:", tag)
        db.delete(tag)

    for media in db_service.media:
        print("MEDIA:", media)
        db.delete(media)

    for tag in service.tags:
        tag = ServiceTag(text=tag, service_id=db_service.id)
        db.add(tag)
        db.commit()

    for file in service.media:
        media = ServiceMedia(url="", service_id=db_service.id)
        db.add(media)
        db.commit()
        db.refresh(media)

        # Define the file paths
        file_extension = file.filename.split(".")[-1]
        file_location = os.path.join(UPLOAD_DIRECTORY, f"{media.id}.{file_extension}")
        compressed_file_location = os.path.join(UPLOAD_DIRECTORY, f"{media.id}_compressed.{file_extension}")

        # Save the uploaded file
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Compress the image
        compress_image(file_location, compressed_file_location)

        # Update the media item URL to the compressed file path
        media.url = f"{media.id}_compressed.{file_extension}"
        db.add(media)

    db.commit()

    return db_service
