def is_palindrome(text: str) -> bool:
    if not isinstance(text, str):
        raise TypeError(f"input must be a string, got {type(text).__name__}")

    for char in text:
        if ord(char) > 127:
            raise ValueError(f"non-ASCII character not allowed: {char}")

    normalized = ''.join(char.lower() for char in text if char.isalnum())

    if text and not normalized:
        raise ValueError("string must contain at least one alphanumeric character")

    return normalized == normalized[::-1]
