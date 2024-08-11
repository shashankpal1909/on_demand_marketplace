from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app.api.endpoints import users, bookings, services, reviews, admin, notifications, availability

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.3.101:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_v1 = FastAPI()

# Include routers
api_v1.include_router(users.router, prefix="/users", tags=["users"])
api_v1.include_router(availability.router, prefix="/availability", tags=["availability"])
api_v1.include_router(services.router, prefix="/services", tags=["services"])
api_v1.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_v1.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_v1.include_router(admin.router, prefix="/admin", tags=["admin"])
api_v1.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

app.mount("/api/v1", api_v1)

app.mount("/files", StaticFiles(directory="./files/"), name="files")


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the On-Demand Service Marketplace API"}
