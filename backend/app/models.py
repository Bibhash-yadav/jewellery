from sqlalchemy import (
    Column, Integer, BigInteger, String, Boolean,
    DateTime, ForeignKey, Numeric, Text, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

from datetime import datetime
from sqlalchemy.sql import func

created_at = Column(DateTime(timezone=True), server_default=func.now())


# ================= ENUMS =================

class UserRole(str, enum.Enum):
    admin = "admin"
    customer = "customer"

class UserStatus(str, enum.Enum):
    active = "active"
    blocked = "blocked"


# ================= USERS =================

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(UserRole, name="user_roles"), default=UserRole.customer, nullable=False)
    status = Column(Enum(UserStatus, name="user_status"), default=UserStatus.active, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    cart = relationship("Cart", back_populates="user", uselist=False)
    addresses = relationship("Address", back_populates="user")
    orders = relationship("Order", back_populates="user")


# ================= ADDRESS =================

class Address(Base):
    __tablename__ = "addresses"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    full_address = Column(Text, nullable=False)
    city = Column(String)
    state = Column(String)
    pincode = Column(String)
    country = Column(String)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


# ================= CATEGORY =================

class Category(Base):
    __tablename__ = "categories"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True)
    parent_id = Column(BigInteger, ForeignKey("categories.id"), nullable=True)
    description = Column(Text)
    image = Column(Text)

    products = relationship("Product", back_populates="category")


# ================= PRODUCT =================

class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, index=True)
    category_id = Column(BigInteger, ForeignKey("categories.id"), nullable=False)
    title = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    discount_price = Column(Numeric(10, 2))
    material = Column(String)
    weight = Column(Numeric(10, 2))
    stock = Column(Integer, default=0)
    sku = Column(String, unique=True)
    is_limited = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    image_url = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="products")
    cart_items = relationship("CartItem", back_populates="product")
    images = relationship("ProductImage", back_populates="product")
    variants = relationship("ProductVariant", back_populates="product")


# ================= PRODUCT IMAGES =================

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, ForeignKey("products.id"))
    image_url = Column(Text, nullable=False)
    is_primary = Column(Boolean, default=False)

    product = relationship("Product", back_populates="images")


# ================= PRODUCT VARIANTS =================

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, ForeignKey("products.id"))
    variant_name = Column(String)
    variant_value = Column(String)
    price = Column(Numeric(10, 2))
    stock = Column(Integer)

    product = relationship("Product", back_populates="variants")


# ================= CART =================

class Cart(Base):
    __tablename__ = "carts"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(BigInteger, primary_key=True)
    cart_id = Column(BigInteger, ForeignKey("carts.id"))
    product_id = Column(BigInteger, ForeignKey("products.id"))
    variant_id = Column(BigInteger, ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, default=1)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")


# ================= ORDER =================

# ================= ORDER =================

class Order(Base):
    __tablename__ = "orders"

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    address_id = Column(BigInteger, ForeignKey("addresses.id"))
    total_amount = Column(Numeric(10, 2))

    # ✅ CLEAN ORDER STATUS (NO PAID)
    status = Column(
        Enum('pending', 'shipped', 'delivered', 'cancelled', name='order_status'),
        default='pending',
        nullable=False
    )

    # ✅ PAYMENT STATUS
    payment_status = Column(
        Enum('pending', 'success', 'failed', name='payment_status'),
        default='pending',
        nullable=False
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


# ================= ORDER ITEMS (CRITICAL FIX) =================

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(BigInteger, primary_key=True)
    order_id = Column(BigInteger, ForeignKey("orders.id"))
    product_id = Column(BigInteger, ForeignKey("products.id"))
    variant_id = Column(BigInteger, ForeignKey("product_variants.id"), nullable=True)

    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

is_active = Column(Boolean, default=True)