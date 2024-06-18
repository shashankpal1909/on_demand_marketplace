from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base
from app.api.endpoints import users, bookings, services, reviews, admin

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(services.router, prefix="/services", tags=["services"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
app.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])


# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the On-Demand Service Marketplace API"}
