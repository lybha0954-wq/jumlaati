# Feature Flags

21 ميزة — 1 نشطة، 20 معطلة.

## RLS
- read_all: SELECT للجميع
- admin_write: I/U/D لـ admin فقط

## تفعيل
UPDATE feature_flags SET enabled=true WHERE key='coupons';

## الفحص: node check_flags.js
