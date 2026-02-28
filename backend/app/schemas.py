from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from .models import UserRole

# --- AUTH SCHEMAS ---

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    role: Optional[str] = "customer"
    admin_secret: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True   # (Pydantic v2 replacement of orm_mode)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class UpdateProfile(BaseModel):
    name: str
    phone: str

class ChangePassword(BaseModel):
    old_password: str
    new_password: str    
# --- CATEGORY SCHEMAS ---

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    slug: Optional[str] = None
    image: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    
    class Config:
        from_attributes = True

# --- PRODUCT SCHEMAS ---

class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    category_id: int
    stock: int = 0
    material: Optional[str] = None
    weight: Optional[float] = None
    image_url: Optional[str] = None
    sku: Optional[str] = None
    is_limited: bool = False
    is_active: bool = True

class ProductCreate(ProductBase):
    slug: Optional[str] = None

class ProductOut(ProductBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
        
# --- CART SCHEMAS ---
class CreateOrderRequest(BaseModel):
    address_id: int
    product_id: Optional[int] = None
    quantity: Optional[int] = 1
    
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0) # Must be at least 1
    variant_id: Optional[int] = None # Optional for rings/sizes

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)

class CartItemOut(BaseModel):
    id: int
    product_id: int
    product: ProductOut # This nesting allows the frontend to see title/price/image
    quantity: int
    variant_id: Optional[int] = None

    class Config:
        from_attributes = True

class CartOut(BaseModel):
    id: int
    user_id: int
    items: List[CartItemOut] = []
    total_price: float = 0.0 # We will calculate this in the logic

    class Config:
        from_attributes = True
        
# --- ORDER SCHEMAS ---

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product: ProductOut  # 🔥 Relationship: Returns full product info (title, image_url, etc.)
    quantity: int
    price: float         # This is the price at the time of purchase
    variant_id: Optional[int] = None
    
    class Config:
        from_attributes = True

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import List

class OrderOut(BaseModel):
    id: int
    user_id: int
    address_id: int
    total_amount: float
    status: str
    payment_status: str
    created_at: datetime
    items: List[OrderItemOut] = []

    # 🔥 THIS FIXES YOUR CRASH
    @field_validator("status", "payment_status", mode="before")
    @classmethod
    def convert_enum(cls, v):
        try:
            return str(v.value)  # postgres enum -> string
        except:
            return str(v)

    class Config:
        from_attributes = True

        
# --- ADDRESS SCHEMAS ---

class AddressBase(BaseModel):
    full_address: str
    city: str
    state: str
    pincode: str
    country: str = "India"
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressOut(AddressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    address_id: int
    payment_method: str
    items: List[OrderItemCreate]