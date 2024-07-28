import uuid
from typing import List

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

from app.core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=settings.mail_starttls,
    MAIL_SSL_TLS=settings.mail_ssl_tls,
    USE_CREDENTIALS=settings.use_credentials,
    VALIDATE_CERTS=settings.validate_certs,
)


async def send_email(subject: str, recipients: List[EmailStr], body: str):
    message = MessageSchema(
        subject=subject, recipients=recipients, body=body, subtype="html"
    )

    fm = FastMail(conf)
    # await fm.send_message(message)
    print("Sent message", message)


async def send_verification_email(name: str, email: str, token: uuid.UUID):
    subject = "Verify your On-Demand Service Marketplace account"
    body = f"""
    <p>Hi {name},</p>
    <p>We heard that you lost your On-Demand Service Marketplace account. Sorry about that!</p>
    <p>But don’t worry! You can use the following link to verify your account:</p>
    <p><a href="http://localhost:8000/api/v1/users/verify?token={token}">http://localhost:8000/api/v1/users/verify?token={token}</a></p>
    <p>After you click the link your account will be verified.</p>
    <p>Thanks,</p>
    <p>The On-Demand Service Marketplace Team</p>
    """
    await send_email(subject, [email], body)


async def send_reset_password_email(name: str, email: str, token: uuid.UUID):
    subject = "Reset your On-Demand Service Marketplace password"
    body = f"""
    <p>Hi {name},</p>
    <p>We heard that you lost your On-Demand Service Marketplace password. Sorry about that!</p>
    <p>But don’t worry! You can use the following link to reset your password:</p>
    <p><a href="http://localhost:8000/api/v1/users/reset-password?token={token}">http://localhost:8000/api/v1/users/reset-password?token={token}</a></p>
    <p>After you click the link your password will be reset.</p>
    <p>If you don’t use this link within 1 hour, it will expire.</p>
    <p>Thanks,</p>
    <p>The On-Demand Service Marketplace Team</p>
    """
    await send_email(subject, [email], body)
