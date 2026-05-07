def _validate_inputs(amount: float | int, rate: float | int) -> None:
    if not isinstance(amount, (int, float)) or isinstance(amount, bool):
        raise TypeError(f"amount must be a number, got {type(amount).__name__}")
    if not isinstance(rate, (int, float)) or isinstance(rate, bool):
        raise TypeError(f"rate must be a number, got {type(rate).__name__}")
    if amount <= 0:
        raise ValueError("amount must be positive")
    if rate <= 0:
        raise ValueError("rate must be positive")


def convert_currency(amount: float | int, rate: float | int) -> float:
    return float(amount * rate)


def format_currency(value: float, decimal_places: int = 2) -> str:
    return f"{value:.{decimal_places}f}"


def print_result(formatted_value: str) -> None:
    print(formatted_value)
