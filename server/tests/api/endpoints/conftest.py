import uuid

import pytest


# Fixture to generate a random user id
@pytest.fixture()
def user_id() -> str:
    """Generate a random user id."""
    return str(uuid.uuid4())


# Fixture to generate a user payload
@pytest.fixture()
def user_payload(user_id):
    """Generate a user payload."""
    return {
        "id": user_id,
        "first_name": "John",
        "last_name": "Doe",
        "address": "123 Farmville",
    }


@pytest.fixture()
def user_payload_updated(user_id):
    """Generate an updated user payload."""
    return {
        "first_name": "Jane",
        "last_name": "Doe",
        "address": "321 Farmville",
        "activated": True,
    }
