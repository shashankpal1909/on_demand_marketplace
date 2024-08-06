import os
import shutil
from sqlalchemy.orm import Session

from app.models.service import Service, ServiceMedia
from app.models.user import User
from app.schemas.service import ServiceCreate

import os

UPLOAD_DIRECTORY = "./uploaded_files/"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


def create_service(db: Session, user: User, service: ServiceCreate) -> Service:
    db_service = Service(
        title=service.title,
        description=service.description,
        pricing=service.pricing,
        pricing_type=service.pricing_type,
        provider_id=user.id
    )

    db.add(db_service)
    db.commit()

    for file in service.media:
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        media_item = ServiceMedia(url=file_location, service_id=db_service.id)
        db.add(media_item)

    db.commit()

    return db_service
