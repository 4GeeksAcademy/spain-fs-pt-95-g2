from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, ForeignKey, Text, TIMESTAMP, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(100), unique=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    password: Mapped[str] = mapped_column(String(255))
    created_date: Mapped[datetime] = mapped_column(TIMESTAMP)
    expired_date: Mapped[datetime] = mapped_column(TIMESTAMP)
    staff_number: Mapped[int] = mapped_column()

    user_inventories: Mapped[list["UserInventory"]
                             ] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "created_date": self.created_date,
            "expired_date": self.expired_date,
            "staff_number": self.staff_number
        }


class Inventory(db.Model):
    __tablename__ = "inventories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    cif: Mapped[str] = mapped_column(String(10))
    location: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.now)
    sector: Mapped[str] = mapped_column(String(100))
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    products: Mapped[list["Product"]] = relationship(
        back_populates="inventory")
    transactions: Mapped[list["Transaction"]] = relationship(
        back_populates="inventory")
    orders: Mapped[list["Order"]] = relationship(back_populates="inventory")
    user_inventories: Mapped[list["UserInventory"]
                             ] = relationship(back_populates="inventory")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "cif": self.cif,
            "location": self.location,
            "created_at": self.created_at,
            "sector": self.sector,
            "owner_id": self.owner_id
        }


class UserInventory(db.Model):
    __tablename__ = "user_inventory"

    users_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), primary_key=True)
    inventories_id: Mapped[int] = mapped_column(
        ForeignKey("inventories.id"), primary_key=True)
    permissions: Mapped[int] = mapped_column(default=0)

    user: Mapped["User"] = relationship(back_populates="user_inventories")
    inventory: Mapped["Inventory"] = relationship(
        back_populates="user_inventories")

    def serialize(self):
        return {
            "users_id": self.users_id,
            "inventories_id": self.inventories_id,
            "permissions": self.permissions
        }


class Category(db.Model):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.now)

    products: Mapped[list["Product"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at
        }


class Product(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    quantity: Mapped[int] = mapped_column()
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"))
    inventories_id: Mapped[int] = mapped_column(ForeignKey("inventories.id"))

    category: Mapped["Category"] = relationship(back_populates="products")
    inventory: Mapped["Inventory"] = relationship(back_populates="products")
    transactions: Mapped[list["Transaction"]
                         ] = relationship(back_populates="product")
    detalied_orders: Mapped[list["DetaliedOrder"]
                            ] = relationship(back_populates="product")
    attributes: Mapped[list["ProductAttribute"]
                       ] = relationship(back_populates="product")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": float(self.price),
            "quantity": self.quantity,
            "category_id": self.category_id,
            "inventories_id": self.inventories_id
        }


class Transaction(db.Model):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    inventories_id: Mapped[int] = mapped_column(ForeignKey("inventories.id"))
    quantity: Mapped[int] = mapped_column()
    transaction_type: Mapped[str] = mapped_column(String(50))
    date_: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.now)

    product: Mapped["Product"] = relationship(back_populates="transactions")
    inventory: Mapped["Inventory"] = relationship(
        back_populates="transactions")

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "inventories_id": self.inventories_id,
            "quantity": self.quantity,
            "transaction_type": self.transaction_type,
            "date_": self.date_
        }


class Supplier(db.Model):
    __tablename__ = "suppliers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    contact_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str] = mapped_column(String(20))
    address: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.now)

    orders: Mapped[list["Order"]] = relationship(back_populates="supplier")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "contact_name": self.contact_name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "created_at": self.created_at
        }


class Order(db.Model):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True)
    inventories_id: Mapped[int] = mapped_column(ForeignKey("inventories.id"))
    supplier_id: Mapped[int] = mapped_column(ForeignKey("suppliers.id"))
    status: Mapped[str] = mapped_column(String(50), default="pendiente")
    total: Mapped[float] = mapped_column(Numeric(10, 2))
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, default=datetime.now)
    received_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=True)

    inventory: Mapped["Inventory"] = relationship(back_populates="orders")
    supplier: Mapped["Supplier"] = relationship(back_populates="orders")
    detalied_orders: Mapped[list["DetaliedOrder"]
                            ] = relationship(back_populates="order")

    def serialize(self):
        return {
            "id": self.id,
            "inventories_id": self.inventories_id,
            "supplier_id": self.supplier_id,
            "status": self.status,
            "total": float(self.total),
            "created_at": self.created_at,
            "received_at": self.received_at
        }


class DetaliedOrder(db.Model):
    __tablename__ = "detaliedOrders"

    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column()
    unit_price: Mapped[float] = mapped_column(Numeric(10, 2))

    order: Mapped["Order"] = relationship(back_populates="detalied_orders")
    product: Mapped["Product"] = relationship(back_populates="detalied_orders")

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "unit_price": float(self.unit_price)
        }


class Attribute(db.Model):
    __tablename__ = "attributes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))

    product_attributes: Mapped[list["ProductAttribute"]
                               ] = relationship(back_populates="attribute")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class ProductAttribute(db.Model):
    __tablename__ = "product_attributes"

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"), primary_key=True)
    attribute_id: Mapped[int] = mapped_column(
        ForeignKey("attributes.id"), primary_key=True)
    value: Mapped[str] = mapped_column(String(100))

    product: Mapped["Product"] = relationship(back_populates="attributes")
    attribute: Mapped["Attribute"] = relationship(
        back_populates="product_attributes")

    def serialize(self):
        return {
            "product_id": self.product_id,
            "attribute_id": self.attribute_id,
            "value": self.value
        }
