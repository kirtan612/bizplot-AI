"""Initial PostgreSQL schema migration for BizPilot AI multi-tenant steel-pipe distribution system

Revision ID: 001_initial_schema
Revises: None
Create Date: 2026-08-04

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgcrypto extension for gen_random_uuid()
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    # 1. companies
    op.create_table(
        'companies',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('code', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('code', name='uq_companies_code')
    )
    op.create_index('ix_companies_code', 'companies', ['code'])
    op.create_index('ix_companies_deleted_at', 'companies', ['deleted_at'])

    # 2. users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('username', name='uq_users_username'),
        sa.UniqueConstraint('email', name='uq_users_email')
    )
    op.create_index('ix_users_username', 'users', ['username'])
    op.create_index('ix_users_deleted_at', 'users', ['deleted_at'])

    # 3. roles
    op.create_table(
        'roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint('name', name='uq_roles_name')
    )
    op.create_index('ix_roles_name', 'roles', ['name'])
    op.create_index('ix_roles_deleted_at', 'roles', ['deleted_at'])

    # Foreign keys for users audit columns after users table creation
    op.create_foreign_key('fk_companies_created_by', 'companies', 'users', ['created_by'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_companies_updated_by', 'companies', 'users', ['updated_by'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_users_created_by', 'users', 'users', ['created_by'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_users_updated_by', 'users', 'users', ['updated_by'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_roles_created_by', 'roles', 'users', ['created_by'], ['id'], ondelete='SET NULL')
    op.create_foreign_key('fk_roles_updated_by', 'roles', 'users', ['updated_by'], ['id'], ondelete='SET NULL')

    # 4. company_members
    op.create_table(
        'company_members',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['role_id'], ['roles.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'user_id', name='uq_company_user_membership')
    )
    op.create_index('ix_company_members_company_id', 'company_members', ['company_id'])
    op.create_index('ix_company_members_user_id', 'company_members', ['user_id'])
    op.create_index('ix_company_members_role_id', 'company_members', ['role_id'])

    # 5. import_jobs
    op.create_table(
        'import_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('source_type', sa.String(length=50), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('finished_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_import_jobs_company_id', 'import_jobs', ['company_id'])
    op.create_index('ix_import_jobs_status', 'import_jobs', ['status'])

    # 6. import_files
    op.create_table(
        'import_files',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('import_job_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('row_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['import_job_id'], ['import_jobs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_import_files_import_job_id', 'import_files', ['import_job_id'])

    # 7. import_logs
    op.create_table(
        'import_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('import_job_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('level', sa.String(length=20), nullable=False, server_default='INFO'),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('row_ref', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['import_job_id'], ['import_jobs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_import_logs_import_job_id', 'import_logs', ['import_job_id'])

    # 8. company_master
    op.create_table(
        'company_master',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('company_code', sa.String(length=50), nullable=False, server_default='COMP-001'),
        sa.Column('legal_name', sa.String(length=255), nullable=False),
        sa.Column('trade_name', sa.String(length=255), nullable=True),
        sa.Column('company_type', sa.String(length=50), nullable=False),
        sa.Column('address_line1', sa.String(length=255), nullable=False),
        sa.Column('address_line2', sa.String(length=255), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('pincode', sa.String(length=10), nullable=False),
        sa.Column('gstin', sa.String(length=15), nullable=False),
        sa.Column('pan', sa.String(length=10), nullable=False),
        sa.Column('cin', sa.String(length=21), nullable=True),
        sa.Column('contact_person', sa.String(length=100), nullable=False),
        sa.Column('contact_phone', sa.String(length=20), nullable=False),
        sa.Column('contact_email', sa.String(length=255), nullable=False),
        sa.Column('financial_year_start', sa.String(length=10), nullable=False, server_default='04-01'),
        sa.Column('current_fy', sa.String(length=20), nullable=False, server_default='FY 2024-25'),
        sa.Column('opening_balance_date', sa.Date(), nullable=False),
        sa.Column('bank_name', sa.String(length=100), nullable=False),
        sa.Column('bank_account_number', sa.String(length=50), nullable=False),
        sa.Column('bank_ifsc', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_company_master_company_id', 'company_master', ['company_id'])

    # 9. products
    op.create_table(
        'products',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('product_code', sa.String(length=100), nullable=False),
        sa.Column('brand', sa.String(length=50), nullable=False),
        sa.Column('category', sa.String(length=10), nullable=False),
        sa.Column('shape', sa.String(length=20), nullable=False),
        sa.Column('size', sa.String(length=50), nullable=False),
        sa.Column('weight_class', sa.String(length=20), nullable=False),
        sa.Column('weight_per_meter', sa.Numeric(precision=10, scale=4), nullable=False),
        sa.Column('length', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('gst', sa.Numeric(precision=5, scale=2), nullable=False, server_default='18.00'),
        sa.Column('hsn_code', sa.String(length=10), nullable=False, server_default='7306'),
        sa.Column('standard_ref', sa.String(length=20), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'product_code', name='uq_company_product_code')
    )
    op.create_index('ix_products_company_id', 'products', ['company_id'])
    op.create_index('ix_products_product_code', 'products', ['product_code'])

    # 10. suppliers
    op.create_table(
        'suppliers',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('supplier_code', sa.String(length=50), nullable=False),
        sa.Column('supplier_name', sa.String(length=255), nullable=False),
        sa.Column('supplier_tier', sa.String(length=50), nullable=False),
        sa.Column('address_line1', sa.String(length=255), nullable=False),
        sa.Column('address_line2', sa.String(length=255), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('pincode', sa.String(length=10), nullable=False),
        sa.Column('gstin', sa.String(length=15), nullable=False),
        sa.Column('pan', sa.String(length=10), nullable=False),
        sa.Column('contact_person', sa.String(length=100), nullable=False),
        sa.Column('contact_phone', sa.String(length=20), nullable=False),
        sa.Column('contact_email', sa.String(length=255), nullable=False),
        sa.Column('credit_period_days', sa.Integer(), nullable=False),
        sa.Column('brands_supplied', postgresql.ARRAY(sa.String(length=50)), nullable=False),
        sa.Column('categories_supplied', postgresql.ARRAY(sa.String(length=10)), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('onboarding_date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'supplier_code', name='uq_company_supplier_code')
    )
    op.create_index('ix_suppliers_company_id', 'suppliers', ['company_id'])
    op.create_index('ix_suppliers_supplier_code', 'suppliers', ['supplier_code'])

    # 11. customers
    op.create_table(
        'customers',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('customer_code', sa.String(length=50), nullable=False),
        sa.Column('customer_name', sa.String(length=255), nullable=False),
        sa.Column('customer_type', sa.String(length=50), nullable=False),
        sa.Column('address_line1', sa.String(length=255), nullable=False),
        sa.Column('address_line2', sa.String(length=255), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('pincode', sa.String(length=10), nullable=False),
        sa.Column('gst_registered', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('gstin', sa.String(length=15), nullable=True),
        sa.Column('pan', sa.String(length=10), nullable=False),
        sa.Column('contact_person', sa.String(length=100), nullable=False),
        sa.Column('contact_phone', sa.String(length=20), nullable=False),
        sa.Column('contact_email', sa.String(length=255), nullable=False),
        sa.Column('credit_limit', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('credit_period_days', sa.Integer(), nullable=False),
        sa.Column('payment_behavior_tier', sa.String(length=50), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('onboarding_date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'customer_code', name='uq_company_customer_code')
    )
    op.create_index('ix_customers_company_id', 'customers', ['company_id'])
    op.create_index('ix_customers_customer_code', 'customers', ['customer_code'])

    # 12. steel_index
    op.create_table(
        'steel_index',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('effective_date', sa.Date(), nullable=False),
        sa.Column('national_rate_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('regional_rate_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('region_label', sa.String(length=50), nullable=False, server_default='Raipur/CG'),
        sa.Column('source_type', sa.String(length=100), nullable=False, server_default='Mill Offer Tracking'),
        sa.Column('change_reason', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_steel_index_company_id', 'steel_index', ['company_id'])
    op.create_index('ix_steel_index_effective_date', 'steel_index', ['effective_date'])

    # 13. price_history
    op.create_table(
        'price_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('effective_date', sa.Date(), nullable=False),
        sa.Column('product_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('product_code', sa.String(length=100), nullable=False),
        sa.Column('index_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('base_index_rate', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('brand_multiplier', sa.Numeric(precision=6, scale=4), nullable=False),
        sa.Column('category_adjustment', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('calculated_list_price_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('purchase_discount_pct', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('effective_purchase_price_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('sales_margin_pct', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('effective_sales_price_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['index_id'], ['steel_index.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_price_history_company_id', 'price_history', ['company_id'])
    op.create_index('ix_price_history_effective_date', 'price_history', ['effective_date'])
    op.create_index('ix_price_history_product_id', 'price_history', ['product_id'])

    # 14. purchases
    op.create_table(
        'purchases',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('invoice_number', sa.String(length=100), nullable=False),
        sa.Column('purchase_date', sa.Date(), nullable=False),
        sa.Column('supplier_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('supplier_code', sa.String(length=50), nullable=False),
        sa.Column('product_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('product_code', sa.String(length=100), nullable=False),
        sa.Column('quantity_pcs', sa.Integer(), nullable=False),
        sa.Column('total_weight_kg', sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column('unit_price_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('taxable_value', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('is_interstate', sa.Boolean(), nullable=False),
        sa.Column('cgst_rate', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('cgst_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('sgst_rate', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('sgst_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('igst_rate', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('igst_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('total_gst', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('invoice_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('payment_status', sa.String(length=20), nullable=False),
        sa.Column('payment_due_date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['supplier_id'], ['suppliers.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'invoice_number', name='uq_company_purchase_invoice')
    )
    op.create_index('ix_purchases_company_id', 'purchases', ['company_id'])
    op.create_index('ix_purchases_purchase_date', 'purchases', ['purchase_date'])
    op.create_index('ix_purchases_supplier_id', 'purchases', ['supplier_id'])
    op.create_index('ix_purchases_product_id', 'purchases', ['product_id'])
    op.create_index('ix_purchases_invoice_number', 'purchases', ['invoice_number'])

    # 15. sales
    op.create_table(
        'sales',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('invoice_number', sa.String(length=100), nullable=False),
        sa.Column('sales_date', sa.Date(), nullable=False),
        sa.Column('customer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('customer_code', sa.String(length=50), nullable=False),
        sa.Column('product_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('product_code', sa.String(length=100), nullable=False),
        sa.Column('quantity_pcs', sa.Integer(), nullable=False),
        sa.Column('total_weight_kg', sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column('unit_price_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('taxable_value', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('is_interstate', sa.Boolean(), nullable=False),
        sa.Column('cgst_rate', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('cgst_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('sgst_rate', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('sgst_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('igst_rate', sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column('igst_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('total_gst', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('invoice_amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('payment_status', sa.String(length=20), nullable=False),
        sa.Column('payment_due_date', sa.Date(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'invoice_number', name='uq_company_sales_invoice')
    )
    op.create_index('ix_sales_company_id', 'sales', ['company_id'])
    op.create_index('ix_sales_sales_date', 'sales', ['sales_date'])
    op.create_index('ix_sales_customer_id', 'sales', ['customer_id'])
    op.create_index('ix_sales_product_id', 'sales', ['product_id'])
    op.create_index('ix_sales_invoice_number', 'sales', ['invoice_number'])

    # 16. inventory_snapshots
    op.create_table(
        'inventory_snapshots',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('snapshot_date', sa.Date(), nullable=False),
        sa.Column('product_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('product_code', sa.String(length=100), nullable=False),
        sa.Column('opening_qty_pcs', sa.Integer(), nullable=False),
        sa.Column('opening_weight_kg', sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column('purchased_qty_pcs', sa.Integer(), nullable=False),
        sa.Column('purchased_weight_kg', sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column('sold_qty_pcs', sa.Integer(), nullable=False),
        sa.Column('sold_weight_kg', sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column('closing_qty_pcs', sa.Integer(), nullable=False),
        sa.Column('closing_weight_kg', sa.Numeric(precision=12, scale=4), nullable=False),
        sa.Column('unit_cost_per_kg', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('inventory_valuation', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('reorder_level_pcs', sa.Integer(), nullable=False),
        sa.Column('reorder_flag', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL')
    )
    op.create_index('ix_inventory_snapshots_company_id', 'inventory_snapshots', ['company_id'])
    op.create_index('ix_inventory_snapshots_snapshot_date', 'inventory_snapshots', ['snapshot_date'])
    op.create_index('ix_inventory_snapshots_product_id', 'inventory_snapshots', ['product_id'])

    # 17. cashbook
    op.create_table(
        'cashbook',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('entry_date', sa.Date(), nullable=False),
        sa.Column('voucher_number', sa.String(length=100), nullable=False),
        sa.Column('transaction_type', sa.String(length=20), nullable=False),
        sa.Column('party_type', sa.String(length=20), nullable=False),
        sa.Column('party_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('party_name', sa.String(length=255), nullable=False),
        sa.Column('payment_mode', sa.String(length=50), nullable=False),
        sa.Column('amount', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('reference_invoice_number', sa.String(length=100), nullable=True),
        sa.Column('opening_balance', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('closing_balance', sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column('narration', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ondelete='RESTRICT'),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('company_id', 'voucher_number', name='uq_company_cashbook_voucher')
    )
    op.create_index('ix_cashbook_company_id', 'cashbook', ['company_id'])
    op.create_index('ix_cashbook_entry_date', 'cashbook', ['entry_date'])
    op.create_index('ix_cashbook_voucher_number', 'cashbook', ['voucher_number'])


def downgrade() -> None:
    op.drop_table('cashbook')
    op.drop_table('inventory_snapshots')
    op.drop_table('sales')
    op.drop_table('purchases')
    op.drop_table('price_history')
    op.drop_table('steel_index')
    op.drop_table('customers')
    op.drop_table('suppliers')
    op.drop_table('products')
    op.drop_table('company_master')
    op.drop_table('import_logs')
    op.drop_table('import_files')
    op.drop_table('import_jobs')
    op.drop_table('company_members')
    op.drop_table('roles')
    op.drop_table('users')
    op.drop_table('companies')
