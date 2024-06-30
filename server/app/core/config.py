from pydantic import EmailStr
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    mail_username: str
    mail_password: str
    mail_from: EmailStr
    mail_port: int
    mail_server: str
    mail_from_name: str
    mail_starttls: bool
    mail_ssl_tls: bool
    use_credentials: bool
    validate_certs: bool

    model_config = {"env_file": ".env"}


settings = Settings()
