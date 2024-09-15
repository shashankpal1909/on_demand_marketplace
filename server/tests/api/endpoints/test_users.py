from app.schemas.user import UserCreate


def test_root(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to the On-Demand Service Marketplace API"
    }


def test_user_register_as_customer(test_client):
    response = test_client.post(
        "/api/v1/users/register",
        json=UserCreate(
            username="johndoe",
            email="johndoe@example.com",
            name="johndoe",
            password="password",
            role="customer",
        ).__dict__,
    )
    response_json = response.json()
    print(response_json)
    assert response.status_code == 201
    assert response_json["username"] == "johndoe"
    assert response_json["email"] == "johndoe@example.com"
    assert response_json["name"] == "johndoe"
    assert response_json["role"] == "customer"
    assert response_json["is_active"] is True
