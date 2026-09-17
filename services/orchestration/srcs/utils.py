import secrets
import time

exchange_tokens = {}


def cleanup_expired_tokens():
    now = time.time()

    expired = [code for code, data in exchange_tokens.items() if data["exp"] <= now]

    for code in expired:
        del exchange_tokens[code]


def create_exchange_token(token: dict):
    cleanup_expired_tokens()

    code = secrets.token_urlsafe(32)

    exchange_tokens[code] = {
        "token": token,
        "exp": time.time() + 300,
    }

    return code


def get_exchange_token(code: str):
    cleanup_expired_tokens()

    token_data = exchange_tokens.pop(code, None)

    if not token_data:
        return None

    return token_data["token"]
