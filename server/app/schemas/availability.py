import datetime

from pydantic import BaseModel, Field

from app.models.availability import AvailabilityDay


class RecurringAvailability(BaseModel):
    day: AvailabilityDay
    start_time: datetime.time
    end_time: datetime.time
    is_available: bool = True

    model_config = {
        "json_schema_extra": {
            "example": {
                "day": "monday",
                "start_time": "09:00:00.000Z",
                "end_time": "18:00:00.000Z",
                "is_available": True,
            }
        }
    }


class RecurringAvailabilityRequestBody(BaseModel):
    availabilities: list[RecurringAvailability]
