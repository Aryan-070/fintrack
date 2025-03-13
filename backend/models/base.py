from pydantic import BaseModel, condecimal, field_validator, UUID4
from datetime import datetime, date
from typing import Optional
from uuid import UUID

# Rename the Pydantic UUID4 to avoid confusion
PydanticUUID4 = UUID4 