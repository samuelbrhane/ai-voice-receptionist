class CalendarError(Exception):
    """A booking problem with a code for the API and a message the agent can say."""

    def __init__(self, code: str, message: str):
        super().__init__(message)
        self.code = code
        self.message = message