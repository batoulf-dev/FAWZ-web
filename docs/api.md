# Fawz — Endpoint Contract

**Project**: fawz
**Version**: 1.0.0
**Generated**: 2026-03-16T18:38:28.317338+00:00
**Prompt Hash**: `e760f56a6684...`
**Total Services**: 11
**Total Endpoints**: 193

## Table of Contents

- [backend-fawz-user-management](#backend-fawz-user-management) (39 endpoints)
- [backend-fawz-admin-operations](#backend-fawz-admin-operations) (22 endpoints)
- [backend-fawz-challenge-system](#backend-fawz-challenge-system) (20 endpoints)
- [backend-fawz-consumer-engagement](#backend-fawz-consumer-engagement) (16 endpoints)
- [backend-fawz-draw-management](#backend-fawz-draw-management) (23 endpoints)
- [backend-fawz-entry-generation](#backend-fawz-entry-generation) (14 endpoints)
- [backend-fawz-fraud-compliance](#backend-fawz-fraud-compliance) (14 endpoints)
- [backend-fawz-merchant-management](#backend-fawz-merchant-management) (8 endpoints)
- [backend-fawz-platform-management](#backend-fawz-platform-management) (14 endpoints)
- [backend-fawz-prize-payout-management](#backend-fawz-prize-payout-management) (12 endpoints)
- [backend-fawz-referral-system](#backend-fawz-referral-system) (11 endpoints)

## Authentication

All endpoints require authentication via encrypted JWT token.

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <AES-encrypted-JWT>` | Yes |
| `Content-Type` | `application/json` | Yes (POST/PATCH) |

**JWT Payload Claims**:
- `sub`: User identifier
- `user_id`: UUID of the authenticated user
- `tenant_id`: UUID of the tenant
- `role_id`: UUID of the user's role
- `permissions`: Array of permission strings
- `iss`: Token issuer (configured per deployment)
- `aud`: Token audience (configured per deployment)

## Response Contract

All responses follow the platform response contract:

| Operation | Response Format |
|-----------|----------------|
| POST (create) | `{"<entity>_id": "uuid", "message": "Entity Created Successfully"}` |
| GET (single) | Entity object directly (no wrapper) |
| GET (list) | `{"<entity>_list": [...], "total_<entities>": N, "page": 1, "page_size": 20}` |
| PATCH (update) | `{"message": "Entity Updated Successfully"}` |
| DELETE | `{"message": "Entity Deleted Successfully"}` |
| Error | `{"detail": "error message"}` |

## Token Acquisition

Tokens are acquired from the `backend-fawz-user-management` service via `POST /user/sign_up` (register) and `PATCH /user/login_user` (login). Pass the returned `encrypted_token` as `Authorization: Bearer <encrypted_token>` to all other endpoints.

See the **backend-fawz-user-management** section below for full endpoint documentation.

---

## backend-fawz-user-management

**Base URL**: `/api/v0/fawz_user_management`
**Port**: `10004`
**Description**: Platform user management service: registration, email verification, login (with profile), password reset/change, profile management, S3 image upload, admin user CRUD, role/permission management, tenant lifecycle, and JWT token issuance.

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_user_management/user/sign_up` | create | user | AccessLevel.PUBLIC |
| `PATCH` | `/api/v0/fawz_user_management/user/verify_user_email` | custom | user | AccessLevel.PUBLIC |
| `PATCH` | `/api/v0/fawz_user_management/user/login_user` | login | user | AccessLevel.PUBLIC |
| `POST` | `/api/v0/fawz_user_management/user/request_code` | custom | user | AccessLevel.PUBLIC |
| `POST` | `/api/v0/fawz_user_management/user/forgot_password` | custom | user | AccessLevel.PUBLIC |
| `PATCH` | `/api/v0/fawz_user_management/user/reset_password_by_user` | custom | user | AccessLevel.PUBLIC |
| `PATCH` | `/api/v0/fawz_user_management/user/change_password_by_user` | custom | user | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_user_management/user/change_password` | custom | user | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_user_management/user/update_profile` | update | user | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_user_management/user/me` | read | user | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_user_management/user/upload_profile_image` | custom | user | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_user_management/user/create_user_by_admin` | create | user | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/user/` | list | user | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/user/search` | list | user | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/user/{user_id}` | read | user | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/user/{user_id}/permissions` | read | user | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_user_management/user/{user_id}` | update | user | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_user_management/user/{user_id}` | delete | user | AccessLevel.ADMIN |
| `PUT` | `/api/v0/fawz_user_management/user/{user_id}/role` | update | user | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/role/permissions` | list | role | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_user_management/role` | create | role | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/role` | list | role | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/role/search` | list | role | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/role/{role_id}` | read | role | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_user_management/role/{role_id}` | update | role | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_user_management/role/{role_id}` | delete | role | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_user_management/role/{role_id}/permissions` | update | role | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_user_management/tenant` | create | tenant | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/tenant` | list | tenant | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/tenant/search` | list | tenant | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_user_management/tenant/{tenant_id}` | read | tenant | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_user_management/tenant/{tenant_id}` | update | tenant | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_user_management/tenant/{tenant_id}/status` | update | tenant | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_user_management/tenant/{tenant_id}` | delete | tenant | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_user_management/user/{user_id}/suspend` | custom | user | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_user_management/user/{user_id}/deactivate` | custom | user | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_user_management/user/{user_id}/reactivate` | custom | user | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_user_management/user/auth/sso/initiate` | custom | user | AccessLevel.PUBLIC |
| `POST` | `/api/v0/fawz_user_management/user/auth/sso/callback` | custom | user | AccessLevel.PUBLIC |

### Endpoint Details

#### `POST /api/v0/fawz_user_management/user/sign_up`

**Register a new user**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `app_id` | string | Yes | Public app identifier for the tenant |
| `first_name` | string | Yes | User's first name (1-150 chars) |
| `last_name` | string | Yes | User's last name (1-150 chars) |
| `email` | string (email) | Yes | User's email address |
| `password` | string | Yes | Password (6-16 chars, mixed case, digit, special) |
| `confirm_password` | string | Yes | Must match password |
| `phone_number` | string | No | E.164 phone number |
| `gender` | enum: ['Male', 'Female', 'Others'] | No | User's gender |
| `country` | string | No | Country (required if any address field present) |
| `city` | string | No | City (required if any address field present) |
| `state` | string | No | State or province |
| `street` | string | No | Street address |
| `zip_code` | string | No | 5-digit zip code |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | string | Created user UUID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | User created successfully |
| `409` | User already exists |
| `422` | Validation error |

**Example Request**:

```json
{
  "app_id": "fawz",
  "first_name": "AAG",
  "last_name": "TestUser",
  "email": "aag-test@aagtest.com",
  "password": "Pr0dCheck!9",
  "confirm_password": "Pr0dCheck!9"
}
```

**Example Response**:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "User Created Successfully"
}
```

#### `PATCH /api/v0/fawz_user_management/user/verify_user_email`

**Verify email with OTP code and activate user**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Email to verify |
| `verify_code` | string | Yes | 6-digit OTP or 8-10 char verification code |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `encrypted_token` | string | AES-256-CBC encrypted JWT token |
| `access_token` | string | Raw JWT token |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Email verified, tokens issued |
| `400` | Invalid or expired verification code |
| `404` | User not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "email": "aag-test@aagtest.com",
  "verify_code": "123456"
}
```

**Example Response**:

```json
{
  "message": "User Verified Successfully",
  "encrypted_token": "<AES-256-CBC encrypted JWT>",
  "access_token": "<raw JWT>"
}
```

#### `PATCH /api/v0/fawz_user_management/user/login_user`

**Login and get encrypted token with user profile**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Registered email |
| `password` | string | Yes | Account password |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `encrypted_token` | string | AES-256-CBC encrypted JWT token |
| `access_token` | string | Raw JWT token |
| `user` | object | Full user profile (GetUserByIdResponse) |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Login successful |
| `401` | Invalid credentials |
| `404` | User not found |

**Example Request**:

```json
{
  "email": "aag-test@aagtest.com",
  "password": "Pr0dCheck!9"
}
```

**Example Response**:

```json
{
  "message": "User Logged In Successfully",
  "encrypted_token": "<AES-256-CBC encrypted JWT>",
  "access_token": "<raw JWT>",
  "user": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "AAG",
    "last_name": "TestUser",
    "email": "aag-test@aagtest.com",
    "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
    "role_id": "770e8400-e29b-41d4-a716-446655440000",
    "user_status": "LoggedIn"
  }
}
```

#### `POST /api/v0/fawz_user_management/user/request_code`

**Request verification or password reset code**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Email to send code to |
| `code_type` | enum: ['EmailVerification', 'ResetCode'] | Yes | Type of code to send |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Code sent successfully |
| `404` | User not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "email": "aag-test@aagtest.com",
  "code_type": "EmailVerification"
}
```

**Example Response**:

```json
{
  "message": "Code Sent Successfully"
}
```

#### `POST /api/v0/fawz_user_management/user/forgot_password`

**Initiate password reset flow (sends reset code)**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Email for the account to reset |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Reset code sent |
| `404` | User not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "email": "aag-test@aagtest.com"
}
```

**Example Response**:

```json
{
  "message": "Code Sent Successfully"
}
```

#### `PATCH /api/v0/fawz_user_management/user/reset_password_by_user`

**Reset password using verification code**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Account email |
| `verify_code` | string | Yes | Reset code received via email |
| `new_password` | string | Yes | New password (6-16 chars) |
| `confirm_new_password` | string | Yes | Must match new_password |
| `code_type` | enum: ['EmailVerification', 'ResetCode'] | Yes | Type of verification code |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `encrypted_token` | string | AES-256-CBC encrypted JWT token |
| `access_token` | string | Raw JWT token |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Password reset, new tokens issued |
| `400` | Invalid or expired code |
| `404` | User not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "email": "aag-test@aagtest.com",
  "verify_code": "123456",
  "new_password": "NewPass!1",
  "confirm_new_password": "NewPass!1",
  "code_type": "ResetCode"
}
```

**Example Response**:

```json
{
  "message": "Password Reset Successfully",
  "encrypted_token": "<AES-256-CBC encrypted JWT>",
  "access_token": "<raw JWT>"
}
```

#### `PATCH /api/v0/fawz_user_management/user/change_password_by_user`

**Change own password (with old password verification)**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string (email) | Yes | Account email |
| `old_password` | string | Yes | Current password |
| `new_password` | string | Yes | New password (6-16 chars) |
| `confirm_new_password` | string | Yes | Must match new_password |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `encrypted_token` | string | AES-256-CBC encrypted JWT token |
| `access_token` | string | Raw JWT token |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Password changed, new tokens issued |
| `401` | Invalid old password or missing token |
| `404` | User not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "email": "aag-test@aagtest.com",
  "old_password": "Pr0dCheck!9",
  "new_password": "NewPass!1",
  "confirm_new_password": "NewPass!1"
}
```

**Example Response**:

```json
{
  "message": "Password Changed Successfully",
  "encrypted_token": "<AES-256-CBC encrypted JWT>",
  "access_token": "<raw JWT>"
}
```

#### `PATCH /api/v0/fawz_user_management/user/change_password`

**Change password using JWT principal (no email in body)**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `current_password` | string | Yes | Current password |
| `new_password` | string | Yes | New password (6-16 chars) |
| `confirm_new_password` | string | Yes | Must match new_password |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Password changed successfully |
| `401` | Invalid current password or missing token |
| `422` | Validation error |

**Example Request**:

```json
{
  "current_password": "Pr0dCheck!9",
  "new_password": "NewPass!1",
  "confirm_new_password": "NewPass!1"
}
```

**Example Response**:

```json
{
  "message": "Password Changed Successfully"
}
```

#### `PATCH /api/v0/fawz_user_management/user/update_profile`

**Update own profile (first_name, last_name)**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `first_name` | string | No | New first name (1-150 chars) |
| `last_name` | string | No | New last name (1-150 chars) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Profile updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `422` | Validation error — at least one field required |

**Example Request**:

```json
{
  "first_name": "UpdatedName"
}
```

**Example Response**:

```json
{
  "message": "User Updated Successfully"
}
```

#### `GET /api/v0/fawz_user_management/user/me`

**Get own profile with address**
**Access Level**: `AccessLevel.OWNER`

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | string | User UUID |
| `first_name` | string | User's first name |
| `last_name` | string | User's last name |
| `email` | string (email) | User's email address |
| `tenant_id` | string | Tenant UUID |
| `role_id` | string | Role UUID |
| `phone_number` | string | E.164 phone number |
| `address` | object | Nested address object |
| `gender` | string | User's gender |
| `user_status` | string | Current user status |
| `profile_image_url` | string | S3 profile image URL |
| `date_created` | string (date-time) | Creation timestamp |
| `date_modified` | string (date-time) | Last modification timestamp |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |

**Example Response**:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "AAG",
  "last_name": "TestUser",
  "email": "aag-test@aagtest.com",
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "role_id": "770e8400-e29b-41d4-a716-446655440000",
  "user_status": "Active",
  "date_created": "2026-01-01T00:00:00Z",
  "date_modified": "2026-01-01T00:00:00Z"
}
```

#### `POST /api/v0/fawz_user_management/user/upload_profile_image`

**Upload profile image via S3 (max 5MB, jpeg/png/webp)**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | string (binary) | Yes | Image file (JPEG, PNG, or WebP, max 5MB) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `profile_image_url` | string | S3 URL of uploaded image |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Image uploaded successfully |
| `400` | Invalid file type or size exceeds 5MB |
| `401` | Unauthorized — invalid or missing token |

**Example Response**:

```json
{
  "message": "Profile Image Uploaded Successfully",
  "profile_image_url": "https://s3.amazonaws.com/bucket/users/550e8400.jpg"
}
```

#### `POST /api/v0/fawz_user_management/user/create_user_by_admin`

**Create a user account (admin)**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `first_name` | string | Yes | User's first name |
| `last_name` | string | Yes | User's last name |
| `email` | string (email) | Yes | User's email address |
| `tenant_id` | string | Yes | Tenant UUID to assign |
| `role_id` | string | Yes | Role UUID to assign |
| `phone_number` | string | No | E.164 phone number |
| `gender` | enum: ['Male', 'Female', 'Others'] | No | User's gender |
| `country` | string | No | Country |
| `city` | string | No | City |
| `state` | string | No | State or province |
| `street` | string | No | Street address |
| `zip_code` | string | No | 5-digit zip code |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | string | Created user UUID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | User created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |
| `409` | User already exists |
| `422` | Validation error |

**Example Request**:

```json
{
  "first_name": "New",
  "last_name": "User",
  "email": "newuser@example.com",
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "role_id": "770e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response**:

```json
{
  "user_id": "880e8400-e29b-41d4-a716-446655440000",
  "message": "User Created Successfully"
}
```

#### `GET /api/v0/fawz_user_management/user/`

**Get paginated list of all users**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `tenant_id` | string | — | Filter parameter |
| `role_id` | string | — | Filter parameter |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `users_list` | array | Array of user profile objects |
| `total_users` | integer | Total user count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |

**Example Response**:

```json
{
  "users_list": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "first_name": "AAG",
      "last_name": "TestUser",
      "email": "aag-test@aagtest.com"
    }
  ],
  "total_users": 1
}
```

#### `GET /api/v0/fawz_user_management/user/search`

**Search users by name, email, status, or role**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | — | Filter parameter |
| `email` | string | — | Filter parameter |
| `user_status` | string | — | Filter parameter |
| `tenant_id` | string | — | Filter parameter |
| `role_id` | string | — | Filter parameter |
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `users_list` | array | Array of matching user profile objects |
| `total_users` | integer | Total matching user count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |

**Example Response**:

```json
{
  "users_list": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "first_name": "AAG",
      "last_name": "TestUser",
      "email": "aag-test@aagtest.com"
    }
  ],
  "total_users": 1
}
```

#### `GET /api/v0/fawz_user_management/user/{user_id}`

**Get user details by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string (UUID) | User Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | string | User UUID |
| `first_name` | string | User's first name |
| `last_name` | string | User's last name |
| `email` | string (email) | User's email address |
| `tenant_id` | string | Tenant UUID |
| `role_id` | string | Role UUID |
| `phone_number` | string | E.164 phone number |
| `address` | object | Nested address object |
| `gender` | string | User's gender |
| `user_status` | string | Current user status |
| `profile_image_url` | string | S3 profile image URL |
| `date_created` | string (date-time) | Creation timestamp |
| `date_modified` | string (date-time) | Last modification timestamp |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires permission |
| `404` | User not found |

**Example Response**:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "first_name": "AAG",
  "last_name": "TestUser",
  "email": "aag-test@aagtest.com",
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "role_id": "770e8400-e29b-41d4-a716-446655440000",
  "user_status": "Active",
  "date_created": "2026-01-01T00:00:00Z",
  "date_modified": "2026-01-01T00:00:00Z"
}
```

#### `GET /api/v0/fawz_user_management/user/{user_id}/permissions`

**Get user's permission list**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string (UUID) | User Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | string | User UUID |
| `role_id` | string | Role UUID |
| `permissions` | array | List of permission strings |
| `total_permissions` | integer | Total permission count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |
| `404` | User not found |

**Example Response**:

```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "role_id": "770e8400-e29b-41d4-a716-446655440000",
  "permissions": [
    "CreateUser",
    "GetAllUsers",
    "DeleteUserById"
  ],
  "total_permissions": 3
}
```

#### `PATCH /api/v0/fawz_user_management/user/{user_id}`

**Update user profile and address fields (admin)**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string (UUID) | User Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `first_name` | string | No | First name (1-150 chars) |
| `last_name` | string | No | Last name (1-150 chars) |
| `phone_number` | string | No | E.164 phone number |
| `gender` | enum: ['Male', 'Female', 'Others'] | No | User's gender |
| `country` | string | No | Country |
| `city` | string | No | City |
| `state` | string | No | State or province |
| `street` | string | No | Street address |
| `zip_code` | string | No | 5-digit zip code |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | User updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |
| `404` | User not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "first_name": "UpdatedName",
  "city": "New York"
}
```

**Example Response**:

```json
{
  "message": "User Updated Successfully"
}
```

#### `DELETE /api/v0/fawz_user_management/user/{user_id}`

**Soft delete a user**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string (UUID) | User Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | User deleted successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |
| `404` | User not found |

**Example Response**:

```json
{
  "message": "User Deleted Successfully"
}
```

#### `PUT /api/v0/fawz_user_management/user/{user_id}/role`

**Change a user's role (admin)**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_id` | string (UUID) | User Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role_id` | string | Yes | New role UUID to assign |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `encrypted_token` | string | AES-256-CBC encrypted JWT token |
| `access_token` | string | Raw JWT token |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Role changed, new tokens issued |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin permission |
| `404` | User or role not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "role_id": "990e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response**:

```json
{
  "message": "Role Changed Successfully",
  "encrypted_token": "<AES-256-CBC encrypted JWT>",
  "access_token": "<raw JWT>"
}
```

#### `GET /api/v0/fawz_user_management/role/permissions`

**Get all registered operation_id permissions**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `permissions_list` | array | Array of operation_id strings |
| `total_permissions` | integer | Total permission count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |

**Example Response**:

```json
{
  "permissions_list": [
    "CreateRole",
    "GetAllUsers",
    "DeleteUserById"
  ],
  "total_permissions": 3
}
```

#### `POST /api/v0/fawz_user_management/role`

**Create a new role**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role_name` | string | Yes | Role name (1-150 chars) |
| `tenant_id` | string | Yes | Tenant UUID to own this role |
| `role_description` | string | No | Role description |
| `role_permissions` | array | No | List of operation_id strings to grant |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `role_id` | string | Created role UUID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Role created successfully |
| `400` | Invalid or duplicate permissions |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `409` | Role name already exists in tenant |
| `422` | Validation error |

**Example Request**:

```json
{
  "role_name": "Editor",
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "role_permissions": [
    "GetAllUsers",
    "SearchUsers"
  ]
}
```

**Example Response**:

```json
{
  "role_id": "aa0e8400-e29b-41d4-a716-446655440000",
  "message": "Role Created Successfully"
}
```

#### `GET /api/v0/fawz_user_management/role`

**Get paginated list of all roles**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `tenant_id` | string | — | Filter parameter |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `roles_list` | array | Array of role objects |
| `total_roles` | integer | Total role count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |

**Example Response**:

```json
{
  "roles_list": [
    {
      "role_id": "aa0e8400-e29b-41d4-a716-446655440000",
      "role_name": "Editor",
      "role_permissions": [
        "GetAllUsers"
      ]
    }
  ],
  "total_roles": 1
}
```

#### `GET /api/v0/fawz_user_management/role/search`

**Search roles by name (case-insensitive partial match)**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `role_name` | string | — | Filter parameter |
| `tenant_id` | string | — | Filter parameter |
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `roles_list` | array | Array of matching role objects |
| `total_roles` | integer | Total matching role count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |

**Example Response**:

```json
{
  "roles_list": [
    {
      "role_id": "aa0e8400-e29b-41d4-a716-446655440000",
      "role_name": "Editor"
    }
  ],
  "total_roles": 1
}
```

#### `GET /api/v0/fawz_user_management/role/{role_id}`

**Get role details by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `role_id` | string (UUID) | Role Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `role_id` | string | Role UUID |
| `role_name` | string | Role display name |
| `role_description` | string | Role description |
| `role_permissions` | array | List of operation_id permission strings |
| `tenant_id` | string | Owning tenant UUID |
| `date_created` | string (date-time) | Creation timestamp |
| `date_modified` | string (date-time) | Last modification timestamp |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `404` | Role not found |

**Example Response**:

```json
{
  "role_id": "aa0e8400-e29b-41d4-a716-446655440000",
  "role_name": "Editor",
  "role_description": "Can view and edit content",
  "role_permissions": [
    "GetAllUsers",
    "SearchUsers"
  ],
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "date_created": "2026-01-01T00:00:00Z",
  "date_modified": "2026-01-01T00:00:00Z"
}
```

#### `PATCH /api/v0/fawz_user_management/role/{role_id}`

**Update role name or description**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `role_id` | string (UUID) | Role Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role_name` | string | No | New role name (1-150 chars) |
| `role_description` | string | No | New role description |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Role updated successfully |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `404` | Role not found |
| `409` | Role name already exists in tenant |
| `422` | Validation error — at least one field |

**Example Request**:

```json
{
  "role_name": "Senior Editor"
}
```

**Example Response**:

```json
{
  "message": "Role Updated Successfully"
}
```

#### `DELETE /api/v0/fawz_user_management/role/{role_id}`

**Soft delete a role (blocked if users assigned)**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `role_id` | string (UUID) | Role Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Role deleted successfully |
| `401` | Unauthorized |
| `403` | Forbidden — role in use or insufficient permission |
| `404` | Role not found |

**Example Response**:

```json
{
  "message": "Role Deleted Successfully"
}
```

#### `PATCH /api/v0/fawz_user_management/role/{role_id}/permissions`

**Add or remove permissions from a role**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `role_id` | string (UUID) | Role Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `added_permissions` | array | No | Operation_ids to add to the role |
| `removed_permissions` | array | No | Operation_ids to remove from the role |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Permissions updated successfully |
| `400` | Overlap between add/remove, duplicates, or invalid operation_ids |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `404` | Role not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "added_permissions": [
    "DeleteUserById"
  ],
  "removed_permissions": [
    "SearchUsers"
  ]
}
```

**Example Response**:

```json
{
  "message": "Role Permissions Updated Successfully"
}
```

#### `POST /api/v0/fawz_user_management/tenant`

**Create a new tenant**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenant_name` | string | Yes | Tenant name (1-150 chars) |
| `app_id` | string | Yes | Public app identifier (lowercase, alphanumeric+hyphen) |
| `tenant_description` | string | No | Tenant description (max 500 chars) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenant_id` | string | Created tenant UUID |
| `app_id` | string | Assigned app identifier |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Tenant created successfully |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `409` | Tenant name or app_id already exists |
| `422` | Validation error |

**Example Request**:

```json
{
  "tenant_name": "Acme Corp",
  "app_id": "acme-corp"
}
```

**Example Response**:

```json
{
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "app_id": "acme-corp",
  "message": "Tenant Created Successfully"
}
```

#### `GET /api/v0/fawz_user_management/tenant`

**Get paginated list of all tenants**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `tenant_status` | string | — | Filter parameter |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenants_list` | array | Array of tenant objects |
| `total_tenants` | integer | Total tenant count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |

**Example Response**:

```json
{
  "tenants_list": [
    {
      "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
      "tenant_name": "Acme Corp",
      "app_id": "acme-corp",
      "tenant_status": "Active"
    }
  ],
  "total_tenants": 1
}
```

#### `GET /api/v0/fawz_user_management/tenant/search`

**Search tenants by name (case-insensitive) and/or status**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `tenant_name` | string | — | Filter parameter |
| `tenant_status` | string | — | Filter parameter |
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenants_list` | array | Array of matching tenant objects |
| `total_tenants` | integer | Total matching tenant count |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |

**Example Response**:

```json
{
  "tenants_list": [
    {
      "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
      "tenant_name": "Acme Corp",
      "tenant_status": "Active"
    }
  ],
  "total_tenants": 1
}
```

#### `GET /api/v0/fawz_user_management/tenant/{tenant_id}`

**Get tenant details by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenant_id` | string (UUID) | Tenant Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenant_id` | string | Tenant UUID |
| `tenant_name` | string | Tenant display name |
| `app_id` | string | Public app identifier (lowercase, hyphenated) |
| `tenant_description` | string | Tenant description |
| `tenant_status` | string | Current tenant status |
| `date_created` | string (date-time) | Creation timestamp |
| `date_modified` | string (date-time) | Last modification timestamp |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `404` | Tenant not found |

**Example Response**:

```json
{
  "tenant_id": "660e8400-e29b-41d4-a716-446655440000",
  "tenant_name": "Acme Corp",
  "app_id": "acme-corp",
  "tenant_status": "Active",
  "date_created": "2026-01-01T00:00:00Z",
  "date_modified": "2026-01-01T00:00:00Z"
}
```

#### `PATCH /api/v0/fawz_user_management/tenant/{tenant_id}`

**Update tenant name, app_id, or description**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenant_id` | string (UUID) | Tenant Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenant_name` | string | No | New tenant name |
| `app_id` | string | No | New app identifier |
| `tenant_description` | string | No | New description |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Tenant updated successfully |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `404` | Tenant not found |
| `409` | Name or app_id already exists |
| `422` | Validation error — at least one field |

**Example Request**:

```json
{
  "tenant_name": "Acme Inc."
}
```

**Example Response**:

```json
{
  "message": "Tenant Updated Successfully"
}
```

#### `PATCH /api/v0/fawz_user_management/tenant/{tenant_id}/status`

**Change tenant status (Active/Archived/Suspended)**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenant_id` | string (UUID) | Tenant Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tenant_status` | enum: ['Active', 'Archived', 'Suspended'] | Yes | New tenant status |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Status updated successfully |
| `401` | Unauthorized |
| `403` | Forbidden — requires permission |
| `404` | Tenant not found |
| `422` | Validation error |

**Example Request**:

```json
{
  "tenant_status": "Suspended"
}
```

**Example Response**:

```json
{
  "message": "Tenant Status Updated Successfully"
}
```

#### `DELETE /api/v0/fawz_user_management/tenant/{tenant_id}`

**Soft delete a tenant (blocked if users or roles exist)**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenant_id` | string (UUID) | Tenant Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Tenant deleted successfully |
| `401` | Unauthorized |
| `403` | Forbidden — tenant has active dependencies or insufficient permission |
| `404` | Tenant not found |

**Example Response**:

```json
{
  "message": "Tenant Deleted Successfully"
}
```

#### `POST /api/v0/fawz_user_management/user/{user_id}/suspend`

**Suspend a user account, preventing login while preserving the account**
**Access Level**: `AccessLevel.ADMIN`

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | User suspended successfully |
| `404` | User not found |
| `409` | User not in a suspendable state |

**Example Response**:

```json
{
  "message": "User suspended successfully"
}
```

#### `POST /api/v0/fawz_user_management/user/{user_id}/deactivate`

**Deactivate a user account — stronger restriction than suspend**
**Access Level**: `AccessLevel.ADMIN`

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | User deactivated successfully |
| `404` | User not found |
| `409` | User not in a deactivatable state |

**Example Response**:

```json
{
  "message": "User deactivated successfully"
}
```

#### `POST /api/v0/fawz_user_management/user/{user_id}/reactivate`

**Reactivate a suspended or deactivated user account**
**Access Level**: `AccessLevel.ADMIN`

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | User reactivated successfully |
| `404` | User not found |
| `409` | User not in a reactivatable state |

**Example Response**:

```json
{
  "message": "User reactivated successfully"
}
```

#### `POST /api/v0/fawz_user_management/user/auth/sso/initiate`

**Initiate SSO authentication flow with an external provider**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `provider` | enum: ['google', 'microsoft', 'okta'] | Yes | SSO provider name (google, microsoft, okta) |
| `app_id` | string | Yes | Public app identifier for the tenant |
| `redirect_uri` | string | No | Optional callback URL override |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `authorization_url` | string | URL to redirect the user to for SSO authentication |
| `state` | string | CSRF state token to verify on callback |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Authorization URL generated |
| `400` | Unsupported SSO provider |
| `404` | Tenant not found for app_id |

**Example Request**:

```json
{
  "provider": "google",
  "app_id": "my-app"
}
```

**Example Response**:

```json
{
  "authorization_url": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "a1b2c3d4e5f6"
}
```

#### `POST /api/v0/fawz_user_management/user/auth/sso/callback`

**Handle SSO provider callback after user authenticates**
**Access Level**: `AccessLevel.PUBLIC`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Authorization code from SSO provider |
| `state` | string | Yes | CSRF state token for verification |
| `app_id` | string | Yes | Public app identifier for the tenant |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |
| `encrypted_token` | string | AES-256-CBC encrypted JWT token |
| `access_token` | string | Raw JWT token |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | SSO login successful, tokens issued |
| `400` | Invalid state token or authorization code |
| `404` | Tenant not found for app_id |
| `501` | SSO provider not yet configured |

**Example Request**:

```json
{
  "code": "4/0AXEi...",
  "state": "a1b2c3d4e5f6",
  "app_id": "my-app"
}
```

**Example Response**:

```json
{
  "message": "SSO Login Successful",
  "encrypted_token": "<AES-256-CBC encrypted JWT>",
  "access_token": "<raw JWT>"
}
```

---

## backend-fawz-admin-operations

**Base URL**: `/api/v0/fawz_admin_operations`
**Port**: `8001`
**Description**: Provides the admin control plane including secure admin authentication with MFA and IP whitelisting, operator token provisioning for Al Rabiaa draw tablet, configurable system parameters management with versioned history, and immutable append-only audit logging. Contains admin_user, admin_session, admin_ip_whitelist, operator_token, system_configuration, system_configuration_history, and audit_log entities. All admin actions require two-factor authentication and are fully audited. References draw entities via string ID for operator token scoping

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_admin_operations/admin_ip_whitelists` | create | admin_ip_whitelist | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/admin_ip_whitelists/{admin_ip_whitelist_id}` | read | admin_ip_whitelist | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/admin_ip_whitelists` | list | admin_ip_whitelist | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_admin_operations/admin_ip_whitelists/{admin_ip_whitelist_id}` | update | admin_ip_whitelist | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_admin_operations/admin_ip_whitelists/{admin_ip_whitelist_id}` | delete | admin_ip_whitelist | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_admin_operations/admin_sessions` | create | admin_session | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/admin_sessions/{admin_session_id}` | read | admin_session | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/admin_sessions` | list | admin_session | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_admin_operations/admin_sessions/{admin_session_id}` | delete | admin_session | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_admin_operations/audit_logs` | create | audit_log | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/audit_logs/{audit_log_id}` | read | audit_log | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/audit_logs` | list | audit_log | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_admin_operations/operator_tokens` | create | operator_token | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/operator_tokens/{operator_token_id}` | read | operator_token | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/operator_tokens` | list | operator_token | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_admin_operations/system_configurations` | create | system_configuration | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/system_configurations/{system_configuration_id}` | read | system_configuration | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/system_configurations` | list | system_configuration | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_admin_operations/system_configurations/{system_configuration_id}` | update | system_configuration | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_admin_operations/system_configuration_histories` | create | system_configuration_history | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/system_configuration_histories/{system_configuration_history_id}` | read | system_configuration_history | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_admin_operations/system_configuration_histories` | list | system_configuration_history | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_admin_operations/admin_ip_whitelists`

**Create a new admin ip whitelist**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | — |
| `ip_address` | string | Yes | IPv4 or IPv6 address |
| `ip_range_cidr` | string | No | CIDR notation for IP range |
| `is_active` | boolean | No | — |
| `location` | string | No | Human-readable location label (e.g. Office, Studio) |
| `valid_from` | string (date-time) | Yes | — |
| `valid_until` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `admin_ip_whitelist_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "description": "example_description",
  "ip_address": "example_ip_address",
  "ip_range_cidr": "example_ip_range_cidr",
  "is_active": true,
  "location": "example_location",
  "valid_from": "2026-01-01T00:00:00Z",
  "valid_until": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "admin_ip_whitelist_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "AdminIpWhitelist Created Successfully"
}
```

#### `GET /api/v0/fawz_admin_operations/admin_ip_whitelists/{admin_ip_whitelist_id}`

**Get admin ip whitelist by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `admin_ip_whitelist_id` | string (UUID) | Admin Ip Whitelist Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `admin_ip_whitelist_id` | string | — |
| `tenant_id` | string | — |
| `description` | string | — |
| `ip_address` | string | IPv4 or IPv6 address |
| `ip_range_cidr` | string | CIDR notation for IP range |
| `is_active` | boolean | — |
| `location` | string | Human-readable location label (e.g. Office, Studio) |
| `valid_from` | string (date-time) | — |
| `valid_until` | string (date-time) | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "admin_ip_whitelist_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "description": "example_description",
  "ip_address": "example_ip_address",
  "ip_range_cidr": "example_ip_range_cidr",
  "is_active": true,
  "location": "example_location",
  "valid_from": "2026-01-01T00:00:00Z",
  "valid_until": "2026-01-01T00:00:00Z",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_admin_operations/admin_ip_whitelists`

**List admin ip whitelists**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `is_active` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `admin_ip_whitelists_list` | array | Array of admin_ip_whitelist objects |
| `total_admin_ip_whitelists` | integer | Total count of admin_ip_whitelists |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "admin_ip_whitelists_list": [
    {
      "admin_ip_whitelist_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "description": "example_description",
      "ip_address": "example_ip_address",
      "ip_range_cidr": "example_ip_range_cidr",
      "is_active": true,
      "location": "example_location",
      "valid_from": "2026-01-01T00:00:00Z",
      "valid_until": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_admin_ip_whitelists": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_admin_operations/admin_ip_whitelists/{admin_ip_whitelist_id}`

**Update admin ip whitelist**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `admin_ip_whitelist_id` | string (UUID) | Admin Ip Whitelist Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | — |
| `ip_address` | string | No | IPv4 or IPv6 address |
| `ip_range_cidr` | string | No | CIDR notation for IP range |
| `is_active` | boolean | No | — |
| `location` | string | No | Human-readable location label (e.g. Office, Studio) |
| `valid_from` | string (date-time) | No | — |
| `valid_until` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "description": "example_description"
}
```

**Example Response**:

```json
{
  "message": "AdminIpWhitelist Updated Successfully"
}
```

#### `DELETE /api/v0/fawz_admin_operations/admin_ip_whitelists/{admin_ip_whitelist_id}`

**Delete admin ip whitelist**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `admin_ip_whitelist_id` | string (UUID) | Admin Ip Whitelist Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Deleted successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "message": "AdminIpWhitelist Deleted Successfully"
}
```

#### `POST /api/v0/fawz_admin_operations/admin_sessions`

**Create a new admin session**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `admin_id` | string | Yes | Reference to admin_user |
| `expires_at` | string (date-time) | Yes | — |
| `invalidated_at` | string (date-time) | No | — |
| `invalidated_reason` | string | No | — |
| `ip_address` | string | Yes | — |
| `is_active` | boolean | No | — |
| `last_activity_at` | string (date-time) | Yes | — |
| `mfa_verified` | boolean | No | — |
| `mfa_verified_at` | string (date-time) | No | — |
| `scoped_draw_id` | string | No | Draw ID scope for operator sessions |
| `scoped_permissions` | string | No | JSON permissions for scoped operator sessions |
| `session_token_hash` | string | Yes | — |
| `user_agent` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `admin_session_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "admin_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_at": "2026-01-01T00:00:00Z",
  "invalidated_at": "2026-01-01T00:00:00Z",
  "invalidated_reason": "example_invalidated_reason",
  "ip_address": "example_ip_address",
  "is_active": true,
  "last_activity_at": "2026-01-01T00:00:00Z",
  "mfa_verified": false,
  "mfa_verified_at": "2026-01-01T00:00:00Z",
  "scoped_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "scoped_permissions": "example_scoped_permissions",
  "session_token_hash": "example_session_token_hash",
  "user_agent": "example_user_agent"
}
```

**Example Response**:

```json
{
  "admin_session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "AdminSession Created Successfully"
}
```

#### `GET /api/v0/fawz_admin_operations/admin_sessions/{admin_session_id}`

**Get admin session by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `admin_session_id` | string (UUID) | Admin Session Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `admin_session_id` | string | — |
| `tenant_id` | string | — |
| `admin_id` | string | Reference to admin_user |
| `expires_at` | string (date-time) | — |
| `invalidated_at` | string (date-time) | — |
| `invalidated_reason` | string | — |
| `ip_address` | string | — |
| `is_active` | boolean | — |
| `last_activity_at` | string (date-time) | — |
| `mfa_verified` | boolean | — |
| `mfa_verified_at` | string (date-time) | — |
| `scoped_draw_id` | string | Draw ID scope for operator sessions |
| `scoped_permissions` | string | JSON permissions for scoped operator sessions |
| `session_token_hash` | string | — |
| `user_agent` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "admin_session_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "admin_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_at": "2026-01-01T00:00:00Z",
  "invalidated_at": "2026-01-01T00:00:00Z",
  "invalidated_reason": "example_invalidated_reason",
  "ip_address": "example_ip_address",
  "is_active": true,
  "last_activity_at": "2026-01-01T00:00:00Z",
  "mfa_verified": false,
  "mfa_verified_at": "2026-01-01T00:00:00Z",
  "scoped_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "scoped_permissions": "example_scoped_permissions",
  "session_token_hash": "example_session_token_hash",
  "user_agent": "example_user_agent",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_admin_operations/admin_sessions`

**List admin sessions**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `admin_id` | string | — | Filter parameter |
| `is_active` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `admin_sessions_list` | array | Array of admin_session objects |
| `total_admin_sessions` | integer | Total count of admin_sessions |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "admin_sessions_list": [
    {
      "admin_session_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "admin_id": "550e8400-e29b-41d4-a716-446655440000",
      "expires_at": "2026-01-01T00:00:00Z",
      "invalidated_at": "2026-01-01T00:00:00Z",
      "invalidated_reason": "example_invalidated_reason",
      "ip_address": "example_ip_address",
      "is_active": true,
      "last_activity_at": "2026-01-01T00:00:00Z",
      "mfa_verified": false,
      "mfa_verified_at": "2026-01-01T00:00:00Z",
      "scoped_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "scoped_permissions": "example_scoped_permissions",
      "session_token_hash": "example_session_token_hash",
      "user_agent": "example_user_agent",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_admin_sessions": 1,
  "page": 1,
  "page_size": 20
}
```

#### `DELETE /api/v0/fawz_admin_operations/admin_sessions/{admin_session_id}`

**Delete admin session**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `admin_session_id` | string (UUID) | Admin Session Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Deleted successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "message": "AdminSession Deleted Successfully"
}
```

#### `POST /api/v0/fawz_admin_operations/audit_logs`

**Create a new audit log**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `action_category` | enum: ['account_management', 'authentication', 'challenge_operation', 'dispute_resolution', 'draw_operation', 'entry_generation', 'fraud_review', 'notification', 'payout_operation', 'referral_operation', 'system_configuration'] | No | — |
| `action_type` | enum: ['account_reinstated', 'account_suspended', 'admin_login_failure', 'admin_login_success', 'challenge_activated', 'challenge_created', 'challenge_deactivated', 'config_updated', 'dispute_resolved', 'dispute_submitted', 'draw_digit_entered', 'draw_finalized', 'draw_pool_snapshotted', 'draw_pre_generated', 'draw_scheduled', 'entry_generated', 'fraud_case_created', 'fraud_case_decided', 'prize_credited', 'referral_rewarded', 'winner_export'] | No | — |
| `actor_id` | string | No | — |
| `actor_type` | enum: ['admin', 'consumer', 'merchant', 'operator', 'system', 'user'] | Yes | — |
| `after_state` | string | No | JSON of object state after action |
| `before_state` | string | No | JSON of object state before action |
| `ip_address` | string | No | — |
| `meta_data` | string | No | Additional JSON metadata |
| `object_id` | string | No | — |
| `object_type` | string | Yes | — |
| `request_id` | string | No | — |
| `session_id` | string | No | — |
| `timestamp` | string (date-time) | Yes | — |
| `user_agent` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `audit_log_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "action_category": "account_management",
  "action_type": "account_reinstated",
  "actor_id": "550e8400-e29b-41d4-a716-446655440000",
  "actor_type": "admin",
  "after_state": "example_after_state",
  "before_state": "example_before_state",
  "ip_address": "example_ip_address",
  "meta_data": "example_meta_data",
  "object_id": "550e8400-e29b-41d4-a716-446655440000",
  "object_type": "example_object_type",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-01-01T00:00:00Z",
  "user_agent": "example_user_agent"
}
```

**Example Response**:

```json
{
  "audit_log_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "AuditLog Created Successfully"
}
```

#### `GET /api/v0/fawz_admin_operations/audit_logs/{audit_log_id}`

**Get audit log by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `audit_log_id` | string (UUID) | Audit Log Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `audit_log_id` | string | — |
| `tenant_id` | string | — |
| `action_category` | string | — |
| `action_type` | string | — |
| `actor_id` | string | — |
| `actor_type` | string | — |
| `after_state` | string | JSON of object state after action |
| `before_state` | string | JSON of object state before action |
| `ip_address` | string | — |
| `meta_data` | string | Additional JSON metadata |
| `object_id` | string | — |
| `object_type` | string | — |
| `request_id` | string | — |
| `session_id` | string | — |
| `timestamp` | string (date-time) | — |
| `user_agent` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "audit_log_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "action_category": "account_management",
  "action_type": "account_reinstated",
  "actor_id": "550e8400-e29b-41d4-a716-446655440000",
  "actor_type": "admin",
  "after_state": "example_after_state",
  "before_state": "example_before_state",
  "ip_address": "example_ip_address",
  "meta_data": "example_meta_data",
  "object_id": "550e8400-e29b-41d4-a716-446655440000",
  "object_type": "example_object_type",
  "request_id": "550e8400-e29b-41d4-a716-446655440000",
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-01-01T00:00:00Z",
  "user_agent": "example_user_agent",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_admin_operations/audit_logs`

**List audit logs**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `action_category` | string | — | Filter parameter |
| `action_type` | string | — | Filter parameter |
| `actor_id` | string | — | Filter parameter |
| `actor_type` | string | — | Filter parameter |
| `object_id` | string | — | Filter parameter |
| `object_type` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `audit_logs_list` | array | Array of audit_log objects |
| `total_audit_logs` | integer | Total count of audit_logs |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "audit_logs_list": [
    {
      "audit_log_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "action_category": "account_management",
      "action_type": "account_reinstated",
      "actor_id": "550e8400-e29b-41d4-a716-446655440000",
      "actor_type": "admin",
      "after_state": "example_after_state",
      "before_state": "example_before_state",
      "ip_address": "example_ip_address",
      "meta_data": "example_meta_data",
      "object_id": "550e8400-e29b-41d4-a716-446655440000",
      "object_type": "example_object_type",
      "request_id": "550e8400-e29b-41d4-a716-446655440000",
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "timestamp": "2026-01-01T00:00:00Z",
      "user_agent": "example_user_agent",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_audit_logs": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_admin_operations/operator_tokens`

**Create a new operator token**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `admin_id` | string | Yes | Admin user this token belongs to |
| `allowed_ip_addresses` | string | No | JSON array of allowed studio IPs |
| `draw_id` | string | Yes | Draw this token is scoped to |
| `expires_at` | string (date-time) | Yes | — |
| `is_used` | boolean | No | — |
| `token_hash` | string | Yes | — |
| `used_at` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `operator_token_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "admin_id": "550e8400-e29b-41d4-a716-446655440000",
  "allowed_ip_addresses": "example_allowed_ip_addresses",
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_at": "2026-01-01T00:00:00Z",
  "is_used": false,
  "token_hash": "example_token_hash",
  "used_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "operator_token_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "OperatorToken Created Successfully"
}
```

#### `GET /api/v0/fawz_admin_operations/operator_tokens/{operator_token_id}`

**Get operator token by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `operator_token_id` | string (UUID) | Operator Token Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `operator_token_id` | string | — |
| `tenant_id` | string | — |
| `admin_id` | string | Admin user this token belongs to |
| `allowed_ip_addresses` | string | JSON array of allowed studio IPs |
| `draw_id` | string | Draw this token is scoped to |
| `expires_at` | string (date-time) | — |
| `is_used` | boolean | — |
| `token_hash` | string | — |
| `used_at` | string (date-time) | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "operator_token_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "admin_id": "550e8400-e29b-41d4-a716-446655440000",
  "allowed_ip_addresses": "example_allowed_ip_addresses",
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_at": "2026-01-01T00:00:00Z",
  "is_used": false,
  "token_hash": "example_token_hash",
  "used_at": "2026-01-01T00:00:00Z",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_admin_operations/operator_tokens`

**List operator tokens**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_id` | string | — | Filter parameter |
| `is_used` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `operator_tokens_list` | array | Array of operator_token objects |
| `total_operator_tokens` | integer | Total count of operator_tokens |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "operator_tokens_list": [
    {
      "operator_token_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "admin_id": "550e8400-e29b-41d4-a716-446655440000",
      "allowed_ip_addresses": "example_allowed_ip_addresses",
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "expires_at": "2026-01-01T00:00:00Z",
      "is_used": false,
      "token_hash": "example_token_hash",
      "used_at": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_operator_tokens": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_admin_operations/system_configurations`

**Create a new system configuration**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config_group` | enum: ['challenge_rules', 'entry_rules', 'fraud_rules', 'merchant_rules', 'payout_rules', 'referral_rules', 'system_rules'] | Yes | — |
| `config_key` | string | Yes | — |
| `config_type` | enum: ['boolean', 'decimal', 'integer', 'json', 'string'] | No | — |
| `config_value` | string | Yes | — |
| `description` | string | No | — |
| `effective_from` | string (date-time) | Yes | — |
| `effective_until` | string (date-time) | No | — |
| `is_active` | boolean | No | — |
| `is_sensitive` | boolean | No | — |
| `max_value` | number | No | — |
| `min_value` | number | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `system_configuration_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "config_group": "challenge_rules",
  "config_key": "example_config_key",
  "config_type": "boolean",
  "config_value": "example_config_value",
  "description": "example_description",
  "effective_from": "2026-01-01T00:00:00Z",
  "effective_until": "2026-01-01T00:00:00Z",
  "is_active": true,
  "is_sensitive": false,
  "max_value": "100.00",
  "min_value": "100.00"
}
```

**Example Response**:

```json
{
  "system_configuration_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "SystemConfiguration Created Successfully"
}
```

#### `GET /api/v0/fawz_admin_operations/system_configurations/{system_configuration_id}`

**Get system configuration by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `system_configuration_id` | string (UUID) | System Configuration Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `system_configuration_id` | string | — |
| `tenant_id` | string | — |
| `config_group` | string | — |
| `config_key` | string | — |
| `config_type` | string | — |
| `config_value` | string | — |
| `description` | string | — |
| `effective_from` | string (date-time) | — |
| `effective_until` | string (date-time) | — |
| `is_active` | boolean | — |
| `is_sensitive` | boolean | — |
| `max_value` | number | — |
| `min_value` | number | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "system_configuration_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "config_group": "challenge_rules",
  "config_key": "example_config_key",
  "config_type": "boolean",
  "config_value": "example_config_value",
  "description": "example_description",
  "effective_from": "2026-01-01T00:00:00Z",
  "effective_until": "2026-01-01T00:00:00Z",
  "is_active": true,
  "is_sensitive": false,
  "max_value": "100.00",
  "min_value": "100.00",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_admin_operations/system_configurations`

**List system configurations**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `config_group` | string | — | Filter parameter |
| `config_key` | string | — | Filter parameter |
| `is_active` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `system_configurations_list` | array | Array of system_configuration objects |
| `total_system_configurations` | integer | Total count of system_configurations |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "system_configurations_list": [
    {
      "system_configuration_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "config_group": "challenge_rules",
      "config_key": "example_config_key",
      "config_type": "boolean",
      "config_value": "example_config_value",
      "description": "example_description",
      "effective_from": "2026-01-01T00:00:00Z",
      "effective_until": "2026-01-01T00:00:00Z",
      "is_active": true,
      "is_sensitive": false,
      "max_value": "100.00",
      "min_value": "100.00",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_system_configurations": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_admin_operations/system_configurations/{system_configuration_id}`

**Update system configuration**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `system_configuration_id` | string (UUID) | System Configuration Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `config_group` | enum: ['challenge_rules', 'entry_rules', 'fraud_rules', 'merchant_rules', 'payout_rules', 'referral_rules', 'system_rules'] | No | — |
| `config_key` | string | No | — |
| `config_type` | enum: ['boolean', 'decimal', 'integer', 'json', 'string'] | No | — |
| `config_value` | string | No | — |
| `description` | string | No | — |
| `effective_from` | string (date-time) | No | — |
| `effective_until` | string (date-time) | No | — |
| `is_active` | boolean | No | — |
| `is_sensitive` | boolean | No | — |
| `max_value` | number | No | — |
| `min_value` | number | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "config_group": "challenge_rules"
}
```

**Example Response**:

```json
{
  "message": "SystemConfiguration Updated Successfully"
}
```

#### `POST /api/v0/fawz_admin_operations/system_configuration_histories`

**Create a new system configuration history**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `change_reason` | string | No | — |
| `changed_at` | string (date-time) | Yes | — |
| `changed_by` | string | Yes | Admin user who made the change |
| `config_id` | string | Yes | Reference to system_configuration |
| `config_key` | string | Yes | — |
| `new_value` | string | Yes | — |
| `old_value` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `system_configuration_history_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "change_reason": "example_change_reason",
  "changed_at": "2026-01-01T00:00:00Z",
  "changed_by": "example_changed_by",
  "config_id": "550e8400-e29b-41d4-a716-446655440000",
  "config_key": "example_config_key",
  "new_value": "example_new_value",
  "old_value": "example_old_value"
}
```

**Example Response**:

```json
{
  "system_configuration_history_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "SystemConfigurationHistory Created Successfully"
}
```

#### `GET /api/v0/fawz_admin_operations/system_configuration_histories/{system_configuration_history_id}`

**Get system configuration history by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `system_configuration_history_id` | string (UUID) | System Configuration History Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `system_configuration_history_id` | string | — |
| `tenant_id` | string | — |
| `change_reason` | string | — |
| `changed_at` | string (date-time) | — |
| `changed_by` | string | Admin user who made the change |
| `config_id` | string | Reference to system_configuration |
| `config_key` | string | — |
| `new_value` | string | — |
| `old_value` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "system_configuration_history_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "change_reason": "example_change_reason",
  "changed_at": "2026-01-01T00:00:00Z",
  "changed_by": "example_changed_by",
  "config_id": "550e8400-e29b-41d4-a716-446655440000",
  "config_key": "example_config_key",
  "new_value": "example_new_value",
  "old_value": "example_old_value",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_admin_operations/system_configuration_histories`

**List system configuration histories**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `changed_by` | string | — | Filter parameter |
| `config_id` | string | — | Filter parameter |
| `config_key` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `system_configuration_histories_list` | array | Array of system_configuration_history objects |
| `total_system_configuration_histories` | integer | Total count of system_configuration_histories |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "system_configuration_histories_list": [
    {
      "system_configuration_history_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "change_reason": "example_change_reason",
      "changed_at": "2026-01-01T00:00:00Z",
      "changed_by": "example_changed_by",
      "config_id": "550e8400-e29b-41d4-a716-446655440000",
      "config_key": "example_config_key",
      "new_value": "example_new_value",
      "old_value": "example_old_value",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_system_configuration_histories": 1,
  "page": 1,
  "page_size": 20
}
```

---

## backend-fawz-challenge-system

**Base URL**: `/api/v0/fawz_challenge_system`
**Port**: `8002`
**Description**: Manages Fawz engagement challenges including onboarding set (4 challenges for new users), Weekly Spark streak, monthly rotating challenges, and community challenges. Contains challenge, user_challenge_progress, community_challenge_score, badge, and user_badge entities linked by foreign keys. Challenges follow a draft→scheduled→active→expired lifecycle. Progress tracking is real-time with checkpoint-based progressive rewards. References consumer_user via string ID

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_challenge_system/badges` | create | badge | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_challenge_system/badges/{badge_id}` | read | badge | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/badges` | list | badge | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_challenge_system/badges/{badge_id}` | update | badge | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_challenge_system/challenges` | create | challenge | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_challenge_system/challenges/{challenge_id}` | read | challenge | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/challenges` | list | challenge | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_challenge_system/challenges/{challenge_id}` | update | challenge | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_challenge_system/challenges/{challenge_id}` | delete | challenge | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_challenge_system/community_challenge_scores` | create | community_challenge_score | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_challenge_system/community_challenge_scores/{community_challenge_score_id}` | read | community_challenge_score | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/community_challenge_scores` | list | community_challenge_score | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_challenge_system/community_challenge_scores/{community_challenge_score_id}` | update | community_challenge_score | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_challenge_system/user_badges` | create | user_badge | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/user_badges/{user_badge_id}` | read | user_badge | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/user_badges` | list | user_badge | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_challenge_system/user_challenge_progresses` | create | user_challenge_progress | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/user_challenge_progresses/{user_challenge_progress_id}` | read | user_challenge_progress | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_challenge_system/user_challenge_progresses` | list | user_challenge_progress | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_challenge_system/user_challenge_progresses/{user_challenge_progress_id}` | update | user_challenge_progress | AccessLevel.OWNER |

### Endpoint Details

#### `POST /api/v0/fawz_challenge_system/badges`

**Create a new badge**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `badge_code` | string | Yes | — |
| `badge_type` | enum: ['ambassador', 'challenge', 'milestone', 'onboarding', 'special'] | Yes | — |
| `description_ar` | string | No | — |
| `description_en` | string | No | — |
| `display_order` | integer | No | — |
| `icon_url` | string | No | — |
| `is_active` | boolean | No | — |
| `name_ar` | string | Yes | — |
| `name_en` | string | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `badge_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "badge_code": "EXAMPLE_CODE",
  "badge_type": "ambassador",
  "description_ar": "example_description_ar",
  "description_en": "example_description_en",
  "display_order": 0,
  "icon_url": "example_icon_url",
  "is_active": true,
  "name_ar": "example_name_ar",
  "name_en": "example_name_en"
}
```

**Example Response**:

```json
{
  "badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Badge Created Successfully"
}
```

#### `GET /api/v0/fawz_challenge_system/badges/{badge_id}`

**Get badge by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `badge_id` | string (UUID) | Badge Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `badge_id` | string | — |
| `tenant_id` | string | — |
| `badge_code` | string | — |
| `badge_type` | string | — |
| `description_ar` | string | — |
| `description_en` | string | — |
| `display_order` | integer | — |
| `icon_url` | string | — |
| `is_active` | boolean | — |
| `name_ar` | string | — |
| `name_en` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "badge_code": "EXAMPLE_CODE",
  "badge_type": "ambassador",
  "description_ar": "example_description_ar",
  "description_en": "example_description_en",
  "display_order": 0,
  "icon_url": "example_icon_url",
  "is_active": true,
  "name_ar": "example_name_ar",
  "name_en": "example_name_en",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_challenge_system/badges`

**List badges**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `badge_type` | string | — | Filter parameter |
| `is_active` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `badges_list` | array | Array of badge objects |
| `total_badges` | integer | Total count of badges |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "badges_list": [
    {
      "badge_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "badge_code": "EXAMPLE_CODE",
      "badge_type": "ambassador",
      "description_ar": "example_description_ar",
      "description_en": "example_description_en",
      "display_order": 0,
      "icon_url": "example_icon_url",
      "is_active": true,
      "name_ar": "example_name_ar",
      "name_en": "example_name_en",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_badges": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_challenge_system/badges/{badge_id}`

**Update badge**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `badge_id` | string (UUID) | Badge Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `badge_code` | string | No | — |
| `badge_type` | enum: ['ambassador', 'challenge', 'milestone', 'onboarding', 'special'] | No | — |
| `description_ar` | string | No | — |
| `description_en` | string | No | — |
| `display_order` | integer | No | — |
| `icon_url` | string | No | — |
| `is_active` | boolean | No | — |
| `name_ar` | string | No | — |
| `name_en` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "badge_code": "EXAMPLE_CODE"
}
```

**Example Response**:

```json
{
  "message": "Badge Updated Successfully"
}
```

#### `POST /api/v0/fawz_challenge_system/challenges`

**Create a new challenge**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `activated_at` | string (date-time) | No | — |
| `category_filter` | string | No | Transaction category filter (e.g. fuel, grocery) |
| `challenge_type` | enum: ['community', 'monthly_fire', 'onboarding', 'rotating', 'streak', 'weekly_spark'] | Yes | — |
| `checkpoints` | string | No | JSON array of checkpoint definitions [{at, reward_entries}] |
| `deactivated_at` | string (date-time) | No | — |
| `deleted_at` | string (date-time) | No | — |
| `description_ar` | string | No | — |
| `description_en` | string | No | — |
| `display_order` | integer | No | — |
| `end_date` | string (date) | Yes | — |
| `is_active` | boolean | No | — |
| `is_onboarding_only` | boolean | No | — |
| `is_recurring` | boolean | No | — |
| `max_completions_per_user` | integer | No | — |
| `metric` | enum: ['category_transaction_count', 'referral_count', 'share_referral', 'transaction_amount', 'transaction_count', 'unique_days', 'view_results'] | Yes | — |
| `monthly_completion_limit` | boolean | No | — |
| `name_ar` | string | Yes | — |
| `name_en` | string | Yes | — |
| `recurrence_pattern` | enum: ['monthly', 'weekly'] | No | — |
| `reward_badge` | string | No | — |
| `reward_badge_id` | string | No | — |
| `reward_cash_iqd` | integer | No | — |
| `reward_entries` | integer | No | — |
| `scope` | enum: ['city', 'individual', 'national'] | No | — |
| `start_date` | string (date) | Yes | — |
| `status` | enum: ['active', 'archived', 'draft', 'expired', 'scheduled'] | No | — |
| `target_value` | integer | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `challenge_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "activated_at": "2026-01-01T00:00:00Z",
  "category_filter": "example_category_filter",
  "challenge_type": "community",
  "checkpoints": "example_checkpoints",
  "deactivated_at": "2026-01-01T00:00:00Z",
  "deleted_at": "2026-01-01T00:00:00Z",
  "description_ar": "example_description_ar",
  "description_en": "example_description_en",
  "display_order": 0,
  "end_date": "2026-01-01",
  "is_active": false,
  "is_onboarding_only": false,
  "is_recurring": false,
  "max_completions_per_user": 1,
  "metric": "category_transaction_count",
  "monthly_completion_limit": false,
  "name_ar": "example_name_ar",
  "name_en": "example_name_en",
  "recurrence_pattern": "monthly",
  "reward_badge": "example_reward_badge",
  "reward_badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "reward_cash_iqd": 0,
  "reward_entries": 0,
  "scope": "city",
  "start_date": "2026-01-01",
  "status": "active",
  "target_value": 1
}
```

**Example Response**:

```json
{
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Challenge Created Successfully"
}
```

#### `GET /api/v0/fawz_challenge_system/challenges/{challenge_id}`

**Get challenge by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `challenge_id` | string (UUID) | Challenge Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `challenge_id` | string | — |
| `tenant_id` | string | — |
| `activated_at` | string (date-time) | — |
| `category_filter` | string | Transaction category filter (e.g. fuel, grocery) |
| `challenge_type` | string | — |
| `checkpoints` | string | JSON array of checkpoint definitions [{at, reward_entries}] |
| `deactivated_at` | string (date-time) | — |
| `deleted_at` | string (date-time) | — |
| `description_ar` | string | — |
| `description_en` | string | — |
| `display_order` | integer | — |
| `end_date` | string (date) | — |
| `is_active` | boolean | — |
| `is_onboarding_only` | boolean | — |
| `is_recurring` | boolean | — |
| `max_completions_per_user` | integer | — |
| `metric` | string | — |
| `monthly_completion_limit` | boolean | — |
| `name_ar` | string | — |
| `name_en` | string | — |
| `recurrence_pattern` | string | — |
| `reward_badge` | string | — |
| `reward_badge_id` | string | — |
| `reward_cash_iqd` | integer | — |
| `reward_entries` | integer | — |
| `scope` | string | — |
| `start_date` | string (date) | — |
| `status` | string | — |
| `target_value` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "activated_at": "2026-01-01T00:00:00Z",
  "category_filter": "example_category_filter",
  "challenge_type": "community",
  "checkpoints": "example_checkpoints",
  "deactivated_at": "2026-01-01T00:00:00Z",
  "deleted_at": "2026-01-01T00:00:00Z",
  "description_ar": "example_description_ar",
  "description_en": "example_description_en",
  "display_order": 0,
  "end_date": "2026-01-01",
  "is_active": false,
  "is_onboarding_only": false,
  "is_recurring": false,
  "max_completions_per_user": 1,
  "metric": "category_transaction_count",
  "monthly_completion_limit": false,
  "name_ar": "example_name_ar",
  "name_en": "example_name_en",
  "recurrence_pattern": "monthly",
  "reward_badge": "example_reward_badge",
  "reward_badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "reward_cash_iqd": 0,
  "reward_entries": 0,
  "scope": "city",
  "start_date": "2026-01-01",
  "status": "active",
  "target_value": 1,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_challenge_system/challenges`

**List challenges**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `challenge_type` | string | — | Filter parameter |
| `is_active` | string | — | Filter parameter |
| `is_onboarding_only` | string | — | Filter parameter |
| `scope` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `challenges_list` | array | Array of challenge objects |
| `total_challenges` | integer | Total count of challenges |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "challenges_list": [
    {
      "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "activated_at": "2026-01-01T00:00:00Z",
      "category_filter": "example_category_filter",
      "challenge_type": "community",
      "checkpoints": "example_checkpoints",
      "deactivated_at": "2026-01-01T00:00:00Z",
      "deleted_at": "2026-01-01T00:00:00Z",
      "description_ar": "example_description_ar",
      "description_en": "example_description_en",
      "display_order": 0,
      "end_date": "2026-01-01",
      "is_active": false,
      "is_onboarding_only": false,
      "is_recurring": false,
      "max_completions_per_user": 1,
      "metric": "category_transaction_count",
      "monthly_completion_limit": false,
      "name_ar": "example_name_ar",
      "name_en": "example_name_en",
      "recurrence_pattern": "monthly",
      "reward_badge": "example_reward_badge",
      "reward_badge_id": "550e8400-e29b-41d4-a716-446655440000",
      "reward_cash_iqd": 0,
      "reward_entries": 0,
      "scope": "city",
      "start_date": "2026-01-01",
      "status": "active",
      "target_value": 1,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_challenges": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_challenge_system/challenges/{challenge_id}`

**Update challenge**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `challenge_id` | string (UUID) | Challenge Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `activated_at` | string (date-time) | No | — |
| `category_filter` | string | No | Transaction category filter (e.g. fuel, grocery) |
| `challenge_type` | enum: ['community', 'monthly_fire', 'onboarding', 'rotating', 'streak', 'weekly_spark'] | No | — |
| `checkpoints` | string | No | JSON array of checkpoint definitions [{at, reward_entries}] |
| `deactivated_at` | string (date-time) | No | — |
| `deleted_at` | string (date-time) | No | — |
| `description_ar` | string | No | — |
| `description_en` | string | No | — |
| `display_order` | integer | No | — |
| `end_date` | string (date) | No | — |
| `is_active` | boolean | No | — |
| `is_onboarding_only` | boolean | No | — |
| `is_recurring` | boolean | No | — |
| `max_completions_per_user` | integer | No | — |
| `metric` | enum: ['category_transaction_count', 'referral_count', 'share_referral', 'transaction_amount', 'transaction_count', 'unique_days', 'view_results'] | No | — |
| `monthly_completion_limit` | boolean | No | — |
| `name_ar` | string | No | — |
| `name_en` | string | No | — |
| `recurrence_pattern` | enum: ['monthly', 'weekly'] | No | — |
| `reward_badge` | string | No | — |
| `reward_badge_id` | string | No | — |
| `reward_cash_iqd` | integer | No | — |
| `reward_entries` | integer | No | — |
| `scope` | enum: ['city', 'individual', 'national'] | No | — |
| `start_date` | string (date) | No | — |
| `status` | enum: ['active', 'archived', 'draft', 'expired', 'scheduled'] | No | — |
| `target_value` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "activated_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "message": "Challenge Updated Successfully"
}
```

#### `DELETE /api/v0/fawz_challenge_system/challenges/{challenge_id}`

**Delete challenge**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `challenge_id` | string (UUID) | Challenge Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Deleted successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "message": "Challenge Deleted Successfully"
}
```

#### `POST /api/v0/fawz_challenge_system/community_challenge_scores`

**Create a new community challenge score**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `challenge_id` | string | Yes | — |
| `current_value` | integer | No | — |
| `participant_count` | integer | No | — |
| `reward_distributed` | boolean | No | — |
| `reward_distributed_at` | string (date-time) | No | — |
| `scope_type` | enum: ['city', 'national'] | Yes | — |
| `scope_value` | string | No | City name or 'national' |
| `status` | enum: ['active', 'expired', 'rewards_distributed', 'target_met'] | No | — |
| `target_met` | boolean | No | — |
| `target_met_at` | string (date-time) | No | — |
| `target_value` | integer | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `community_challenge_score_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "current_value": 0,
  "participant_count": 0,
  "reward_distributed": false,
  "reward_distributed_at": "2026-01-01T00:00:00Z",
  "scope_type": "city",
  "scope_value": "example_scope_value",
  "status": "active",
  "target_met": false,
  "target_met_at": "2026-01-01T00:00:00Z",
  "target_value": 1
}
```

**Example Response**:

```json
{
  "community_challenge_score_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "CommunityChallengeScore Created Successfully"
}
```

#### `GET /api/v0/fawz_challenge_system/community_challenge_scores/{community_challenge_score_id}`

**Get community challenge score by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `community_challenge_score_id` | string (UUID) | Community Challenge Score Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `community_challenge_score_id` | string | — |
| `tenant_id` | string | — |
| `challenge_id` | string | — |
| `current_value` | integer | — |
| `participant_count` | integer | — |
| `reward_distributed` | boolean | — |
| `reward_distributed_at` | string (date-time) | — |
| `scope_type` | string | — |
| `scope_value` | string | City name or 'national' |
| `status` | string | — |
| `target_met` | boolean | — |
| `target_met_at` | string (date-time) | — |
| `target_value` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "community_challenge_score_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "current_value": 0,
  "participant_count": 0,
  "reward_distributed": false,
  "reward_distributed_at": "2026-01-01T00:00:00Z",
  "scope_type": "city",
  "scope_value": "example_scope_value",
  "status": "active",
  "target_met": false,
  "target_met_at": "2026-01-01T00:00:00Z",
  "target_value": 1,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_challenge_system/community_challenge_scores`

**List community challenge scores**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `challenge_id` | string | — | Filter parameter |
| `scope_type` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `target_met` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `community_challenge_scores_list` | array | Array of community_challenge_score objects |
| `total_community_challenge_scores` | integer | Total count of community_challenge_scores |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "community_challenge_scores_list": [
    {
      "community_challenge_score_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
      "current_value": 0,
      "participant_count": 0,
      "reward_distributed": false,
      "reward_distributed_at": "2026-01-01T00:00:00Z",
      "scope_type": "city",
      "scope_value": "example_scope_value",
      "status": "active",
      "target_met": false,
      "target_met_at": "2026-01-01T00:00:00Z",
      "target_value": 1,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_community_challenge_scores": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_challenge_system/community_challenge_scores/{community_challenge_score_id}`

**Update community challenge score**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `community_challenge_score_id` | string (UUID) | Community Challenge Score Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `challenge_id` | string | No | — |
| `current_value` | integer | No | — |
| `participant_count` | integer | No | — |
| `reward_distributed` | boolean | No | — |
| `reward_distributed_at` | string (date-time) | No | — |
| `scope_type` | enum: ['city', 'national'] | No | — |
| `scope_value` | string | No | City name or 'national' |
| `status` | enum: ['active', 'expired', 'rewards_distributed', 'target_met'] | No | — |
| `target_met` | boolean | No | — |
| `target_met_at` | string (date-time) | No | — |
| `target_value` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response**:

```json
{
  "message": "CommunityChallengeScore Updated Successfully"
}
```

#### `POST /api/v0/fawz_challenge_system/user_badges`

**Create a new user badge**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `badge_id` | string | Yes | — |
| `challenge_id` | string | No | — |
| `earned_at` | string (date-time) | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_badge_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "earned_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "user_badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "UserBadge Created Successfully"
}
```

#### `GET /api/v0/fawz_challenge_system/user_badges/{user_badge_id}`

**Get user badge by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_badge_id` | string (UUID) | User Badge Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_badge_id` | string | — |
| `tenant_id` | string | — |
| `badge_id` | string | — |
| `challenge_id` | string | — |
| `earned_at` | string (date-time) | — |
| `user_id` | string | Consumer user who earned the badge |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "badge_id": "550e8400-e29b-41d4-a716-446655440000",
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "earned_at": "2026-01-01T00:00:00Z",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_challenge_system/user_badges`

**List user badges**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `badge_id` | string | — | Filter parameter |
| `user_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_badges_list` | array | Array of user_badge objects |
| `total_user_badges` | integer | Total count of user_badges |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_badges_list": [
    {
      "user_badge_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "badge_id": "550e8400-e29b-41d4-a716-446655440000",
      "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
      "earned_at": "2026-01-01T00:00:00Z",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_user_badges": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_challenge_system/user_challenge_progresses`

**Create a new user challenge progress**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `badge_awarded` | boolean | No | — |
| `challenge_id` | string | Yes | — |
| `checkpoints_claimed` | string | No | JSON array of claimed checkpoint indices |
| `completed_at` | string (date-time) | No | — |
| `completion_count` | integer | No | — |
| `current_value` | integer | No | — |
| `is_completed` | boolean | No | — |
| `last_checkpoint_claimed` | integer | No | — |
| `last_progress_at` | string (date-time) | No | — |
| `reward_cash_credited_iqd` | integer | No | — |
| `reward_entries_credited` | integer | No | — |
| `status` | enum: ['checkpoint_reached', 'completed', 'created', 'expired', 'in_progress'] | No | — |
| `target_value` | integer | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_challenge_progress_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "badge_awarded": false,
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "checkpoints_claimed": "example_checkpoints_claimed",
  "completed_at": "2026-01-01T00:00:00Z",
  "completion_count": 1,
  "current_value": 0,
  "is_completed": false,
  "last_checkpoint_claimed": 1,
  "last_progress_at": "2026-01-01T00:00:00Z",
  "reward_cash_credited_iqd": 0,
  "reward_entries_credited": 0,
  "status": "checkpoint_reached",
  "target_value": 1
}
```

**Example Response**:

```json
{
  "user_challenge_progress_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "UserChallengeProgress Created Successfully"
}
```

#### `GET /api/v0/fawz_challenge_system/user_challenge_progresses/{user_challenge_progress_id}`

**Get user challenge progress by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_challenge_progress_id` | string (UUID) | User Challenge Progress Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_challenge_progress_id` | string | — |
| `tenant_id` | string | — |
| `badge_awarded` | boolean | — |
| `challenge_id` | string | — |
| `checkpoints_claimed` | string | JSON array of claimed checkpoint indices |
| `completed_at` | string (date-time) | — |
| `completion_count` | integer | — |
| `current_value` | integer | — |
| `is_completed` | boolean | — |
| `last_checkpoint_claimed` | integer | — |
| `last_progress_at` | string (date-time) | — |
| `reward_cash_credited_iqd` | integer | — |
| `reward_entries_credited` | integer | — |
| `status` | string | — |
| `target_value` | integer | — |
| `user_id` | string | Consumer user |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_challenge_progress_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "badge_awarded": false,
  "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "checkpoints_claimed": "example_checkpoints_claimed",
  "completed_at": "2026-01-01T00:00:00Z",
  "completion_count": 1,
  "current_value": 0,
  "is_completed": false,
  "last_checkpoint_claimed": 1,
  "last_progress_at": "2026-01-01T00:00:00Z",
  "reward_cash_credited_iqd": 0,
  "reward_entries_credited": 0,
  "status": "checkpoint_reached",
  "target_value": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_challenge_system/user_challenge_progresses`

**List user challenge progresses**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `challenge_id` | string | — | Filter parameter |
| `is_completed` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `user_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_challenge_progress_list` | array | Array of user_challenge_progress objects |
| `total_user_challenge_progresses` | integer | Total count of user_challenge_progresses |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_challenge_progress_list": [
    {
      "user_challenge_progress_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "badge_awarded": false,
      "challenge_id": "550e8400-e29b-41d4-a716-446655440000",
      "checkpoints_claimed": "example_checkpoints_claimed",
      "completed_at": "2026-01-01T00:00:00Z",
      "completion_count": 1,
      "current_value": 0,
      "is_completed": false,
      "last_checkpoint_claimed": 1,
      "last_progress_at": "2026-01-01T00:00:00Z",
      "reward_cash_credited_iqd": 0,
      "reward_entries_credited": 0,
      "status": "checkpoint_reached",
      "target_value": 1,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_user_challenge_progresses": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_challenge_system/user_challenge_progresses/{user_challenge_progress_id}`

**Update user challenge progress**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_challenge_progress_id` | string (UUID) | User Challenge Progress Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `badge_awarded` | boolean | No | — |
| `challenge_id` | string | No | — |
| `checkpoints_claimed` | string | No | JSON array of claimed checkpoint indices |
| `completed_at` | string (date-time) | No | — |
| `completion_count` | integer | No | — |
| `current_value` | integer | No | — |
| `is_completed` | boolean | No | — |
| `last_checkpoint_claimed` | integer | No | — |
| `last_progress_at` | string (date-time) | No | — |
| `reward_cash_credited_iqd` | integer | No | — |
| `reward_entries_credited` | integer | No | — |
| `status` | enum: ['checkpoint_reached', 'completed', 'created', 'expired', 'in_progress'] | No | — |
| `target_value` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "badge_awarded": true
}
```

**Example Response**:

```json
{
  "message": "UserChallengeProgress Updated Successfully"
}
```

---

## backend-fawz-consumer-engagement

**Base URL**: `/api/v0/fawz_consumer_engagement`
**Port**: `8003`
**Description**: Manages consumer user Fawz profile extensions, consent records, in-app notifications, and notification preferences. Contains consumer_user (Fawz-specific fields extending SuperQi account), user_consent (sharia disclosure and media participation tracking), notification (in-app notification history with push delivery tracking), and notification_preference (per-user per-category opt-in toggles). Consumer_user tracks weekly/monthly unique days, referral code, onboarding status, and lifetime statistics

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_consumer_engagement/consumer_users` | create | consumer_user | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/consumer_users/{consumer_user_id}` | read | consumer_user | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/consumer_users` | list | consumer_user | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_consumer_engagement/consumer_users/{consumer_user_id}` | update | consumer_user | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_consumer_engagement/notifications` | create | notification | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/notifications/{notification_id}` | read | notification | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/notifications` | list | notification | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_consumer_engagement/notifications/{notification_id}` | update | notification | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_consumer_engagement/notification_preferences` | create | notification_preference | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/notification_preferences/{notification_preference_id}` | read | notification_preference | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/notification_preferences` | list | notification_preference | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_consumer_engagement/notification_preferences/{notification_preference_id}` | update | notification_preference | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_consumer_engagement/user_consents` | create | user_consent | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/user_consents/{user_consent_id}` | read | user_consent | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_consumer_engagement/user_consents` | list | user_consent | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_consumer_engagement/user_consents/{user_consent_id}` | update | user_consent | AccessLevel.OWNER |

### Endpoint Details

#### `POST /api/v0/fawz_consumer_engagement/consumer_users`

**Create a new consumer user**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_status` | enum: ['active', 'archived', 'created', 'onboarding', 'standard', 'suspended'] | No | — |
| `ambassador_since` | string (date) | No | — |
| `city` | string | No | — |
| `deleted_at` | string (date-time) | No | — |
| `device_fingerprint_hash` | string | No | — |
| `display_name` | string | No | — |
| `governorate` | string | No | — |
| `is_ambassador` | boolean | No | — |
| `is_new` | boolean | No | — |
| `last_active_at` | string (date-time) | No | — |
| `last_transaction_date` | string (date) | No | — |
| `lifetime_tx_count` | integer | No | — |
| `monthly_unique_days` | integer | No | — |
| `phone_hash` | string | Yes | — |
| `qi_card_number_hash` | string | Yes | — |
| `referral_code` | string | No | — |
| `referral_code_expires_at` | string (date-time) | No | — |
| `referral_count_month` | integer | No | — |
| `referral_count_month_year_month` | string | No | YYYY-MM format for monthly referral count reset |
| `referred_by_user_id` | string | No | Consumer user who referred this user |
| `suspended_at` | string (date-time) | No | — |
| `suspension_reason` | string | No | — |
| `total_entries_earned` | integer | No | — |
| `total_prizes_won_iqd` | integer | No | — |
| `weekly_spark_earned_month` | integer | No | Month number when Weekly Spark was last earned |
| `weekly_spark_earned_year` | integer | No | Year when Weekly Spark was last earned |
| `weekly_unique_days` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `consumer_user_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "account_status": "active",
  "ambassador_since": "2026-01-01",
  "city": "example_city",
  "deleted_at": "2026-01-01T00:00:00Z",
  "device_fingerprint_hash": "example_device_fingerprint_hash",
  "display_name": "example_display_name",
  "governorate": "example_governorate",
  "is_ambassador": false,
  "is_new": true,
  "last_active_at": "2026-01-01T00:00:00Z",
  "last_transaction_date": "2026-01-01",
  "lifetime_tx_count": 0,
  "monthly_unique_days": 0,
  "phone_hash": "example_phone_hash",
  "qi_card_number_hash": "12345678",
  "referral_code": "EXAMPLE_CODE",
  "referral_code_expires_at": "2026-01-01T00:00:00Z",
  "referral_count_month": 0,
  "referral_count_month_year_month": "example_referral_count_month_year_month",
  "referred_by_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "suspended_at": "2026-01-01T00:00:00Z",
  "suspension_reason": "example_suspension_reason",
  "total_entries_earned": 0,
  "total_prizes_won_iqd": 0,
  "weekly_spark_earned_month": 1,
  "weekly_spark_earned_year": 1,
  "weekly_unique_days": 0
}
```

**Example Response**:

```json
{
  "consumer_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "ConsumerUser Created Successfully"
}
```

#### `GET /api/v0/fawz_consumer_engagement/consumer_users/{consumer_user_id}`

**Get consumer user by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `consumer_user_id` | string (UUID) | Consumer User Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `consumer_user_id` | string | — |
| `tenant_id` | string | — |
| `account_status` | string | — |
| `ambassador_since` | string (date) | — |
| `city` | string | — |
| `deleted_at` | string (date-time) | — |
| `device_fingerprint_hash` | string | — |
| `display_name` | string | — |
| `governorate` | string | — |
| `is_ambassador` | boolean | — |
| `is_new` | boolean | — |
| `last_active_at` | string (date-time) | — |
| `last_transaction_date` | string (date) | — |
| `lifetime_tx_count` | integer | — |
| `monthly_unique_days` | integer | — |
| `phone_hash` | string | — |
| `qi_card_number_hash` | string | — |
| `referral_code` | string | — |
| `referral_code_expires_at` | string (date-time) | — |
| `referral_count_month` | integer | — |
| `referral_count_month_year_month` | string | YYYY-MM format for monthly referral count reset |
| `referred_by_user_id` | string | Consumer user who referred this user |
| `superqi_user_id` | string | External SuperQi user ID |
| `suspended_at` | string (date-time) | — |
| `suspension_reason` | string | — |
| `total_entries_earned` | integer | — |
| `total_prizes_won_iqd` | integer | — |
| `weekly_spark_earned_month` | integer | Month number when Weekly Spark was last earned |
| `weekly_spark_earned_year` | integer | Year when Weekly Spark was last earned |
| `weekly_unique_days` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "consumer_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_status": "active",
  "ambassador_since": "2026-01-01",
  "city": "example_city",
  "deleted_at": "2026-01-01T00:00:00Z",
  "device_fingerprint_hash": "example_device_fingerprint_hash",
  "display_name": "example_display_name",
  "governorate": "example_governorate",
  "is_ambassador": false,
  "is_new": true,
  "last_active_at": "2026-01-01T00:00:00Z",
  "last_transaction_date": "2026-01-01",
  "lifetime_tx_count": 0,
  "monthly_unique_days": 0,
  "phone_hash": "example_phone_hash",
  "qi_card_number_hash": "12345678",
  "referral_code": "EXAMPLE_CODE",
  "referral_code_expires_at": "2026-01-01T00:00:00Z",
  "referral_count_month": 0,
  "referral_count_month_year_month": "example_referral_count_month_year_month",
  "referred_by_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "superqi_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "suspended_at": "2026-01-01T00:00:00Z",
  "suspension_reason": "example_suspension_reason",
  "total_entries_earned": 0,
  "total_prizes_won_iqd": 0,
  "weekly_spark_earned_month": 1,
  "weekly_spark_earned_year": 1,
  "weekly_unique_days": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_consumer_engagement/consumer_users`

**List consumer users**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `account_status` | string | — | Filter parameter |
| `city` | string | — | Filter parameter |
| `governorate` | string | — | Filter parameter |
| `is_new` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `consumer_users_list` | array | Array of consumer_user objects |
| `total_consumer_users` | integer | Total count of consumer_users |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "consumer_users_list": [
    {
      "consumer_user_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "account_status": "active",
      "ambassador_since": "2026-01-01",
      "city": "example_city",
      "deleted_at": "2026-01-01T00:00:00Z",
      "device_fingerprint_hash": "example_device_fingerprint_hash",
      "display_name": "example_display_name",
      "governorate": "example_governorate",
      "is_ambassador": false,
      "is_new": true,
      "last_active_at": "2026-01-01T00:00:00Z",
      "last_transaction_date": "2026-01-01",
      "lifetime_tx_count": 0,
      "monthly_unique_days": 0,
      "phone_hash": "example_phone_hash",
      "qi_card_number_hash": "12345678",
      "referral_code": "EXAMPLE_CODE",
      "referral_code_expires_at": "2026-01-01T00:00:00Z",
      "referral_count_month": 0,
      "referral_count_month_year_month": "example_referral_count_month_year_month",
      "referred_by_user_id": "550e8400-e29b-41d4-a716-446655440000",
      "superqi_user_id": "550e8400-e29b-41d4-a716-446655440000",
      "suspended_at": "2026-01-01T00:00:00Z",
      "suspension_reason": "example_suspension_reason",
      "total_entries_earned": 0,
      "total_prizes_won_iqd": 0,
      "weekly_spark_earned_month": 1,
      "weekly_spark_earned_year": 1,
      "weekly_unique_days": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_consumer_users": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_consumer_engagement/consumer_users/{consumer_user_id}`

**Update consumer user**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `consumer_user_id` | string (UUID) | Consumer User Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_status` | enum: ['active', 'archived', 'created', 'onboarding', 'standard', 'suspended'] | No | — |
| `ambassador_since` | string (date) | No | — |
| `city` | string | No | — |
| `deleted_at` | string (date-time) | No | — |
| `device_fingerprint_hash` | string | No | — |
| `display_name` | string | No | — |
| `governorate` | string | No | — |
| `is_ambassador` | boolean | No | — |
| `is_new` | boolean | No | — |
| `last_active_at` | string (date-time) | No | — |
| `last_transaction_date` | string (date) | No | — |
| `lifetime_tx_count` | integer | No | — |
| `monthly_unique_days` | integer | No | — |
| `phone_hash` | string | No | — |
| `qi_card_number_hash` | string | No | — |
| `referral_code` | string | No | — |
| `referral_code_expires_at` | string (date-time) | No | — |
| `referral_count_month` | integer | No | — |
| `referral_count_month_year_month` | string | No | YYYY-MM format for monthly referral count reset |
| `referred_by_user_id` | string | No | Consumer user who referred this user |
| `suspended_at` | string (date-time) | No | — |
| `suspension_reason` | string | No | — |
| `total_entries_earned` | integer | No | — |
| `total_prizes_won_iqd` | integer | No | — |
| `weekly_spark_earned_month` | integer | No | Month number when Weekly Spark was last earned |
| `weekly_spark_earned_year` | integer | No | Year when Weekly Spark was last earned |
| `weekly_unique_days` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "account_status": "active"
}
```

**Example Response**:

```json
{
  "message": "ConsumerUser Updated Successfully"
}
```

#### `POST /api/v0/fawz_consumer_engagement/notifications`

**Create a new notification**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `body` | string | No | — |
| `body_ar` | string | Yes | — |
| `body_en` | string | No | — |
| `data_payload` | string | No | JSON payload for push notification data |
| `deep_link` | string | No | — |
| `delivered_at` | string (date-time) | No | — |
| `failed_at` | string (date-time) | No | — |
| `failure_reason` | string | No | — |
| `is_pushed` | boolean | No | — |
| `is_read` | boolean | No | — |
| `is_system_critical` | boolean | No | Non-opt-outable notifications like account suspension |
| `notification_type` | enum: ['account_reinstated', 'account_suspended', 'budget_alert', 'challenge_checkpoint', 'challenge_completed', 'challenge_progress', 'dispute_update', 'draw_reminder', 'draw_result_non_winner', 'draw_result_winner', 'entry_earned', 'fraud_queue_alert', 'prize_credited', 'prize_held', 'prize_held_for_review', 'referral_reward', 'referral_reward_received', 'referral_rewarded', 'referral_success', 'retroactive_seeding_complete', 'shared_merchant_entries', 'sla_breach_alert', 'system_announcement', 'system_critical'] | No | — |
| `priority` | enum: ['critical', 'high', 'low', 'normal'] | No | — |
| `push_error` | string | No | — |
| `push_message_id` | string | No | — |
| `push_provider` | string | No | — |
| `pushed_at` | string (date-time) | No | — |
| `read_at` | string (date-time) | No | — |
| `recipient_type` | enum: ['admin', 'consumer', 'merchant', 'user'] | Yes | — |
| `related_challenge_id` | string | No | — |
| `related_draw_id` | string | No | — |
| `related_entry_id` | string | No | — |
| `related_referral_id` | string | No | — |
| `retry_count` | integer | No | — |
| `scheduled_for` | string (date-time) | No | — |
| `sent_at` | string (date-time) | No | — |
| `status` | enum: ['delivered', 'failed', 'pending', 'read', 'sent'] | No | — |
| `title` | string | Yes | — |
| `title_ar` | string | Yes | — |
| `title_en` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `notification_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "body": "example_body",
  "body_ar": "example_body_ar",
  "body_en": "example_body_en",
  "data_payload": "example_data_payload",
  "deep_link": "example_deep_link",
  "delivered_at": "2026-01-01T00:00:00Z",
  "failed_at": "2026-01-01T00:00:00Z",
  "failure_reason": "example_failure_reason",
  "is_pushed": false,
  "is_read": false,
  "is_system_critical": false,
  "notification_type": "account_reinstated",
  "priority": "critical",
  "push_error": "example_push_error",
  "push_message_id": "550e8400-e29b-41d4-a716-446655440000",
  "push_provider": "example_push_provider",
  "pushed_at": "2026-01-01T00:00:00Z",
  "read_at": "2026-01-01T00:00:00Z",
  "recipient_type": "admin",
  "related_challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "retry_count": 0,
  "scheduled_for": "2026-01-01T00:00:00Z",
  "sent_at": "2026-01-01T00:00:00Z",
  "status": "delivered",
  "title": "example_title",
  "title_ar": "example_title_ar",
  "title_en": "example_title_en"
}
```

**Example Response**:

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Notification Created Successfully"
}
```

#### `GET /api/v0/fawz_consumer_engagement/notifications/{notification_id}`

**Get notification by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `notification_id` | string (UUID) | Notification Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `notification_id` | string | — |
| `tenant_id` | string | — |
| `body` | string | — |
| `body_ar` | string | — |
| `body_en` | string | — |
| `data_payload` | string | JSON payload for push notification data |
| `deep_link` | string | — |
| `delivered_at` | string (date-time) | — |
| `failed_at` | string (date-time) | — |
| `failure_reason` | string | — |
| `is_pushed` | boolean | — |
| `is_read` | boolean | — |
| `is_system_critical` | boolean | Non-opt-outable notifications like account suspension |
| `notification_type` | string | — |
| `priority` | string | — |
| `push_error` | string | — |
| `push_message_id` | string | — |
| `push_provider` | string | — |
| `pushed_at` | string (date-time) | — |
| `read_at` | string (date-time) | — |
| `recipient_id` | string | Consumer/merchant/admin user ID |
| `recipient_type` | string | — |
| `related_challenge_id` | string | — |
| `related_draw_id` | string | — |
| `related_entry_id` | string | — |
| `related_referral_id` | string | — |
| `retry_count` | integer | — |
| `scheduled_for` | string (date-time) | — |
| `sent_at` | string (date-time) | — |
| `status` | string | — |
| `title` | string | — |
| `title_ar` | string | — |
| `title_en` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "notification_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "body": "example_body",
  "body_ar": "example_body_ar",
  "body_en": "example_body_en",
  "data_payload": "example_data_payload",
  "deep_link": "example_deep_link",
  "delivered_at": "2026-01-01T00:00:00Z",
  "failed_at": "2026-01-01T00:00:00Z",
  "failure_reason": "example_failure_reason",
  "is_pushed": false,
  "is_read": false,
  "is_system_critical": false,
  "notification_type": "account_reinstated",
  "priority": "critical",
  "push_error": "example_push_error",
  "push_message_id": "550e8400-e29b-41d4-a716-446655440000",
  "push_provider": "example_push_provider",
  "pushed_at": "2026-01-01T00:00:00Z",
  "read_at": "2026-01-01T00:00:00Z",
  "recipient_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipient_type": "admin",
  "related_challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "retry_count": 0,
  "scheduled_for": "2026-01-01T00:00:00Z",
  "sent_at": "2026-01-01T00:00:00Z",
  "status": "delivered",
  "title": "example_title",
  "title_ar": "example_title_ar",
  "title_en": "example_title_en",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_consumer_engagement/notifications`

**List notifications**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `is_read` | string | — | Filter parameter |
| `notification_type` | string | — | Filter parameter |
| `priority` | string | — | Filter parameter |
| `recipient_id` | string | — | Filter parameter |
| `recipient_type` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `notifications_list` | array | Array of notification objects |
| `total_notifications` | integer | Total count of notifications |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "notifications_list": [
    {
      "notification_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "body": "example_body",
      "body_ar": "example_body_ar",
      "body_en": "example_body_en",
      "data_payload": "example_data_payload",
      "deep_link": "example_deep_link",
      "delivered_at": "2026-01-01T00:00:00Z",
      "failed_at": "2026-01-01T00:00:00Z",
      "failure_reason": "example_failure_reason",
      "is_pushed": false,
      "is_read": false,
      "is_system_critical": false,
      "notification_type": "account_reinstated",
      "priority": "critical",
      "push_error": "example_push_error",
      "push_message_id": "550e8400-e29b-41d4-a716-446655440000",
      "push_provider": "example_push_provider",
      "pushed_at": "2026-01-01T00:00:00Z",
      "read_at": "2026-01-01T00:00:00Z",
      "recipient_id": "550e8400-e29b-41d4-a716-446655440000",
      "recipient_type": "admin",
      "related_challenge_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "retry_count": 0,
      "scheduled_for": "2026-01-01T00:00:00Z",
      "sent_at": "2026-01-01T00:00:00Z",
      "status": "delivered",
      "title": "example_title",
      "title_ar": "example_title_ar",
      "title_en": "example_title_en",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_notifications": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_consumer_engagement/notifications/{notification_id}`

**Update notification**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `notification_id` | string (UUID) | Notification Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `body` | string | No | — |
| `body_ar` | string | No | — |
| `body_en` | string | No | — |
| `data_payload` | string | No | JSON payload for push notification data |
| `deep_link` | string | No | — |
| `delivered_at` | string (date-time) | No | — |
| `failed_at` | string (date-time) | No | — |
| `failure_reason` | string | No | — |
| `is_pushed` | boolean | No | — |
| `is_read` | boolean | No | — |
| `is_system_critical` | boolean | No | Non-opt-outable notifications like account suspension |
| `notification_type` | enum: ['account_reinstated', 'account_suspended', 'budget_alert', 'challenge_checkpoint', 'challenge_completed', 'challenge_progress', 'dispute_update', 'draw_reminder', 'draw_result_non_winner', 'draw_result_winner', 'entry_earned', 'fraud_queue_alert', 'prize_credited', 'prize_held', 'prize_held_for_review', 'referral_reward', 'referral_reward_received', 'referral_rewarded', 'referral_success', 'retroactive_seeding_complete', 'shared_merchant_entries', 'sla_breach_alert', 'system_announcement', 'system_critical'] | No | — |
| `priority` | enum: ['critical', 'high', 'low', 'normal'] | No | — |
| `push_error` | string | No | — |
| `push_message_id` | string | No | — |
| `push_provider` | string | No | — |
| `pushed_at` | string (date-time) | No | — |
| `read_at` | string (date-time) | No | — |
| `recipient_type` | enum: ['admin', 'consumer', 'merchant', 'user'] | No | — |
| `related_challenge_id` | string | No | — |
| `related_draw_id` | string | No | — |
| `related_entry_id` | string | No | — |
| `related_referral_id` | string | No | — |
| `retry_count` | integer | No | — |
| `scheduled_for` | string (date-time) | No | — |
| `sent_at` | string (date-time) | No | — |
| `status` | enum: ['delivered', 'failed', 'pending', 'read', 'sent'] | No | — |
| `title` | string | No | — |
| `title_ar` | string | No | — |
| `title_en` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "body": "example_body"
}
```

**Example Response**:

```json
{
  "message": "Notification Updated Successfully"
}
```

#### `POST /api/v0/fawz_consumer_engagement/notification_preferences`

**Create a new notification preference**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email_enabled` | boolean | No | — |
| `notification_challenge_updates` | boolean | No | — |
| `notification_draw_reminders` | boolean | No | — |
| `notification_draw_results` | boolean | No | — |
| `notification_entry_earned` | boolean | No | — |
| `notification_referral_rewards` | boolean | No | — |
| `push_enabled` | boolean | No | — |
| `push_token` | string | No | — |
| `push_token_updated_at` | string (date-time) | No | — |
| `sms_enabled` | boolean | No | — |
| `user_type` | enum: ['consumer', 'merchant'] | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `notification_preference_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "email_enabled": false,
  "notification_challenge_updates": true,
  "notification_draw_reminders": true,
  "notification_draw_results": true,
  "notification_entry_earned": true,
  "notification_referral_rewards": true,
  "push_enabled": true,
  "push_token": "example_push_token",
  "push_token_updated_at": "2026-01-01T00:00:00Z",
  "sms_enabled": false,
  "user_type": "consumer"
}
```

**Example Response**:

```json
{
  "notification_preference_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "NotificationPreference Created Successfully"
}
```

#### `GET /api/v0/fawz_consumer_engagement/notification_preferences/{notification_preference_id}`

**Get notification preference by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `notification_preference_id` | string (UUID) | Notification Preference Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `notification_preference_id` | string | — |
| `tenant_id` | string | — |
| `email_enabled` | boolean | — |
| `notification_challenge_updates` | boolean | — |
| `notification_draw_reminders` | boolean | — |
| `notification_draw_results` | boolean | — |
| `notification_entry_earned` | boolean | — |
| `notification_referral_rewards` | boolean | — |
| `push_enabled` | boolean | — |
| `push_token` | string | — |
| `push_token_updated_at` | string (date-time) | — |
| `sms_enabled` | boolean | — |
| `user_id` | string | Consumer or merchant user |
| `user_type` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "notification_preference_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "email_enabled": false,
  "notification_challenge_updates": true,
  "notification_draw_reminders": true,
  "notification_draw_results": true,
  "notification_entry_earned": true,
  "notification_referral_rewards": true,
  "push_enabled": true,
  "push_token": "example_push_token",
  "push_token_updated_at": "2026-01-01T00:00:00Z",
  "sms_enabled": false,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_type": "consumer",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_consumer_engagement/notification_preferences`

**List notification preferences**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `push_enabled` | string | — | Filter parameter |
| `user_id` | string | — | Filter parameter |
| `user_type` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `notification_preferences_list` | array | Array of notification_preference objects |
| `total_notification_preferences` | integer | Total count of notification_preferences |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "notification_preferences_list": [
    {
      "notification_preference_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "email_enabled": false,
      "notification_challenge_updates": true,
      "notification_draw_reminders": true,
      "notification_draw_results": true,
      "notification_entry_earned": true,
      "notification_referral_rewards": true,
      "push_enabled": true,
      "push_token": "example_push_token",
      "push_token_updated_at": "2026-01-01T00:00:00Z",
      "sms_enabled": false,
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_type": "consumer",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_notification_preferences": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_consumer_engagement/notification_preferences/{notification_preference_id}`

**Update notification preference**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `notification_preference_id` | string (UUID) | Notification Preference Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email_enabled` | boolean | No | — |
| `notification_challenge_updates` | boolean | No | — |
| `notification_draw_reminders` | boolean | No | — |
| `notification_draw_results` | boolean | No | — |
| `notification_entry_earned` | boolean | No | — |
| `notification_referral_rewards` | boolean | No | — |
| `push_enabled` | boolean | No | — |
| `push_token` | string | No | — |
| `push_token_updated_at` | string (date-time) | No | — |
| `sms_enabled` | boolean | No | — |
| `user_type` | enum: ['consumer', 'merchant'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "email_enabled": true
}
```

**Example Response**:

```json
{
  "message": "NotificationPreference Updated Successfully"
}
```

#### `POST /api/v0/fawz_consumer_engagement/user_consents`

**Create a new user consent**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `consent_type` | enum: ['media_participation', 'notification_challenge_updates', 'notification_draw_reminders', 'notification_draw_results', 'notification_entry_earned', 'notification_referral_rewards', 'sharia_disclosure'] | Yes | — |
| `consent_version` | string | Yes | — |
| `consented` | boolean | Yes | — |
| `consented_at` | string (date-time) | No | — |
| `ip_address` | string | No | — |
| `user_agent` | string | No | — |
| `withdrawn_at` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_consent_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "consent_type": "media_participation",
  "consent_version": "example_consent_version",
  "consented": true,
  "consented_at": "2026-01-01T00:00:00Z",
  "ip_address": "example_ip_address",
  "user_agent": "example_user_agent",
  "withdrawn_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "user_consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "UserConsent Created Successfully"
}
```

#### `GET /api/v0/fawz_consumer_engagement/user_consents/{user_consent_id}`

**Get user consent by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_consent_id` | string (UUID) | User Consent Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_consent_id` | string | — |
| `tenant_id` | string | — |
| `consent_type` | string | — |
| `consent_version` | string | — |
| `consented` | boolean | — |
| `consented_at` | string (date-time) | — |
| `ip_address` | string | — |
| `user_agent` | string | — |
| `user_id` | string | Consumer user |
| `withdrawn_at` | string (date-time) | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "consent_type": "media_participation",
  "consent_version": "example_consent_version",
  "consented": true,
  "consented_at": "2026-01-01T00:00:00Z",
  "ip_address": "example_ip_address",
  "user_agent": "example_user_agent",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "withdrawn_at": "2026-01-01T00:00:00Z",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_consumer_engagement/user_consents`

**List user consents**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `consent_type` | string | — | Filter parameter |
| `consented` | string | — | Filter parameter |
| `user_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_consents_list` | array | Array of user_consent objects |
| `total_user_consents` | integer | Total count of user_consents |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_consents_list": [
    {
      "user_consent_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "consent_type": "media_participation",
      "consent_version": "example_consent_version",
      "consented": true,
      "consented_at": "2026-01-01T00:00:00Z",
      "ip_address": "example_ip_address",
      "user_agent": "example_user_agent",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "withdrawn_at": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_user_consents": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_consumer_engagement/user_consents/{user_consent_id}`

**Update user consent**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_consent_id` | string (UUID) | User Consent Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `consent_type` | enum: ['media_participation', 'notification_challenge_updates', 'notification_draw_reminders', 'notification_draw_results', 'notification_entry_earned', 'notification_referral_rewards', 'sharia_disclosure'] | No | — |
| `consent_version` | string | No | — |
| `consented` | boolean | No | — |
| `consented_at` | string (date-time) | No | — |
| `ip_address` | string | No | — |
| `user_agent` | string | No | — |
| `withdrawn_at` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "consent_type": "media_participation"
}
```

**Example Response**:

```json
{
  "message": "UserConsent Updated Successfully"
}
```

---

## backend-fawz-draw-management

**Base URL**: `/api/v0/fawz_draw_management`
**Port**: `8004`
**Description**: Orchestrates the full lifecycle of weekly/monthly prize draws from scheduling through archival. Contains draw (with prize tier configs, winning numbers, sealed pre-generation), draw_prize_tier (per-draw tier definitions), draw_digit_event (live broadcast digit entries from operator), draw_winner (matched entries with payout status), jackpot_rollover (unclaimed jackpot accumulation), and websocket_connection (live draw connection tracking). Draw follows scheduled→pool_snapshotted→live→finalized→archived lifecycle. Winner calculation uses trailing-digit modulo indexes for sub-30-second processing of 100M+ entry pools

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_draw_management/draws` | create | draw | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/draws/{draw_id}` | read | draw | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_draw_management/draws` | list | draw | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_draw_management/draws/{draw_id}` | update | draw | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_draw_management/draws/{draw_id}` | delete | draw | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_draw_management/draw_digit_events` | create | draw_digit_event | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/draw_digit_events/{draw_digit_event_id}` | read | draw_digit_event | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/draw_digit_events` | list | draw_digit_event | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_draw_management/draw_prize_tiers` | create | draw_prize_tier | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/draw_prize_tiers/{draw_prize_tier_id}` | read | draw_prize_tier | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_draw_management/draw_prize_tiers` | list | draw_prize_tier | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_draw_management/draw_prize_tiers/{draw_prize_tier_id}` | update | draw_prize_tier | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_draw_management/draw_winners` | create | draw_winner | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_draw_management/draw_winners/{draw_winner_id}` | read | draw_winner | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_draw_management/draw_winners` | list | draw_winner | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_draw_management/draw_winners/{draw_winner_id}` | update | draw_winner | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_draw_management/jackpot_rollovers` | create | jackpot_rollover | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/jackpot_rollovers/{jackpot_rollover_id}` | read | jackpot_rollover | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_draw_management/jackpot_rollovers` | list | jackpot_rollover | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_draw_management/websocket_connections` | create | websocket_connection | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/websocket_connections/{websocket_connection_id}` | read | websocket_connection | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_draw_management/websocket_connections` | list | websocket_connection | AccessLevel.ADMIN |
| `DELETE` | `/api/v0/fawz_draw_management/websocket_connections/{websocket_connection_id}` | delete | websocket_connection | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_draw_management/draws`

**Create a new draw**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `archived_at` | string (date-time) | No | — |
| `broadcast_started_at` | string (date-time) | No | — |
| `consumer_payout_iqd` | integer | No | — |
| `consumer_winners` | integer | No | — |
| `draw_date` | string (date) | Yes | — |
| `draw_number` | integer | Yes | — |
| `draw_time` | string | No | Draw broadcast time (HH:MM:SS format) |
| `draw_type` | enum: ['monthly', 'weekly'] | Yes | — |
| `entry_cutoff_at` | string (date-time) | Yes | Timestamp after which new entries go to next draw |
| `entry_pool_size` | integer | No | — |
| `entry_pool_snapshot_at` | string (date-time) | No | — |
| `finalized_at` | string (date-time) | No | — |
| `finalized_by` | string | No | Admin who finalized |
| `jackpot_amount_iqd` | integer | No | — |
| `jackpot_claimed` | boolean | No | — |
| `jackpot_rollover_iqd` | integer | No | — |
| `jackpot_winners_count` | integer | No | — |
| `merchant_payout_iqd` | integer | No | — |
| `merchant_winners` | integer | No | — |
| `mismatch_notes` | string | No | — |
| `physical_draw_mismatch` | boolean | No | — |
| `pre_generated_at` | string (date-time) | No | — |
| `pre_generated_by` | string | No | — |
| `pre_generated_numbers_encrypted` | string | No | AES-256 encrypted JSON of 3 winning numbers |
| `prize_tier_last_10_iqd` | integer | No | — |
| `prize_tier_last_3_iqd` | integer | No | — |
| `prize_tier_last_5_iqd` | integer | No | — |
| `prize_tier_last_7_iqd` | integer | No | — |
| `scheduled_broadcast_at` | string (date-time) | Yes | — |
| `sealed_commit_hash` | string | No | — |
| `status` | enum: ['archived', 'cancelled', 'finalized', 'live', 'pool_snapshotted', 'scheduled'] | No | — |
| `total_payout_iqd` | integer | No | — |
| `total_winners` | integer | No | — |
| `winning_number_1` | integer | No | — |
| `winning_number_2` | integer | No | — |
| `winning_number_3` | integer | No | — |
| `winning_numbers` | string | No | JSON array of 3 winning numbers |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "archived_at": "2026-01-01T00:00:00Z",
  "broadcast_started_at": "2026-01-01T00:00:00Z",
  "consumer_payout_iqd": 0,
  "consumer_winners": 0,
  "draw_date": "2026-01-01",
  "draw_number": 1,
  "draw_time": "21:00:00",
  "draw_type": "monthly",
  "entry_cutoff_at": "2026-01-01T00:00:00Z",
  "entry_pool_size": 0,
  "entry_pool_snapshot_at": "2026-01-01T00:00:00Z",
  "finalized_at": "2026-01-01T00:00:00Z",
  "finalized_by": "example_finalized_by",
  "jackpot_amount_iqd": 0,
  "jackpot_claimed": false,
  "jackpot_rollover_iqd": 0,
  "jackpot_winners_count": 0,
  "merchant_payout_iqd": 0,
  "merchant_winners": 0,
  "mismatch_notes": "example_mismatch_notes",
  "physical_draw_mismatch": false,
  "pre_generated_at": "2026-01-01T00:00:00Z",
  "pre_generated_by": "example_pre_generated_by",
  "pre_generated_numbers_encrypted": "12345678",
  "prize_tier_last_10_iqd": 100000000,
  "prize_tier_last_3_iqd": 10000,
  "prize_tier_last_5_iqd": 100000,
  "prize_tier_last_7_iqd": 1000000,
  "scheduled_broadcast_at": "2026-01-01T00:00:00Z",
  "sealed_commit_hash": "example_sealed_commit_hash",
  "status": "archived",
  "total_payout_iqd": 0,
  "total_winners": 0,
  "winning_number_1": 1,
  "winning_number_2": 1,
  "winning_number_3": 1,
  "winning_numbers": "12345678"
}
```

**Example Response**:

```json
{
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Draw Created Successfully"
}
```

#### `GET /api/v0/fawz_draw_management/draws/{draw_id}`

**Get draw by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_id` | string (UUID) | Draw Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_id` | string | — |
| `tenant_id` | string | — |
| `archived_at` | string (date-time) | — |
| `broadcast_started_at` | string (date-time) | — |
| `consumer_payout_iqd` | integer | — |
| `consumer_winners` | integer | — |
| `draw_date` | string (date) | — |
| `draw_number` | integer | — |
| `draw_time` | string | Draw broadcast time (HH:MM:SS format) |
| `draw_type` | string | — |
| `entry_cutoff_at` | string (date-time) | Timestamp after which new entries go to next draw |
| `entry_pool_size` | integer | — |
| `entry_pool_snapshot_at` | string (date-time) | — |
| `finalized_at` | string (date-time) | — |
| `finalized_by` | string | Admin who finalized |
| `jackpot_amount_iqd` | integer | — |
| `jackpot_claimed` | boolean | — |
| `jackpot_rollover_iqd` | integer | — |
| `jackpot_winners_count` | integer | — |
| `merchant_payout_iqd` | integer | — |
| `merchant_winners` | integer | — |
| `mismatch_notes` | string | — |
| `physical_draw_mismatch` | boolean | — |
| `pre_generated_at` | string (date-time) | — |
| `pre_generated_by` | string | — |
| `pre_generated_numbers_encrypted` | string | AES-256 encrypted JSON of 3 winning numbers |
| `prize_tier_last_10_iqd` | integer | — |
| `prize_tier_last_3_iqd` | integer | — |
| `prize_tier_last_5_iqd` | integer | — |
| `prize_tier_last_7_iqd` | integer | — |
| `scheduled_broadcast_at` | string (date-time) | — |
| `sealed_commit_hash` | string | — |
| `status` | string | — |
| `total_payout_iqd` | integer | — |
| `total_winners` | integer | — |
| `winning_number_1` | integer | — |
| `winning_number_2` | integer | — |
| `winning_number_3` | integer | — |
| `winning_numbers` | string | JSON array of 3 winning numbers |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "archived_at": "2026-01-01T00:00:00Z",
  "broadcast_started_at": "2026-01-01T00:00:00Z",
  "consumer_payout_iqd": 0,
  "consumer_winners": 0,
  "draw_date": "2026-01-01",
  "draw_number": 1,
  "draw_time": "21:00:00",
  "draw_type": "monthly",
  "entry_cutoff_at": "2026-01-01T00:00:00Z",
  "entry_pool_size": 0,
  "entry_pool_snapshot_at": "2026-01-01T00:00:00Z",
  "finalized_at": "2026-01-01T00:00:00Z",
  "finalized_by": "example_finalized_by",
  "jackpot_amount_iqd": 0,
  "jackpot_claimed": false,
  "jackpot_rollover_iqd": 0,
  "jackpot_winners_count": 0,
  "merchant_payout_iqd": 0,
  "merchant_winners": 0,
  "mismatch_notes": "example_mismatch_notes",
  "physical_draw_mismatch": false,
  "pre_generated_at": "2026-01-01T00:00:00Z",
  "pre_generated_by": "example_pre_generated_by",
  "pre_generated_numbers_encrypted": "12345678",
  "prize_tier_last_10_iqd": 100000000,
  "prize_tier_last_3_iqd": 10000,
  "prize_tier_last_5_iqd": 100000,
  "prize_tier_last_7_iqd": 1000000,
  "scheduled_broadcast_at": "2026-01-01T00:00:00Z",
  "sealed_commit_hash": "example_sealed_commit_hash",
  "status": "archived",
  "total_payout_iqd": 0,
  "total_winners": 0,
  "winning_number_1": 1,
  "winning_number_2": 1,
  "winning_number_3": 1,
  "winning_numbers": "12345678",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_draw_management/draws`

**List draws**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_type` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draws_list` | array | Array of draw objects |
| `total_draws` | integer | Total count of draws |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draws_list": [
    {
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "archived_at": "2026-01-01T00:00:00Z",
      "broadcast_started_at": "2026-01-01T00:00:00Z",
      "consumer_payout_iqd": 0,
      "consumer_winners": 0,
      "draw_date": "2026-01-01",
      "draw_number": 1,
      "draw_time": "21:00:00",
      "draw_type": "monthly",
      "entry_cutoff_at": "2026-01-01T00:00:00Z",
      "entry_pool_size": 0,
      "entry_pool_snapshot_at": "2026-01-01T00:00:00Z",
      "finalized_at": "2026-01-01T00:00:00Z",
      "finalized_by": "example_finalized_by",
      "jackpot_amount_iqd": 0,
      "jackpot_claimed": false,
      "jackpot_rollover_iqd": 0,
      "jackpot_winners_count": 0,
      "merchant_payout_iqd": 0,
      "merchant_winners": 0,
      "mismatch_notes": "example_mismatch_notes",
      "physical_draw_mismatch": false,
      "pre_generated_at": "2026-01-01T00:00:00Z",
      "pre_generated_by": "example_pre_generated_by",
      "pre_generated_numbers_encrypted": "12345678",
      "prize_tier_last_10_iqd": 100000000,
      "prize_tier_last_3_iqd": 10000,
      "prize_tier_last_5_iqd": 100000,
      "prize_tier_last_7_iqd": 1000000,
      "scheduled_broadcast_at": "2026-01-01T00:00:00Z",
      "sealed_commit_hash": "example_sealed_commit_hash",
      "status": "archived",
      "total_payout_iqd": 0,
      "total_winners": 0,
      "winning_number_1": 1,
      "winning_number_2": 1,
      "winning_number_3": 1,
      "winning_numbers": "12345678",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_draws": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_draw_management/draws/{draw_id}`

**Update draw**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_id` | string (UUID) | Draw Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `archived_at` | string (date-time) | No | — |
| `broadcast_started_at` | string (date-time) | No | — |
| `consumer_payout_iqd` | integer | No | — |
| `consumer_winners` | integer | No | — |
| `draw_date` | string (date) | No | — |
| `draw_number` | integer | No | — |
| `draw_time` | string | No | Draw broadcast time (HH:MM:SS format) |
| `draw_type` | enum: ['monthly', 'weekly'] | No | — |
| `entry_cutoff_at` | string (date-time) | No | Timestamp after which new entries go to next draw |
| `entry_pool_size` | integer | No | — |
| `entry_pool_snapshot_at` | string (date-time) | No | — |
| `finalized_at` | string (date-time) | No | — |
| `finalized_by` | string | No | Admin who finalized |
| `jackpot_amount_iqd` | integer | No | — |
| `jackpot_claimed` | boolean | No | — |
| `jackpot_rollover_iqd` | integer | No | — |
| `jackpot_winners_count` | integer | No | — |
| `merchant_payout_iqd` | integer | No | — |
| `merchant_winners` | integer | No | — |
| `mismatch_notes` | string | No | — |
| `physical_draw_mismatch` | boolean | No | — |
| `pre_generated_at` | string (date-time) | No | — |
| `pre_generated_by` | string | No | — |
| `pre_generated_numbers_encrypted` | string | No | AES-256 encrypted JSON of 3 winning numbers |
| `prize_tier_last_10_iqd` | integer | No | — |
| `prize_tier_last_3_iqd` | integer | No | — |
| `prize_tier_last_5_iqd` | integer | No | — |
| `prize_tier_last_7_iqd` | integer | No | — |
| `scheduled_broadcast_at` | string (date-time) | No | — |
| `sealed_commit_hash` | string | No | — |
| `status` | enum: ['archived', 'cancelled', 'finalized', 'live', 'pool_snapshotted', 'scheduled'] | No | — |
| `total_payout_iqd` | integer | No | — |
| `total_winners` | integer | No | — |
| `winning_number_1` | integer | No | — |
| `winning_number_2` | integer | No | — |
| `winning_number_3` | integer | No | — |
| `winning_numbers` | string | No | JSON array of 3 winning numbers |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "archived_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "message": "Draw Updated Successfully"
}
```

#### `DELETE /api/v0/fawz_draw_management/draws/{draw_id}`

**Delete draw**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_id` | string (UUID) | Draw Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Deleted successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "message": "Draw Deleted Successfully"
}
```

#### `POST /api/v0/fawz_draw_management/draw_digit_events`

**Create a new draw digit event**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `broadcast_at` | string (date-time) | No | — |
| `corrected` | boolean | No | — |
| `correction_of` | string | No | ID of original digit event being corrected |
| `digit_position` | integer | Yes | Position 1-10 (right-to-left) |
| `digit_value` | integer | Yes | Single digit 0-9 |
| `draw_id` | string | Yes | — |
| `entered_at` | string (date-time) | Yes | — |
| `operator_id` | string | Yes | Admin user operating the tablet |
| `operator_ip` | string | Yes | — |
| `status` | enum: ['archived', 'broadcast', 'received'] | No | — |
| `websocket_broadcast_latency_ms` | integer | No | — |
| `winning_number_index` | integer | Yes | Which winning number (1, 2, or 3) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_digit_event_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "broadcast_at": "2026-01-01T00:00:00Z",
  "corrected": false,
  "correction_of": "example_correction_of",
  "digit_position": 1,
  "digit_value": 1,
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "entered_at": "2026-01-01T00:00:00Z",
  "operator_id": "550e8400-e29b-41d4-a716-446655440000",
  "operator_ip": "example_operator_ip",
  "status": "archived",
  "websocket_broadcast_latency_ms": 1,
  "winning_number_index": 1
}
```

**Example Response**:

```json
{
  "draw_digit_event_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "DrawDigitEvent Created Successfully"
}
```

#### `GET /api/v0/fawz_draw_management/draw_digit_events/{draw_digit_event_id}`

**Get draw digit event by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_digit_event_id` | string (UUID) | Draw Digit Event Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_digit_event_id` | string | — |
| `tenant_id` | string | — |
| `broadcast_at` | string (date-time) | — |
| `corrected` | boolean | — |
| `correction_of` | string | ID of original digit event being corrected |
| `digit_position` | integer | Position 1-10 (right-to-left) |
| `digit_value` | integer | Single digit 0-9 |
| `draw_id` | string | — |
| `entered_at` | string (date-time) | — |
| `operator_id` | string | Admin user operating the tablet |
| `operator_ip` | string | — |
| `status` | string | — |
| `websocket_broadcast_latency_ms` | integer | — |
| `winning_number_index` | integer | Which winning number (1, 2, or 3) |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_digit_event_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "broadcast_at": "2026-01-01T00:00:00Z",
  "corrected": false,
  "correction_of": "example_correction_of",
  "digit_position": 1,
  "digit_value": 1,
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "entered_at": "2026-01-01T00:00:00Z",
  "operator_id": "550e8400-e29b-41d4-a716-446655440000",
  "operator_ip": "example_operator_ip",
  "status": "archived",
  "websocket_broadcast_latency_ms": 1,
  "winning_number_index": 1,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_draw_management/draw_digit_events`

**List draw digit events**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_id` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `winning_number_index` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_digit_events_list` | array | Array of draw_digit_event objects |
| `total_draw_digit_events` | integer | Total count of draw_digit_events |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_digit_events_list": [
    {
      "draw_digit_event_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "broadcast_at": "2026-01-01T00:00:00Z",
      "corrected": false,
      "correction_of": "example_correction_of",
      "digit_position": 1,
      "digit_value": 1,
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "entered_at": "2026-01-01T00:00:00Z",
      "operator_id": "550e8400-e29b-41d4-a716-446655440000",
      "operator_ip": "example_operator_ip",
      "status": "archived",
      "websocket_broadcast_latency_ms": 1,
      "winning_number_index": 1,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_draw_digit_events": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_draw_management/draw_prize_tiers`

**Create a new draw prize tier**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actual_winners` | integer | No | — |
| `digits_matched` | integer | Yes | — |
| `draw_id` | string | Yes | — |
| `max_winners` | integer | No | — |
| `prize_amount_iqd` | integer | Yes | — |
| `tier_name` | string | Yes | — |
| `tier_name_ar` | string | No | — |
| `total_payout_iqd` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_prize_tier_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "actual_winners": 0,
  "digits_matched": 1,
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "max_winners": 1,
  "prize_amount_iqd": 1,
  "tier_name": "example_tier_name",
  "tier_name_ar": "example_tier_name_ar",
  "total_payout_iqd": 0
}
```

**Example Response**:

```json
{
  "draw_prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "DrawPrizeTier Created Successfully"
}
```

#### `GET /api/v0/fawz_draw_management/draw_prize_tiers/{draw_prize_tier_id}`

**Get draw prize tier by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_prize_tier_id` | string (UUID) | Draw Prize Tier Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_prize_tier_id` | string | — |
| `tenant_id` | string | — |
| `actual_winners` | integer | — |
| `digits_matched` | integer | — |
| `draw_id` | string | — |
| `max_winners` | integer | — |
| `prize_amount_iqd` | integer | — |
| `tier_name` | string | — |
| `tier_name_ar` | string | — |
| `total_payout_iqd` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "actual_winners": 0,
  "digits_matched": 1,
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "max_winners": 1,
  "prize_amount_iqd": 1,
  "tier_name": "example_tier_name",
  "tier_name_ar": "example_tier_name_ar",
  "total_payout_iqd": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_draw_management/draw_prize_tiers`

**List draw prize tiers**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_prize_tiers_list` | array | Array of draw_prize_tier objects |
| `total_draw_prize_tiers` | integer | Total count of draw_prize_tiers |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_prize_tiers_list": [
    {
      "draw_prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "actual_winners": 0,
      "digits_matched": 1,
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "max_winners": 1,
      "prize_amount_iqd": 1,
      "tier_name": "example_tier_name",
      "tier_name_ar": "example_tier_name_ar",
      "total_payout_iqd": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_draw_prize_tiers": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_draw_management/draw_prize_tiers/{draw_prize_tier_id}`

**Update draw prize tier**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_prize_tier_id` | string (UUID) | Draw Prize Tier Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actual_winners` | integer | No | — |
| `digits_matched` | integer | No | — |
| `draw_id` | string | No | — |
| `max_winners` | integer | No | — |
| `prize_amount_iqd` | integer | No | — |
| `tier_name` | string | No | — |
| `tier_name_ar` | string | No | — |
| `total_payout_iqd` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "actual_winners": 1
}
```

**Example Response**:

```json
{
  "message": "DrawPrizeTier Updated Successfully"
}
```

#### `POST /api/v0/fawz_draw_management/draw_winners`

**Create a new draw winner**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cap_exceeded` | boolean | No | — |
| `cap_exceeded_amount_iqd` | integer | No | — |
| `confirmed_at` | string (date-time) | No | — |
| `credited_at` | string (date-time) | No | — |
| `digits_matched` | integer | Yes | — |
| `draw_id` | string | Yes | — |
| `entry_id` | string | Yes | Reference to fawz_entry |
| `entry_number` | integer | Yes | The 10-digit Fawz Number |
| `is_jackpot` | boolean | No | — |
| `jackpot_split_count` | integer | No | — |
| `original_prize_amount_iqd` | integer | No | — |
| `owner_type` | enum: ['merchant', 'user'] | Yes | — |
| `payout_held_reason` | string | No | — |
| `payout_id` | string | No | Reference to prize_payout |
| `payout_status` | enum: ['created', 'credited', 'failed', 'held_cap_exceeded', 'held_compliance_review', 'held_for_review', 'paid', 'pending', 'pending_payout', 'rejected', 'staged'] | No | — |
| `prize_amount_iqd` | integer | Yes | — |
| `prize_tier` | enum: ['last_10', 'last_3', 'last_5', 'last_7'] | Yes | — |
| `prize_tier_id` | string | No | — |
| `review_notes` | string | No | — |
| `reviewed_at` | string (date-time) | No | — |
| `reviewed_by` | string | No | — |
| `staged_at` | string (date-time) | No | — |
| `winning_number` | integer | Yes | The winning number that was matched |
| `winning_number_index` | integer | Yes | Which of the 3 winning numbers (1-3) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_winner_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "cap_exceeded": false,
  "cap_exceeded_amount_iqd": 1,
  "confirmed_at": "2026-01-01T00:00:00Z",
  "credited_at": "2026-01-01T00:00:00Z",
  "digits_matched": 1,
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "entry_number": 1,
  "is_jackpot": false,
  "jackpot_split_count": 1,
  "original_prize_amount_iqd": 1,
  "owner_type": "merchant",
  "payout_held_reason": "example_payout_held_reason",
  "payout_id": "550e8400-e29b-41d4-a716-446655440000",
  "payout_status": "created",
  "prize_amount_iqd": 1,
  "prize_tier": "last_10",
  "prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
  "review_notes": "example_review_notes",
  "reviewed_at": "2026-01-01T00:00:00Z",
  "reviewed_by": "example_reviewed_by",
  "staged_at": "2026-01-01T00:00:00Z",
  "winning_number": 1,
  "winning_number_index": 1
}
```

**Example Response**:

```json
{
  "draw_winner_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "DrawWinner Created Successfully"
}
```

#### `GET /api/v0/fawz_draw_management/draw_winners/{draw_winner_id}`

**Get draw winner by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_winner_id` | string (UUID) | Draw Winner Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_winner_id` | string | — |
| `tenant_id` | string | — |
| `cap_exceeded` | boolean | — |
| `cap_exceeded_amount_iqd` | integer | — |
| `confirmed_at` | string (date-time) | — |
| `credited_at` | string (date-time) | — |
| `digits_matched` | integer | — |
| `draw_id` | string | — |
| `entry_id` | string | Reference to fawz_entry |
| `entry_number` | integer | The 10-digit Fawz Number |
| `is_jackpot` | boolean | — |
| `jackpot_split_count` | integer | — |
| `original_prize_amount_iqd` | integer | — |
| `owner_id` | string | Consumer or merchant ID |
| `owner_type` | string | — |
| `payout_held_reason` | string | — |
| `payout_id` | string | Reference to prize_payout |
| `payout_status` | string | — |
| `prize_amount_iqd` | integer | — |
| `prize_tier` | string | — |
| `prize_tier_id` | string | — |
| `review_notes` | string | — |
| `reviewed_at` | string (date-time) | — |
| `reviewed_by` | string | — |
| `staged_at` | string (date-time) | — |
| `winning_number` | integer | The winning number that was matched |
| `winning_number_index` | integer | Which of the 3 winning numbers (1-3) |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_winner_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "cap_exceeded": false,
  "cap_exceeded_amount_iqd": 1,
  "confirmed_at": "2026-01-01T00:00:00Z",
  "credited_at": "2026-01-01T00:00:00Z",
  "digits_matched": 1,
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "entry_number": 1,
  "is_jackpot": false,
  "jackpot_split_count": 1,
  "original_prize_amount_iqd": 1,
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_type": "merchant",
  "payout_held_reason": "example_payout_held_reason",
  "payout_id": "550e8400-e29b-41d4-a716-446655440000",
  "payout_status": "created",
  "prize_amount_iqd": 1,
  "prize_tier": "last_10",
  "prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
  "review_notes": "example_review_notes",
  "reviewed_at": "2026-01-01T00:00:00Z",
  "reviewed_by": "example_reviewed_by",
  "staged_at": "2026-01-01T00:00:00Z",
  "winning_number": 1,
  "winning_number_index": 1,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_draw_management/draw_winners`

**List draw winners**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `digits_matched` | string | — | Filter parameter |
| `draw_id` | string | — | Filter parameter |
| `owner_id` | string | — | Filter parameter |
| `owner_type` | string | — | Filter parameter |
| `payout_status` | string | — | Filter parameter |
| `prize_tier` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `draw_winners_list` | array | Array of draw_winner objects |
| `total_draw_winners` | integer | Total count of draw_winners |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "draw_winners_list": [
    {
      "draw_winner_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "cap_exceeded": false,
      "cap_exceeded_amount_iqd": 1,
      "confirmed_at": "2026-01-01T00:00:00Z",
      "credited_at": "2026-01-01T00:00:00Z",
      "digits_matched": 1,
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "entry_id": "550e8400-e29b-41d4-a716-446655440000",
      "entry_number": 1,
      "is_jackpot": false,
      "jackpot_split_count": 1,
      "original_prize_amount_iqd": 1,
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "owner_type": "merchant",
      "payout_held_reason": "example_payout_held_reason",
      "payout_id": "550e8400-e29b-41d4-a716-446655440000",
      "payout_status": "created",
      "prize_amount_iqd": 1,
      "prize_tier": "last_10",
      "prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
      "review_notes": "example_review_notes",
      "reviewed_at": "2026-01-01T00:00:00Z",
      "reviewed_by": "example_reviewed_by",
      "staged_at": "2026-01-01T00:00:00Z",
      "winning_number": 1,
      "winning_number_index": 1,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_draw_winners": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_draw_management/draw_winners/{draw_winner_id}`

**Update draw winner**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `draw_winner_id` | string (UUID) | Draw Winner Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cap_exceeded` | boolean | No | — |
| `cap_exceeded_amount_iqd` | integer | No | — |
| `confirmed_at` | string (date-time) | No | — |
| `credited_at` | string (date-time) | No | — |
| `digits_matched` | integer | No | — |
| `draw_id` | string | No | — |
| `entry_id` | string | No | Reference to fawz_entry |
| `entry_number` | integer | No | The 10-digit Fawz Number |
| `is_jackpot` | boolean | No | — |
| `jackpot_split_count` | integer | No | — |
| `original_prize_amount_iqd` | integer | No | — |
| `owner_type` | enum: ['merchant', 'user'] | No | — |
| `payout_held_reason` | string | No | — |
| `payout_id` | string | No | Reference to prize_payout |
| `payout_status` | enum: ['created', 'credited', 'failed', 'held_cap_exceeded', 'held_compliance_review', 'held_for_review', 'paid', 'pending', 'pending_payout', 'rejected', 'staged'] | No | — |
| `prize_amount_iqd` | integer | No | — |
| `prize_tier` | enum: ['last_10', 'last_3', 'last_5', 'last_7'] | No | — |
| `prize_tier_id` | string | No | — |
| `review_notes` | string | No | — |
| `reviewed_at` | string (date-time) | No | — |
| `reviewed_by` | string | No | — |
| `staged_at` | string (date-time) | No | — |
| `winning_number` | integer | No | The winning number that was matched |
| `winning_number_index` | integer | No | Which of the 3 winning numbers (1-3) |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "cap_exceeded": true
}
```

**Example Response**:

```json
{
  "message": "DrawWinner Updated Successfully"
}
```

#### `POST /api/v0/fawz_draw_management/jackpot_rollovers`

**Create a new jackpot rollover**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cap_amount_iqd` | integer | No | — |
| `cap_exceeded` | boolean | No | — |
| `cumulative_amount_iqd` | integer | Yes | — |
| `draw_type` | enum: ['monthly', 'weekly'] | Yes | — |
| `excess_redistributed_iqd` | integer | No | — |
| `from_draw_id` | string | No | — |
| `rollover_amount_iqd` | integer | Yes | — |
| `to_draw_id` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `jackpot_rollover_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "cap_amount_iqd": 300000000000,
  "cap_exceeded": false,
  "cumulative_amount_iqd": 1,
  "draw_type": "monthly",
  "excess_redistributed_iqd": 0,
  "from_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "rollover_amount_iqd": 1,
  "to_draw_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response**:

```json
{
  "jackpot_rollover_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "JackpotRollover Created Successfully"
}
```

#### `GET /api/v0/fawz_draw_management/jackpot_rollovers/{jackpot_rollover_id}`

**Get jackpot rollover by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `jackpot_rollover_id` | string (UUID) | Jackpot Rollover Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `jackpot_rollover_id` | string | — |
| `tenant_id` | string | — |
| `cap_amount_iqd` | integer | — |
| `cap_exceeded` | boolean | — |
| `cumulative_amount_iqd` | integer | — |
| `draw_type` | string | — |
| `excess_redistributed_iqd` | integer | — |
| `from_draw_id` | string | — |
| `rollover_amount_iqd` | integer | — |
| `to_draw_id` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "jackpot_rollover_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "cap_amount_iqd": 300000000000,
  "cap_exceeded": false,
  "cumulative_amount_iqd": 1,
  "draw_type": "monthly",
  "excess_redistributed_iqd": 0,
  "from_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "rollover_amount_iqd": 1,
  "to_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_draw_management/jackpot_rollovers`

**List jackpot rollovers**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_type` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `jackpot_rollovers_list` | array | Array of jackpot_rollover objects |
| `total_jackpot_rollovers` | integer | Total count of jackpot_rollovers |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "jackpot_rollovers_list": [
    {
      "jackpot_rollover_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "cap_amount_iqd": 300000000000,
      "cap_exceeded": false,
      "cumulative_amount_iqd": 1,
      "draw_type": "monthly",
      "excess_redistributed_iqd": 0,
      "from_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "rollover_amount_iqd": 1,
      "to_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_jackpot_rollovers": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_draw_management/websocket_connections`

**Create a new websocket connection**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `connected_at` | string (date-time) | Yes | — |
| `connection_id` | string | Yes | — |
| `disconnect_reason` | string | No | — |
| `disconnected_at` | string (date-time) | No | — |
| `draw_id` | string | No | Draw being watched |
| `ip_address` | string | No | — |
| `last_ping_at` | string (date-time) | No | — |
| `server_instance` | string | No | — |
| `user_agent` | string | No | — |
| `user_id` | string | No | — |
| `user_type` | enum: ['admin', 'anonymous', 'consumer', 'merchant'] | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `websocket_connection_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "connected_at": "2026-01-01T00:00:00Z",
  "connection_id": "550e8400-e29b-41d4-a716-446655440000",
  "disconnect_reason": "example_disconnect_reason",
  "disconnected_at": "2026-01-01T00:00:00Z",
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "ip_address": "example_ip_address",
  "last_ping_at": "2026-01-01T00:00:00Z",
  "server_instance": "example_server_instance",
  "user_agent": "example_user_agent",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_type": "admin"
}
```

**Example Response**:

```json
{
  "websocket_connection_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "WebsocketConnection Created Successfully"
}
```

#### `GET /api/v0/fawz_draw_management/websocket_connections/{websocket_connection_id}`

**Get websocket connection by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `websocket_connection_id` | string (UUID) | Websocket Connection Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `websocket_connection_id` | string | — |
| `tenant_id` | string | — |
| `connected_at` | string (date-time) | — |
| `connection_id` | string | — |
| `disconnect_reason` | string | — |
| `disconnected_at` | string (date-time) | — |
| `draw_id` | string | Draw being watched |
| `ip_address` | string | — |
| `last_ping_at` | string (date-time) | — |
| `server_instance` | string | — |
| `user_agent` | string | — |
| `user_id` | string | — |
| `user_type` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "websocket_connection_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "connected_at": "2026-01-01T00:00:00Z",
  "connection_id": "550e8400-e29b-41d4-a716-446655440000",
  "disconnect_reason": "example_disconnect_reason",
  "disconnected_at": "2026-01-01T00:00:00Z",
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "ip_address": "example_ip_address",
  "last_ping_at": "2026-01-01T00:00:00Z",
  "server_instance": "example_server_instance",
  "user_agent": "example_user_agent",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_type": "admin",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_draw_management/websocket_connections`

**List websocket connections**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_id` | string | — | Filter parameter |
| `user_type` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `websocket_connections_list` | array | Array of websocket_connection objects |
| `total_websocket_connections` | integer | Total count of websocket_connections |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "websocket_connections_list": [
    {
      "websocket_connection_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "connected_at": "2026-01-01T00:00:00Z",
      "connection_id": "550e8400-e29b-41d4-a716-446655440000",
      "disconnect_reason": "example_disconnect_reason",
      "disconnected_at": "2026-01-01T00:00:00Z",
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "ip_address": "example_ip_address",
      "last_ping_at": "2026-01-01T00:00:00Z",
      "server_instance": "example_server_instance",
      "user_agent": "example_user_agent",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_type": "admin",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_websocket_connections": 1,
  "page": 1,
  "page_size": 20
}
```

#### `DELETE /api/v0/fawz_draw_management/websocket_connections/{websocket_connection_id}`

**Delete websocket connection**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `websocket_connection_id` | string (UUID) | Websocket Connection Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Deleted successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "message": "WebsocketConnection Deleted Successfully"
}
```

---

## backend-fawz-entry-generation

**Base URL**: `/api/v0/fawz_entry_generation`
**Port**: `8005`
**Description**: Handles Fawz Number creation from qualifying transactions, retroactive seeding, and channel multiplier configuration. Contains fawz_entry (core entry records with 10-digit numbers and trailing digit indexes), channel_multiplier_config (per-channel entry multipliers), transaction_eligibility_cache (60-second duplicate detection), and retroactive_seed_batch (one-time launch seeding). Entry generation must complete in <200ms p99. References consumer_user and merchant via string IDs cross-service

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_entry_generation/channel_multiplier_configs` | create | channel_multiplier_config | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_entry_generation/channel_multiplier_configs/{channel_multiplier_config_id}` | read | channel_multiplier_config | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_entry_generation/channel_multiplier_configs` | list | channel_multiplier_config | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_entry_generation/channel_multiplier_configs/{channel_multiplier_config_id}` | update | channel_multiplier_config | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_entry_generation/fawz_entries` | create | fawz_entry | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_entry_generation/fawz_entries/{fawz_entry_id}` | read | fawz_entry | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_entry_generation/fawz_entries` | list | fawz_entry | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_entry_generation/retroactive_seed_batches` | create | retroactive_seed_batch | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_entry_generation/retroactive_seed_batches/{retroactive_seed_batch_id}` | read | retroactive_seed_batch | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_entry_generation/retroactive_seed_batches` | list | retroactive_seed_batch | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_entry_generation/retroactive_seed_batches/{retroactive_seed_batch_id}` | update | retroactive_seed_batch | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_entry_generation/transaction_eligibility_caches` | create | transaction_eligibility_cache | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_entry_generation/transaction_eligibility_caches/{transaction_eligibility_cache_id}` | read | transaction_eligibility_cache | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_entry_generation/transaction_eligibility_caches` | list | transaction_eligibility_cache | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_entry_generation/channel_multiplier_configs`

**Create a new channel multiplier config**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channel` | enum: ['bill_pay', 'fawz_certified_pos', 'online', 'pos', 'qr', 'top_up'] | Yes | — |
| `effective_from` | string (date) | Yes | — |
| `effective_until` | string (date) | No | — |
| `is_active` | boolean | No | — |
| `merchant_id` | string | No | Optional merchant-specific multiplier |
| `multiplier` | number | No | — |
| `status` | enum: ['active', 'configured', 'dormant', 'updated'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `channel_multiplier_config_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "channel": "bill_pay",
  "effective_from": "2026-01-01",
  "effective_until": "2026-01-01",
  "is_active": true,
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "multiplier": 1.0,
  "status": "active"
}
```

**Example Response**:

```json
{
  "channel_multiplier_config_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "ChannelMultiplierConfig Created Successfully"
}
```

#### `GET /api/v0/fawz_entry_generation/channel_multiplier_configs/{channel_multiplier_config_id}`

**Get channel multiplier config by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel_multiplier_config_id` | string (UUID) | Channel Multiplier Config Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `channel_multiplier_config_id` | string | — |
| `tenant_id` | string | — |
| `channel` | string | — |
| `effective_from` | string (date) | — |
| `effective_until` | string (date) | — |
| `is_active` | boolean | — |
| `merchant_id` | string | Optional merchant-specific multiplier |
| `multiplier` | number | — |
| `status` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "channel_multiplier_config_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "channel": "bill_pay",
  "effective_from": "2026-01-01",
  "effective_until": "2026-01-01",
  "is_active": true,
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "multiplier": 1.0,
  "status": "active",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_entry_generation/channel_multiplier_configs`

**List channel multiplier configs**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `channel` | string | — | Filter parameter |
| `is_active` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `channel_multiplier_configs_list` | array | Array of channel_multiplier_config objects |
| `total_channel_multiplier_configs` | integer | Total count of channel_multiplier_configs |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "channel_multiplier_configs_list": [
    {
      "channel_multiplier_config_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "channel": "bill_pay",
      "effective_from": "2026-01-01",
      "effective_until": "2026-01-01",
      "is_active": true,
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "multiplier": 1.0,
      "status": "active",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_channel_multiplier_configs": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_entry_generation/channel_multiplier_configs/{channel_multiplier_config_id}`

**Update channel multiplier config**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `channel_multiplier_config_id` | string (UUID) | Channel Multiplier Config Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channel` | enum: ['bill_pay', 'fawz_certified_pos', 'online', 'pos', 'qr', 'top_up'] | No | — |
| `effective_from` | string (date) | No | — |
| `effective_until` | string (date) | No | — |
| `is_active` | boolean | No | — |
| `merchant_id` | string | No | Optional merchant-specific multiplier |
| `multiplier` | number | No | — |
| `status` | enum: ['active', 'configured', 'dormant', 'updated'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "channel": "bill_pay"
}
```

**Example Response**:

```json
{
  "message": "ChannelMultiplierConfig Updated Successfully"
}
```

#### `POST /api/v0/fawz_entry_generation/fawz_entries`

**Create a new fawz entry**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `channel` | enum: ['bill_pay', 'online', 'other', 'pos', 'qr', 'top_up'] | No | — |
| `digits_matched` | integer | No | — |
| `draw_month` | integer | Yes | — |
| `draw_month_id` | string | No | Reference to monthly draw |
| `draw_week` | integer | Yes | — |
| `draw_week_id` | string | No | Reference to weekly draw |
| `draw_year` | integer | Yes | — |
| `expired_at` | string (date-time) | No | — |
| `expiry_reason` | string | No | — |
| `fawz_number` | integer | Yes | Cryptographic 10-digit number (0-9999999999) |
| `fawz_number_formatted` | string | No | Display format FZ-XX-XXXX-XXXX |
| `is_expired` | boolean | No | — |
| `is_retroactive` | boolean | No | — |
| `is_shared_entry` | boolean | No | True for merchant shared entries |
| `matched_at` | string (date-time) | No | — |
| `matched_draw_id` | string | No | — |
| `merchant_id` | string | No | Merchant where transaction occurred |
| `multiplier` | number | No | — |
| `owner_type` | enum: ['merchant', 'user'] | Yes | — |
| `prize_tier_id` | string | No | — |
| `source` | enum: ['bonus', 'challenge', 'community_challenge', 'onboarding', 'referral', 'retroactive', 'transaction'] | Yes | — |
| `source_challenge_id` | string | No | — |
| `source_consumer_id` | string | No | Customer who triggered shared merchant entry |
| `source_reference_id` | string | No | — |
| `source_referral_id` | string | No | — |
| `status` | enum: ['active', 'archived', 'expired', 'matched', 'not_won', 'won'] | No | — |
| `trailing_3` | integer | No | Last 3 digits for indexed winner matching |
| `trailing_4` | integer | No | Last 4 digits for indexed winner matching |
| `trailing_5` | integer | No | Last 5 digits for indexed winner matching |
| `transaction_amount_iqd` | integer | No | — |
| `transaction_id` | string | No | SuperQi transaction reference |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fawz_entry_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "channel": "bill_pay",
  "digits_matched": 1,
  "draw_month": 1,
  "draw_month_id": "550e8400-e29b-41d4-a716-446655440000",
  "draw_week": 1,
  "draw_week_id": "550e8400-e29b-41d4-a716-446655440000",
  "draw_year": 1,
  "expired_at": "2026-01-01T00:00:00Z",
  "expiry_reason": "example_expiry_reason",
  "fawz_number": 1,
  "fawz_number_formatted": "12345678",
  "is_expired": false,
  "is_retroactive": false,
  "is_shared_entry": false,
  "matched_at": "2026-01-01T00:00:00Z",
  "matched_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "multiplier": 1.0,
  "owner_type": "merchant",
  "prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "bonus",
  "source_challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_consumer_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_reference_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active",
  "trailing_3": 1,
  "trailing_4": 1,
  "trailing_5": 1,
  "transaction_amount_iqd": 1,
  "transaction_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response**:

```json
{
  "fawz_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "FawzEntry Created Successfully"
}
```

#### `GET /api/v0/fawz_entry_generation/fawz_entries/{fawz_entry_id}`

**Get fawz entry by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `fawz_entry_id` | string (UUID) | Fawz Entry Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fawz_entry_id` | string | — |
| `tenant_id` | string | — |
| `channel` | string | — |
| `digits_matched` | integer | — |
| `draw_month` | integer | — |
| `draw_month_id` | string | Reference to monthly draw |
| `draw_week` | integer | — |
| `draw_week_id` | string | Reference to weekly draw |
| `draw_year` | integer | — |
| `expired_at` | string (date-time) | — |
| `expiry_reason` | string | — |
| `fawz_number` | integer | Cryptographic 10-digit number (0-9999999999) |
| `fawz_number_formatted` | string | Display format FZ-XX-XXXX-XXXX |
| `is_expired` | boolean | — |
| `is_retroactive` | boolean | — |
| `is_shared_entry` | boolean | True for merchant shared entries |
| `matched_at` | string (date-time) | — |
| `matched_draw_id` | string | — |
| `merchant_id` | string | Merchant where transaction occurred |
| `multiplier` | number | — |
| `owner_id` | string | Consumer or merchant user ID |
| `owner_type` | string | — |
| `prize_tier_id` | string | — |
| `source` | string | — |
| `source_challenge_id` | string | — |
| `source_consumer_id` | string | Customer who triggered shared merchant entry |
| `source_reference_id` | string | — |
| `source_referral_id` | string | — |
| `status` | string | — |
| `trailing_3` | integer | Last 3 digits for indexed winner matching |
| `trailing_4` | integer | Last 4 digits for indexed winner matching |
| `trailing_5` | integer | Last 5 digits for indexed winner matching |
| `transaction_amount_iqd` | integer | — |
| `transaction_id` | string | SuperQi transaction reference |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "fawz_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "channel": "bill_pay",
  "digits_matched": 1,
  "draw_month": 1,
  "draw_month_id": "550e8400-e29b-41d4-a716-446655440000",
  "draw_week": 1,
  "draw_week_id": "550e8400-e29b-41d4-a716-446655440000",
  "draw_year": 1,
  "expired_at": "2026-01-01T00:00:00Z",
  "expiry_reason": "example_expiry_reason",
  "fawz_number": 1,
  "fawz_number_formatted": "12345678",
  "is_expired": false,
  "is_retroactive": false,
  "is_shared_entry": false,
  "matched_at": "2026-01-01T00:00:00Z",
  "matched_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "multiplier": 1.0,
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_type": "merchant",
  "prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
  "source": "bonus",
  "source_challenge_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_consumer_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_reference_id": "550e8400-e29b-41d4-a716-446655440000",
  "source_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active",
  "trailing_3": 1,
  "trailing_4": 1,
  "trailing_5": 1,
  "transaction_amount_iqd": 1,
  "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_entry_generation/fawz_entries`

**List fawz entries**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `channel` | string | — | Filter parameter |
| `draw_month` | string | — | Filter parameter |
| `draw_week` | string | — | Filter parameter |
| `draw_year` | string | — | Filter parameter |
| `is_expired` | string | — | Filter parameter |
| `is_retroactive` | string | — | Filter parameter |
| `owner_id` | string | — | Filter parameter |
| `owner_type` | string | — | Filter parameter |
| `source` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fawz_entries_list` | array | Array of fawz_entry objects |
| `total_fawz_entries` | integer | Total count of fawz_entries |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "fawz_entries_list": [
    {
      "fawz_entry_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "channel": "bill_pay",
      "digits_matched": 1,
      "draw_month": 1,
      "draw_month_id": "550e8400-e29b-41d4-a716-446655440000",
      "draw_week": 1,
      "draw_week_id": "550e8400-e29b-41d4-a716-446655440000",
      "draw_year": 1,
      "expired_at": "2026-01-01T00:00:00Z",
      "expiry_reason": "example_expiry_reason",
      "fawz_number": 1,
      "fawz_number_formatted": "12345678",
      "is_expired": false,
      "is_retroactive": false,
      "is_shared_entry": false,
      "matched_at": "2026-01-01T00:00:00Z",
      "matched_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "multiplier": 1.0,
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "owner_type": "merchant",
      "prize_tier_id": "550e8400-e29b-41d4-a716-446655440000",
      "source": "bonus",
      "source_challenge_id": "550e8400-e29b-41d4-a716-446655440000",
      "source_consumer_id": "550e8400-e29b-41d4-a716-446655440000",
      "source_reference_id": "550e8400-e29b-41d4-a716-446655440000",
      "source_referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "active",
      "trailing_3": 1,
      "trailing_4": 1,
      "trailing_5": 1,
      "transaction_amount_iqd": 1,
      "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_fawz_entries": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_entry_generation/retroactive_seed_batches`

**Create a new retroactive seed batch**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `batch_number` | integer | Yes | — |
| `completed_at` | string (date-time) | No | — |
| `error_count` | integer | No | — |
| `expired_at` | string (date-time) | No | — |
| `first_draw_id` | string | No | Draw these entries are eligible for |
| `last_error` | string | No | — |
| `locked_at` | string (date-time) | No | — |
| `lookback_days` | integer | No | — |
| `max_entries_per_user` | integer | No | — |
| `progress_percent` | number | No | — |
| `scheduled_at` | string (date-time) | Yes | — |
| `started_at` | string (date-time) | No | — |
| `status` | enum: ['completed', 'expired_after_first_draw', 'failed', 'locked', 'running', 'scheduled'] | No | — |
| `total_eligible_users` | integer | No | — |
| `total_entries_generated` | integer | No | — |
| `total_users_processed` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `retroactive_seed_batch_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "batch_number": 1,
  "completed_at": "2026-01-01T00:00:00Z",
  "error_count": 0,
  "expired_at": "2026-01-01T00:00:00Z",
  "first_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "last_error": "example_last_error",
  "locked_at": "2026-01-01T00:00:00Z",
  "lookback_days": 90,
  "max_entries_per_user": 15,
  "progress_percent": 0.0,
  "scheduled_at": "2026-01-01T00:00:00Z",
  "started_at": "2026-01-01T00:00:00Z",
  "status": "completed",
  "total_eligible_users": 1,
  "total_entries_generated": 0,
  "total_users_processed": 0
}
```

**Example Response**:

```json
{
  "retroactive_seed_batch_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "RetroactiveSeedBatch Created Successfully"
}
```

#### `GET /api/v0/fawz_entry_generation/retroactive_seed_batches/{retroactive_seed_batch_id}`

**Get retroactive seed batch by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `retroactive_seed_batch_id` | string (UUID) | Retroactive Seed Batch Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `retroactive_seed_batch_id` | string | — |
| `tenant_id` | string | — |
| `batch_number` | integer | — |
| `completed_at` | string (date-time) | — |
| `error_count` | integer | — |
| `expired_at` | string (date-time) | — |
| `first_draw_id` | string | Draw these entries are eligible for |
| `last_error` | string | — |
| `locked_at` | string (date-time) | — |
| `lookback_days` | integer | — |
| `max_entries_per_user` | integer | — |
| `progress_percent` | number | — |
| `scheduled_at` | string (date-time) | — |
| `started_at` | string (date-time) | — |
| `status` | string | — |
| `total_eligible_users` | integer | — |
| `total_entries_generated` | integer | — |
| `total_users_processed` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "retroactive_seed_batch_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "batch_number": 1,
  "completed_at": "2026-01-01T00:00:00Z",
  "error_count": 0,
  "expired_at": "2026-01-01T00:00:00Z",
  "first_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "last_error": "example_last_error",
  "locked_at": "2026-01-01T00:00:00Z",
  "lookback_days": 90,
  "max_entries_per_user": 15,
  "progress_percent": 0.0,
  "scheduled_at": "2026-01-01T00:00:00Z",
  "started_at": "2026-01-01T00:00:00Z",
  "status": "completed",
  "total_eligible_users": 1,
  "total_entries_generated": 0,
  "total_users_processed": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_entry_generation/retroactive_seed_batches`

**List retroactive seed batches**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `retroactive_seed_batchs_list` | array | Array of retroactive_seed_batch objects |
| `total_retroactive_seed_batches` | integer | Total count of retroactive_seed_batches |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "retroactive_seed_batchs_list": [
    {
      "retroactive_seed_batch_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "batch_number": 1,
      "completed_at": "2026-01-01T00:00:00Z",
      "error_count": 0,
      "expired_at": "2026-01-01T00:00:00Z",
      "first_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "last_error": "example_last_error",
      "locked_at": "2026-01-01T00:00:00Z",
      "lookback_days": 90,
      "max_entries_per_user": 15,
      "progress_percent": 0.0,
      "scheduled_at": "2026-01-01T00:00:00Z",
      "started_at": "2026-01-01T00:00:00Z",
      "status": "completed",
      "total_eligible_users": 1,
      "total_entries_generated": 0,
      "total_users_processed": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_retroactive_seed_batches": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_entry_generation/retroactive_seed_batches/{retroactive_seed_batch_id}`

**Update retroactive seed batch**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `retroactive_seed_batch_id` | string (UUID) | Retroactive Seed Batch Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `batch_number` | integer | No | — |
| `completed_at` | string (date-time) | No | — |
| `error_count` | integer | No | — |
| `expired_at` | string (date-time) | No | — |
| `first_draw_id` | string | No | Draw these entries are eligible for |
| `last_error` | string | No | — |
| `locked_at` | string (date-time) | No | — |
| `lookback_days` | integer | No | — |
| `max_entries_per_user` | integer | No | — |
| `progress_percent` | number | No | — |
| `scheduled_at` | string (date-time) | No | — |
| `started_at` | string (date-time) | No | — |
| `status` | enum: ['completed', 'expired_after_first_draw', 'failed', 'locked', 'running', 'scheduled'] | No | — |
| `total_eligible_users` | integer | No | — |
| `total_entries_generated` | integer | No | — |
| `total_users_processed` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "batch_number": 1
}
```

**Example Response**:

```json
{
  "message": "RetroactiveSeedBatch Updated Successfully"
}
```

#### `POST /api/v0/fawz_entry_generation/transaction_eligibility_caches`

**Create a new transaction eligibility cache**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `expires_at` | string (date-time) | Yes | — |
| `merchant_id` | string | Yes | — |
| `transaction_amount_iqd` | integer | Yes | — |
| `transaction_at` | string (date-time) | Yes | — |
| `transaction_hash` | string | Yes | Hash of user+merchant+amount for dedup |
| `user_id` | string | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `transaction_eligibility_cache_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "expires_at": "2026-01-01T00:00:00Z",
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "transaction_amount_iqd": 1,
  "transaction_at": "2026-01-01T00:00:00Z",
  "transaction_hash": "example_transaction_hash",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Example Response**:

```json
{
  "transaction_eligibility_cache_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "TransactionEligibilityCache Created Successfully"
}
```

#### `GET /api/v0/fawz_entry_generation/transaction_eligibility_caches/{transaction_eligibility_cache_id}`

**Get transaction eligibility cache by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `transaction_eligibility_cache_id` | string (UUID) | Transaction Eligibility Cache Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `transaction_eligibility_cache_id` | string | — |
| `tenant_id` | string | — |
| `expires_at` | string (date-time) | — |
| `merchant_id` | string | — |
| `transaction_amount_iqd` | integer | — |
| `transaction_at` | string (date-time) | — |
| `transaction_hash` | string | Hash of user+merchant+amount for dedup |
| `user_id` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "transaction_eligibility_cache_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_at": "2026-01-01T00:00:00Z",
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "transaction_amount_iqd": 1,
  "transaction_at": "2026-01-01T00:00:00Z",
  "transaction_hash": "example_transaction_hash",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_entry_generation/transaction_eligibility_caches`

**List transaction eligibility caches**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `merchant_id` | string | — | Filter parameter |
| `user_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `transaction_eligibility_caches_list` | array | Array of transaction_eligibility_cache objects |
| `total_transaction_eligibility_caches` | integer | Total count of transaction_eligibility_caches |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "transaction_eligibility_caches_list": [
    {
      "transaction_eligibility_cache_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "expires_at": "2026-01-01T00:00:00Z",
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "transaction_amount_iqd": 1,
      "transaction_at": "2026-01-01T00:00:00Z",
      "transaction_hash": "example_transaction_hash",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_transaction_eligibility_caches": 1,
  "page": 1,
  "page_size": 20
}
```

---

## backend-fawz-fraud-compliance

**Base URL**: `/api/v0/fawz_fraud_compliance`
**Port**: `8006`
**Description**: Implements rules-based fraud detection, human review workflow, account suspension management, and consumer dispute resolution. Contains fraud_review_case (case records with 17 flag types, SLA tracking, decision workflow), fraud_case_communication (case communication log), account_suspension (suspension/reinstatement audit trail), and dispute (consumer-submitted disputes with auto-check and resolution tracking). All fraud decisions require human review with mandatory 50-character reasoning notes. No automated account suspensions

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_fraud_compliance/account_suspensions` | create | account_suspension | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_fraud_compliance/account_suspensions/{account_suspension_id}` | read | account_suspension | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_fraud_compliance/account_suspensions` | list | account_suspension | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_fraud_compliance/disputes` | create | dispute | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_fraud_compliance/disputes/{dispute_id}` | read | dispute | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_fraud_compliance/disputes` | list | dispute | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_fraud_compliance/disputes/{dispute_id}` | update | dispute | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_fraud_compliance/fraud_case_communications` | create | fraud_case_communication | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_fraud_compliance/fraud_case_communications/{fraud_case_communication_id}` | read | fraud_case_communication | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_fraud_compliance/fraud_case_communications` | list | fraud_case_communication | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_fraud_compliance/fraud_review_cases` | create | fraud_review_case | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_fraud_compliance/fraud_review_cases/{fraud_review_case_id}` | read | fraud_review_case | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_fraud_compliance/fraud_review_cases` | list | fraud_review_case | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_fraud_compliance/fraud_review_cases/{fraud_review_case_id}` | update | fraud_review_case | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_fraud_compliance/account_suspensions`

**Create a new account suspension**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_id` | string | Yes | Consumer or merchant account ID |
| `account_type` | enum: ['consumer', 'merchant'] | Yes | — |
| `action` | enum: ['reinstate', 'suspend'] | Yes | — |
| `fraud_case_id` | string | No | — |
| `notification_sent` | boolean | No | — |
| `notification_sent_at` | string (date-time) | No | — |
| `reason` | string | Yes | — |
| `reinstated_at` | string (date-time) | No | — |
| `reinstated_by` | string | No | Admin who reinstated |
| `reinstatement_reason` | string | No | — |
| `suspended_at` | string (date-time) | Yes | — |
| `suspended_by` | string | Yes | Admin who suspended |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `account_suspension_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "account_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_type": "consumer",
  "action": "reinstate",
  "fraud_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "notification_sent": false,
  "notification_sent_at": "2026-01-01T00:00:00Z",
  "reason": "example_reason",
  "reinstated_at": "2026-01-01T00:00:00Z",
  "reinstated_by": "example_reinstated_by",
  "reinstatement_reason": "example_reinstatement_reason",
  "suspended_at": "2026-01-01T00:00:00Z",
  "suspended_by": "example_suspended_by"
}
```

**Example Response**:

```json
{
  "account_suspension_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "AccountSuspension Created Successfully"
}
```

#### `GET /api/v0/fawz_fraud_compliance/account_suspensions/{account_suspension_id}`

**Get account suspension by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `account_suspension_id` | string (UUID) | Account Suspension Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `account_suspension_id` | string | — |
| `tenant_id` | string | — |
| `account_id` | string | Consumer or merchant account ID |
| `account_type` | string | — |
| `action` | string | — |
| `fraud_case_id` | string | — |
| `notification_sent` | boolean | — |
| `notification_sent_at` | string (date-time) | — |
| `reason` | string | — |
| `reinstated_at` | string (date-time) | — |
| `reinstated_by` | string | Admin who reinstated |
| `reinstatement_reason` | string | — |
| `suspended_at` | string (date-time) | — |
| `suspended_by` | string | Admin who suspended |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "account_suspension_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_type": "consumer",
  "action": "reinstate",
  "fraud_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "notification_sent": false,
  "notification_sent_at": "2026-01-01T00:00:00Z",
  "reason": "example_reason",
  "reinstated_at": "2026-01-01T00:00:00Z",
  "reinstated_by": "example_reinstated_by",
  "reinstatement_reason": "example_reinstatement_reason",
  "suspended_at": "2026-01-01T00:00:00Z",
  "suspended_by": "example_suspended_by",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_fraud_compliance/account_suspensions`

**List account suspensions**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `account_id` | string | — | Filter parameter |
| `account_type` | string | — | Filter parameter |
| `action` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `account_suspensions_list` | array | Array of account_suspension objects |
| `total_account_suspensions` | integer | Total count of account_suspensions |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "account_suspensions_list": [
    {
      "account_suspension_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "account_id": "550e8400-e29b-41d4-a716-446655440000",
      "account_type": "consumer",
      "action": "reinstate",
      "fraud_case_id": "550e8400-e29b-41d4-a716-446655440000",
      "notification_sent": false,
      "notification_sent_at": "2026-01-01T00:00:00Z",
      "reason": "example_reason",
      "reinstated_at": "2026-01-01T00:00:00Z",
      "reinstated_by": "example_reinstated_by",
      "reinstatement_reason": "example_reinstatement_reason",
      "suspended_at": "2026-01-01T00:00:00Z",
      "suspended_by": "example_suspended_by",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_account_suspensions": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_fraud_compliance/disputes`

**Create a new dispute**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assigned_at` | string (date-time) | No | — |
| `assigned_to` | string | No | Admin assigned to resolve |
| `auto_check_result` | string | No | JSON result of automated checks |
| `auto_resolved_at` | string (date-time) | No | — |
| `claimed_amount_iqd` | integer | No | — |
| `claimed_fawz_number` | string | No | — |
| `description` | string | Yes | — |
| `dispute_number` | string | Yes | — |
| `dispute_type` | enum: ['account_suspension_dispute', 'draw_result_dispute', 'incorrect_entry_count', 'merchant_shared_entry_missing', 'missing_prize', 'prize_cap_hold_dispute', 'referral_reward_not_received', 'retroactive_seeding_error'] | Yes | — |
| `evidence_data` | string | No | JSON evidence data |
| `evidence_urls` | string | No | JSON array of evidence URLs |
| `fraud_case_id` | string | No | — |
| `related_draw_id` | string | No | — |
| `related_entry_id` | string | No | — |
| `related_entry_number` | integer | No | — |
| `related_referral_id` | string | No | — |
| `related_transaction_id` | string | No | — |
| `resolution_action` | string | No | — |
| `resolution_cash_credited_iqd` | integer | No | — |
| `resolution_entries_credited` | integer | No | — |
| `resolution_notes` | string | No | — |
| `resolution_type` | enum: ['account_reinstated', 'cash_credited', 'entries_credited', 'no_action', 'prize_released', 'rejected'] | No | — |
| `resolved_at` | string (date-time) | No | — |
| `resolved_by` | string | No | — |
| `sla_deadline_at` | string (date-time) | Yes | — |
| `status` | enum: ['auto_checking', 'auto_resolved', 'closed', 'escalated', 'pending_review', 'rejected', 'resolved', 'submitted', 'under_review'] | No | — |
| `submitted_at` | string (date-time) | Yes | — |
| `submitted_by_type` | enum: ['merchant', 'user'] | No | — |
| `submitter_type` | enum: ['consumer', 'merchant'] | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `dispute_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "assigned_at": "2026-01-01T00:00:00Z",
  "assigned_to": "example_assigned_to",
  "auto_check_result": "example_auto_check_result",
  "auto_resolved_at": "2026-01-01T00:00:00Z",
  "claimed_amount_iqd": 1,
  "claimed_fawz_number": "12345678",
  "description": "example_description",
  "dispute_number": "12345678",
  "dispute_type": "account_suspension_dispute",
  "evidence_data": "example_evidence_data",
  "evidence_urls": "example_evidence_urls",
  "fraud_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_number": 1,
  "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "resolution_action": "example_resolution_action",
  "resolution_cash_credited_iqd": 0,
  "resolution_entries_credited": 0,
  "resolution_notes": "example_resolution_notes",
  "resolution_type": "account_reinstated",
  "resolved_at": "2026-01-01T00:00:00Z",
  "resolved_by": "example_resolved_by",
  "sla_deadline_at": "2026-01-01T00:00:00Z",
  "status": "auto_checking",
  "submitted_at": "2026-01-01T00:00:00Z",
  "submitted_by_type": "merchant",
  "submitter_type": "consumer"
}
```

**Example Response**:

```json
{
  "dispute_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Dispute Created Successfully"
}
```

#### `GET /api/v0/fawz_fraud_compliance/disputes/{dispute_id}`

**Get dispute by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `dispute_id` | string (UUID) | Dispute Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `dispute_id` | string | — |
| `tenant_id` | string | — |
| `assigned_at` | string (date-time) | — |
| `assigned_to` | string | Admin assigned to resolve |
| `auto_check_result` | string | JSON result of automated checks |
| `auto_resolved_at` | string (date-time) | — |
| `claimed_amount_iqd` | integer | — |
| `claimed_fawz_number` | string | — |
| `description` | string | — |
| `dispute_number` | string | — |
| `dispute_type` | string | — |
| `evidence_data` | string | JSON evidence data |
| `evidence_urls` | string | JSON array of evidence URLs |
| `fraud_case_id` | string | — |
| `related_draw_id` | string | — |
| `related_entry_id` | string | — |
| `related_entry_number` | integer | — |
| `related_referral_id` | string | — |
| `related_transaction_id` | string | — |
| `resolution_action` | string | — |
| `resolution_cash_credited_iqd` | integer | — |
| `resolution_entries_credited` | integer | — |
| `resolution_notes` | string | — |
| `resolution_type` | string | — |
| `resolved_at` | string (date-time) | — |
| `resolved_by` | string | — |
| `sla_deadline_at` | string (date-time) | — |
| `status` | string | — |
| `submitted_at` | string (date-time) | — |
| `submitted_by_type` | string | — |
| `submitter_id` | string | Consumer or merchant who submitted |
| `submitter_type` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "dispute_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "assigned_at": "2026-01-01T00:00:00Z",
  "assigned_to": "example_assigned_to",
  "auto_check_result": "example_auto_check_result",
  "auto_resolved_at": "2026-01-01T00:00:00Z",
  "claimed_amount_iqd": 1,
  "claimed_fawz_number": "12345678",
  "description": "example_description",
  "dispute_number": "12345678",
  "dispute_type": "account_suspension_dispute",
  "evidence_data": "example_evidence_data",
  "evidence_urls": "example_evidence_urls",
  "fraud_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_number": 1,
  "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "resolution_action": "example_resolution_action",
  "resolution_cash_credited_iqd": 0,
  "resolution_entries_credited": 0,
  "resolution_notes": "example_resolution_notes",
  "resolution_type": "account_reinstated",
  "resolved_at": "2026-01-01T00:00:00Z",
  "resolved_by": "example_resolved_by",
  "sla_deadline_at": "2026-01-01T00:00:00Z",
  "status": "auto_checking",
  "submitted_at": "2026-01-01T00:00:00Z",
  "submitted_by_type": "merchant",
  "submitter_id": "550e8400-e29b-41d4-a716-446655440000",
  "submitter_type": "consumer",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_fraud_compliance/disputes`

**List disputes**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `dispute_type` | string | — | Filter parameter |
| `related_draw_id` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `submitter_id` | string | — | Filter parameter |
| `submitter_type` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `disputes_list` | array | Array of dispute objects |
| `total_disputes` | integer | Total count of disputes |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "disputes_list": [
    {
      "dispute_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "assigned_at": "2026-01-01T00:00:00Z",
      "assigned_to": "example_assigned_to",
      "auto_check_result": "example_auto_check_result",
      "auto_resolved_at": "2026-01-01T00:00:00Z",
      "claimed_amount_iqd": 1,
      "claimed_fawz_number": "12345678",
      "description": "example_description",
      "dispute_number": "12345678",
      "dispute_type": "account_suspension_dispute",
      "evidence_data": "example_evidence_data",
      "evidence_urls": "example_evidence_urls",
      "fraud_case_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_entry_number": 1,
      "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_transaction_id": "550e8400-e29b-41d4-a716-446655440000",
      "resolution_action": "example_resolution_action",
      "resolution_cash_credited_iqd": 0,
      "resolution_entries_credited": 0,
      "resolution_notes": "example_resolution_notes",
      "resolution_type": "account_reinstated",
      "resolved_at": "2026-01-01T00:00:00Z",
      "resolved_by": "example_resolved_by",
      "sla_deadline_at": "2026-01-01T00:00:00Z",
      "status": "auto_checking",
      "submitted_at": "2026-01-01T00:00:00Z",
      "submitted_by_type": "merchant",
      "submitter_id": "550e8400-e29b-41d4-a716-446655440000",
      "submitter_type": "consumer",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_disputes": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_fraud_compliance/disputes/{dispute_id}`

**Update dispute**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `dispute_id` | string (UUID) | Dispute Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assigned_at` | string (date-time) | No | — |
| `assigned_to` | string | No | Admin assigned to resolve |
| `auto_check_result` | string | No | JSON result of automated checks |
| `auto_resolved_at` | string (date-time) | No | — |
| `claimed_amount_iqd` | integer | No | — |
| `claimed_fawz_number` | string | No | — |
| `description` | string | No | — |
| `dispute_number` | string | No | — |
| `dispute_type` | enum: ['account_suspension_dispute', 'draw_result_dispute', 'incorrect_entry_count', 'merchant_shared_entry_missing', 'missing_prize', 'prize_cap_hold_dispute', 'referral_reward_not_received', 'retroactive_seeding_error'] | No | — |
| `evidence_data` | string | No | JSON evidence data |
| `evidence_urls` | string | No | JSON array of evidence URLs |
| `fraud_case_id` | string | No | — |
| `related_draw_id` | string | No | — |
| `related_entry_id` | string | No | — |
| `related_entry_number` | integer | No | — |
| `related_referral_id` | string | No | — |
| `related_transaction_id` | string | No | — |
| `resolution_action` | string | No | — |
| `resolution_cash_credited_iqd` | integer | No | — |
| `resolution_entries_credited` | integer | No | — |
| `resolution_notes` | string | No | — |
| `resolution_type` | enum: ['account_reinstated', 'cash_credited', 'entries_credited', 'no_action', 'prize_released', 'rejected'] | No | — |
| `resolved_at` | string (date-time) | No | — |
| `resolved_by` | string | No | — |
| `sla_deadline_at` | string (date-time) | No | — |
| `status` | enum: ['auto_checking', 'auto_resolved', 'closed', 'escalated', 'pending_review', 'rejected', 'resolved', 'submitted', 'under_review'] | No | — |
| `submitted_at` | string (date-time) | No | — |
| `submitted_by_type` | enum: ['merchant', 'user'] | No | — |
| `submitter_type` | enum: ['consumer', 'merchant'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "assigned_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "message": "Dispute Updated Successfully"
}
```

#### `POST /api/v0/fawz_fraud_compliance/fraud_case_communications`

**Create a new fraud case communication**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `case_id` | string | Yes | — |
| `communication_type` | enum: ['email', 'in_app_message', 'phone_call', 'push_notification', 'sms'] | Yes | — |
| `content` | string | Yes | — |
| `delivered_at` | string (date-time) | No | — |
| `direction` | enum: ['inbound', 'outbound'] | No | — |
| `read_at` | string (date-time) | No | — |
| `recipient_id` | string | No | — |
| `recipient_type` | enum: ['admin', 'consumer', 'merchant'] | Yes | — |
| `sent_at` | string (date-time) | No | — |
| `sent_by` | string | No | Admin who sent |
| `subject` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fraud_case_communication_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "case_id": "550e8400-e29b-41d4-a716-446655440000",
  "communication_type": "email",
  "content": "example_content",
  "delivered_at": "2026-01-01T00:00:00Z",
  "direction": "inbound",
  "read_at": "2026-01-01T00:00:00Z",
  "recipient_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipient_type": "admin",
  "sent_at": "2026-01-01T00:00:00Z",
  "sent_by": "example_sent_by",
  "subject": "example_subject"
}
```

**Example Response**:

```json
{
  "fraud_case_communication_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "FraudCaseCommunication Created Successfully"
}
```

#### `GET /api/v0/fawz_fraud_compliance/fraud_case_communications/{fraud_case_communication_id}`

**Get fraud case communication by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `fraud_case_communication_id` | string (UUID) | Fraud Case Communication Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fraud_case_communication_id` | string | — |
| `tenant_id` | string | — |
| `case_id` | string | — |
| `communication_type` | string | — |
| `content` | string | — |
| `delivered_at` | string (date-time) | — |
| `direction` | string | — |
| `read_at` | string (date-time) | — |
| `recipient_id` | string | — |
| `recipient_type` | string | — |
| `sent_at` | string (date-time) | — |
| `sent_by` | string | Admin who sent |
| `subject` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "fraud_case_communication_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "case_id": "550e8400-e29b-41d4-a716-446655440000",
  "communication_type": "email",
  "content": "example_content",
  "delivered_at": "2026-01-01T00:00:00Z",
  "direction": "inbound",
  "read_at": "2026-01-01T00:00:00Z",
  "recipient_id": "550e8400-e29b-41d4-a716-446655440000",
  "recipient_type": "admin",
  "sent_at": "2026-01-01T00:00:00Z",
  "sent_by": "example_sent_by",
  "subject": "example_subject",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_fraud_compliance/fraud_case_communications`

**List fraud case communications**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `case_id` | string | — | Filter parameter |
| `communication_type` | string | — | Filter parameter |
| `direction` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fraud_case_communications_list` | array | Array of fraud_case_communication objects |
| `total_fraud_case_communications` | integer | Total count of fraud_case_communications |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "fraud_case_communications_list": [
    {
      "fraud_case_communication_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "case_id": "550e8400-e29b-41d4-a716-446655440000",
      "communication_type": "email",
      "content": "example_content",
      "delivered_at": "2026-01-01T00:00:00Z",
      "direction": "inbound",
      "read_at": "2026-01-01T00:00:00Z",
      "recipient_id": "550e8400-e29b-41d4-a716-446655440000",
      "recipient_type": "admin",
      "sent_at": "2026-01-01T00:00:00Z",
      "sent_by": "example_sent_by",
      "subject": "example_subject",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_fraud_case_communications": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_fraud_compliance/fraud_review_cases`

**Create a new fraud review case**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assigned_at` | string (date-time) | No | — |
| `assigned_to` | string | No | Admin reviewer assigned |
| `auto_check_results` | string | No | JSON auto-check results |
| `auto_resolved` | boolean | No | — |
| `auto_resolved_at` | string (date-time) | No | — |
| `case_number` | string | Yes | — |
| `closed_at` | string (date-time) | No | — |
| `communication_sent` | boolean | No | — |
| `communication_sent_at` | string (date-time) | No | — |
| `context_data` | string | No | JSON context for investigation |
| `decided_by` | string | No | — |
| `decision` | enum: ['approve', 'escalate', 'reject'] | No | — |
| `decision_at` | string (date-time) | No | — |
| `decision_by` | string | No | — |
| `escalated_at` | string (date-time) | No | — |
| `escalated_to` | string | No | — |
| `escalation_reason` | string | No | — |
| `flag_details` | string | No | JSON details of the flag trigger |
| `flag_type` | enum: ['device_fingerprint_match', 'dispute_account_suspension', 'dispute_draw_result', 'dispute_incorrect_entry_count', 'dispute_merchant_entry', 'dispute_merchant_shared_entry', 'dispute_missing_prize', 'dispute_prize_cap_hold', 'dispute_referral_reward', 'dispute_retroactive_seeding', 'duplicate_account_suspected', 'duplicate_device_fingerprint', 'entry_velocity_anomaly', 'high_value_winner', 'merchant_self_dealing', 'prize_cap_exceeded', 'referral_volume_excess'] | No | — |
| `flagged_at` | string (date-time) | Yes | — |
| `flagged_merchant_id` | string | No | — |
| `flagged_user_id` | string | No | — |
| `priority` | integer | No | — |
| `reasoning_notes` | string | No | Min 50 chars required for decisions |
| `related_draw_id` | string | No | — |
| `related_entry_id` | string | No | — |
| `related_merchant_id` | string | No | — |
| `related_payout_id` | string | No | — |
| `related_referral_id` | string | No | — |
| `related_user_id` | string | No | — |
| `resolution_action` | string | No | — |
| `resolution_cash_credited_iqd` | integer | No | — |
| `resolution_entries_credited` | integer | No | — |
| `severity` | enum: ['critical', 'high', 'low', 'medium'] | No | — |
| `sla_breached_at` | string (date-time) | No | — |
| `sla_deadline_at` | string (date-time) | Yes | — |
| `status` | enum: ['approved', 'assigned', 'closed', 'escalated', 'flagged', 'open', 'rejected', 'sla_breached', 'under_review'] | No | — |
| `subject_id` | string | Yes | — |
| `subject_type` | enum: ['consumer', 'draw_winner', 'merchant', 'referral', 'transaction'] | Yes | — |
| `under_review_at` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fraud_review_case_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "assigned_at": "2026-01-01T00:00:00Z",
  "assigned_to": "example_assigned_to",
  "auto_check_results": "example_auto_check_results",
  "auto_resolved": false,
  "auto_resolved_at": "2026-01-01T00:00:00Z",
  "case_number": "12345678",
  "closed_at": "2026-01-01T00:00:00Z",
  "communication_sent": false,
  "communication_sent_at": "2026-01-01T00:00:00Z",
  "context_data": "example_context_data",
  "decided_by": "example_decided_by",
  "decision": "approve",
  "decision_at": "2026-01-01T00:00:00Z",
  "decision_by": "example_decision_by",
  "escalated_at": "2026-01-01T00:00:00Z",
  "escalated_to": "example_escalated_to",
  "escalation_reason": "example_escalation_reason",
  "flag_details": "example_flag_details",
  "flag_type": "device_fingerprint_match",
  "flagged_at": "2026-01-01T00:00:00Z",
  "flagged_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "flagged_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "priority": 5,
  "reasoning_notes": "example_reasoning_notes",
  "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_payout_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "resolution_action": "example_resolution_action",
  "resolution_cash_credited_iqd": 0,
  "resolution_entries_credited": 0,
  "severity": "critical",
  "sla_breached_at": "2026-01-01T00:00:00Z",
  "sla_deadline_at": "2026-01-01T00:00:00Z",
  "status": "approved",
  "subject_id": "550e8400-e29b-41d4-a716-446655440000",
  "subject_type": "consumer",
  "under_review_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "fraud_review_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "FraudReviewCase Created Successfully"
}
```

#### `GET /api/v0/fawz_fraud_compliance/fraud_review_cases/{fraud_review_case_id}`

**Get fraud review case by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `fraud_review_case_id` | string (UUID) | Fraud Review Case Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fraud_review_case_id` | string | — |
| `tenant_id` | string | — |
| `assigned_at` | string (date-time) | — |
| `assigned_to` | string | Admin reviewer assigned |
| `auto_check_results` | string | JSON auto-check results |
| `auto_resolved` | boolean | — |
| `auto_resolved_at` | string (date-time) | — |
| `case_number` | string | — |
| `closed_at` | string (date-time) | — |
| `communication_sent` | boolean | — |
| `communication_sent_at` | string (date-time) | — |
| `context_data` | string | JSON context for investigation |
| `decided_by` | string | — |
| `decision` | string | — |
| `decision_at` | string (date-time) | — |
| `decision_by` | string | — |
| `escalated_at` | string (date-time) | — |
| `escalated_to` | string | — |
| `escalation_reason` | string | — |
| `flag_details` | string | JSON details of the flag trigger |
| `flag_type` | string | — |
| `flagged_at` | string (date-time) | — |
| `flagged_merchant_id` | string | — |
| `flagged_user_id` | string | — |
| `priority` | integer | — |
| `reasoning_notes` | string | Min 50 chars required for decisions |
| `related_draw_id` | string | — |
| `related_entry_id` | string | — |
| `related_merchant_id` | string | — |
| `related_payout_id` | string | — |
| `related_referral_id` | string | — |
| `related_user_id` | string | — |
| `resolution_action` | string | — |
| `resolution_cash_credited_iqd` | integer | — |
| `resolution_entries_credited` | integer | — |
| `severity` | string | — |
| `sla_breached_at` | string (date-time) | — |
| `sla_deadline_at` | string (date-time) | — |
| `status` | string | — |
| `subject_id` | string | — |
| `subject_type` | string | — |
| `under_review_at` | string (date-time) | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "fraud_review_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "assigned_at": "2026-01-01T00:00:00Z",
  "assigned_to": "example_assigned_to",
  "auto_check_results": "example_auto_check_results",
  "auto_resolved": false,
  "auto_resolved_at": "2026-01-01T00:00:00Z",
  "case_number": "12345678",
  "closed_at": "2026-01-01T00:00:00Z",
  "communication_sent": false,
  "communication_sent_at": "2026-01-01T00:00:00Z",
  "context_data": "example_context_data",
  "decided_by": "example_decided_by",
  "decision": "approve",
  "decision_at": "2026-01-01T00:00:00Z",
  "decision_by": "example_decision_by",
  "escalated_at": "2026-01-01T00:00:00Z",
  "escalated_to": "example_escalated_to",
  "escalation_reason": "example_escalation_reason",
  "flag_details": "example_flag_details",
  "flag_type": "device_fingerprint_match",
  "flagged_at": "2026-01-01T00:00:00Z",
  "flagged_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "flagged_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "priority": 5,
  "reasoning_notes": "example_reasoning_notes",
  "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_payout_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "related_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "resolution_action": "example_resolution_action",
  "resolution_cash_credited_iqd": 0,
  "resolution_entries_credited": 0,
  "severity": "critical",
  "sla_breached_at": "2026-01-01T00:00:00Z",
  "sla_deadline_at": "2026-01-01T00:00:00Z",
  "status": "approved",
  "subject_id": "550e8400-e29b-41d4-a716-446655440000",
  "subject_type": "consumer",
  "under_review_at": "2026-01-01T00:00:00Z",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_fraud_compliance/fraud_review_cases`

**List fraud review cases**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `assigned_to` | string | — | Filter parameter |
| `flag_type` | string | — | Filter parameter |
| `flagged_merchant_id` | string | — | Filter parameter |
| `flagged_user_id` | string | — | Filter parameter |
| `priority` | string | — | Filter parameter |
| `severity` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `subject_type` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `fraud_review_cases_list` | array | Array of fraud_review_case objects |
| `total_fraud_review_cases` | integer | Total count of fraud_review_cases |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "fraud_review_cases_list": [
    {
      "fraud_review_case_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "assigned_at": "2026-01-01T00:00:00Z",
      "assigned_to": "example_assigned_to",
      "auto_check_results": "example_auto_check_results",
      "auto_resolved": false,
      "auto_resolved_at": "2026-01-01T00:00:00Z",
      "case_number": "12345678",
      "closed_at": "2026-01-01T00:00:00Z",
      "communication_sent": false,
      "communication_sent_at": "2026-01-01T00:00:00Z",
      "context_data": "example_context_data",
      "decided_by": "example_decided_by",
      "decision": "approve",
      "decision_at": "2026-01-01T00:00:00Z",
      "decision_by": "example_decision_by",
      "escalated_at": "2026-01-01T00:00:00Z",
      "escalated_to": "example_escalated_to",
      "escalation_reason": "example_escalation_reason",
      "flag_details": "example_flag_details",
      "flag_type": "device_fingerprint_match",
      "flagged_at": "2026-01-01T00:00:00Z",
      "flagged_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "flagged_user_id": "550e8400-e29b-41d4-a716-446655440000",
      "priority": 5,
      "reasoning_notes": "example_reasoning_notes",
      "related_draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_entry_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_payout_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "related_user_id": "550e8400-e29b-41d4-a716-446655440000",
      "resolution_action": "example_resolution_action",
      "resolution_cash_credited_iqd": 0,
      "resolution_entries_credited": 0,
      "severity": "critical",
      "sla_breached_at": "2026-01-01T00:00:00Z",
      "sla_deadline_at": "2026-01-01T00:00:00Z",
      "status": "approved",
      "subject_id": "550e8400-e29b-41d4-a716-446655440000",
      "subject_type": "consumer",
      "under_review_at": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_fraud_review_cases": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_fraud_compliance/fraud_review_cases/{fraud_review_case_id}`

**Update fraud review case**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `fraud_review_case_id` | string (UUID) | Fraud Review Case Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assigned_at` | string (date-time) | No | — |
| `assigned_to` | string | No | Admin reviewer assigned |
| `auto_check_results` | string | No | JSON auto-check results |
| `auto_resolved` | boolean | No | — |
| `auto_resolved_at` | string (date-time) | No | — |
| `case_number` | string | No | — |
| `closed_at` | string (date-time) | No | — |
| `communication_sent` | boolean | No | — |
| `communication_sent_at` | string (date-time) | No | — |
| `context_data` | string | No | JSON context for investigation |
| `decided_by` | string | No | — |
| `decision` | enum: ['approve', 'escalate', 'reject'] | No | — |
| `decision_at` | string (date-time) | No | — |
| `decision_by` | string | No | — |
| `escalated_at` | string (date-time) | No | — |
| `escalated_to` | string | No | — |
| `escalation_reason` | string | No | — |
| `flag_details` | string | No | JSON details of the flag trigger |
| `flag_type` | enum: ['device_fingerprint_match', 'dispute_account_suspension', 'dispute_draw_result', 'dispute_incorrect_entry_count', 'dispute_merchant_entry', 'dispute_merchant_shared_entry', 'dispute_missing_prize', 'dispute_prize_cap_hold', 'dispute_referral_reward', 'dispute_retroactive_seeding', 'duplicate_account_suspected', 'duplicate_device_fingerprint', 'entry_velocity_anomaly', 'high_value_winner', 'merchant_self_dealing', 'prize_cap_exceeded', 'referral_volume_excess'] | No | — |
| `flagged_at` | string (date-time) | No | — |
| `flagged_merchant_id` | string | No | — |
| `flagged_user_id` | string | No | — |
| `priority` | integer | No | — |
| `reasoning_notes` | string | No | Min 50 chars required for decisions |
| `related_draw_id` | string | No | — |
| `related_entry_id` | string | No | — |
| `related_merchant_id` | string | No | — |
| `related_payout_id` | string | No | — |
| `related_referral_id` | string | No | — |
| `related_user_id` | string | No | — |
| `resolution_action` | string | No | — |
| `resolution_cash_credited_iqd` | integer | No | — |
| `resolution_entries_credited` | integer | No | — |
| `severity` | enum: ['critical', 'high', 'low', 'medium'] | No | — |
| `sla_breached_at` | string (date-time) | No | — |
| `sla_deadline_at` | string (date-time) | No | — |
| `status` | enum: ['approved', 'assigned', 'closed', 'escalated', 'flagged', 'open', 'rejected', 'sla_breached', 'under_review'] | No | — |
| `subject_id` | string | No | — |
| `subject_type` | enum: ['consumer', 'draw_winner', 'merchant', 'referral', 'transaction'] | No | — |
| `under_review_at` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "assigned_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "message": "FraudReviewCase Updated Successfully"
}
```

---

## backend-fawz-merchant-management

**Base URL**: `/api/v0/fawz_merchant_management`
**Port**: `8007`
**Description**: Manages merchant Fawz eligibility and shared entry participation. Contains merchant (SuperQi merchant Fawz extension with eligibility state, volume tracking, certification status) and merchant_eligibility_cache (nightly batch calculation results). Merchants with rolling 30-day volume < 50M IQD and >= 10 unique customer transactions qualify for shared entries. Eligibility is prospective only - no retroactive clawback. References consumer transactions via string IDs

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_merchant_management/merchants` | create | merchant | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_merchant_management/merchants/{merchant_id}` | read | merchant | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_merchant_management/merchants` | list | merchant | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_merchant_management/merchants/{merchant_id}` | update | merchant | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_merchant_management/merchant_eligibility_caches` | create | merchant_eligibility_cache | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_merchant_management/merchant_eligibility_caches/{merchant_eligibility_cache_id}` | read | merchant_eligibility_cache | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_merchant_management/merchant_eligibility_caches` | list | merchant_eligibility_cache | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_merchant_management/merchant_eligibility_caches/{merchant_eligibility_cache_id}` | update | merchant_eligibility_cache | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_merchant_management/merchants`

**Create a new merchant**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_status` | enum: ['active', 'archived', 'created', 'eligible', 'fawz_certified', 'ineligible', 'suspended'] | No | — |
| `address` | string | No | — |
| `city` | string | No | — |
| `current_multiplier` | number | No | — |
| `deleted_at` | string (date-time) | No | — |
| `device_fingerprint_hash` | string | No | — |
| `eligibility_last_checked_at` | string (date-time) | No | — |
| `fawz_certified_date` | string (date) | No | — |
| `governorate` | string | No | — |
| `is_eligible_for_shared_entries` | boolean | No | — |
| `is_fawz_certified` | boolean | No | — |
| `merchant_category_code` | string | No | — |
| `merchant_name` | string | Yes | — |
| `merchant_name_ar` | string | No | — |
| `monthly_receiving_volume_iqd` | integer | No | — |
| `phone_hash` | string | No | — |
| `rolling_30_day_volume_iqd` | integer | No | — |
| `suspended_at` | string (date-time) | No | — |
| `suspension_reason` | string | No | — |
| `total_prizes_won_iqd` | integer | No | — |
| `total_shared_entries_earned` | integer | No | — |
| `unique_customer_tx_month` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `merchant_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "account_status": "active",
  "address": "example_address",
  "city": "example_city",
  "current_multiplier": 1.0,
  "deleted_at": "2026-01-01T00:00:00Z",
  "device_fingerprint_hash": "example_device_fingerprint_hash",
  "eligibility_last_checked_at": "2026-01-01T00:00:00Z",
  "fawz_certified_date": "2026-01-01",
  "governorate": "example_governorate",
  "is_eligible_for_shared_entries": false,
  "is_fawz_certified": false,
  "merchant_category_code": "EXAMPLE_CODE",
  "merchant_name": "example_merchant_name",
  "merchant_name_ar": "example_merchant_name_ar",
  "monthly_receiving_volume_iqd": 0,
  "phone_hash": "example_phone_hash",
  "rolling_30_day_volume_iqd": 0,
  "suspended_at": "2026-01-01T00:00:00Z",
  "suspension_reason": "example_suspension_reason",
  "total_prizes_won_iqd": 0,
  "total_shared_entries_earned": 0,
  "unique_customer_tx_month": 0
}
```

**Example Response**:

```json
{
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Merchant Created Successfully"
}
```

#### `GET /api/v0/fawz_merchant_management/merchants/{merchant_id}`

**Get merchant by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `merchant_id` | string (UUID) | Merchant Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `merchant_id` | string | — |
| `tenant_id` | string | — |
| `account_status` | string | — |
| `address` | string | — |
| `city` | string | — |
| `current_multiplier` | number | — |
| `deleted_at` | string (date-time) | — |
| `device_fingerprint_hash` | string | — |
| `eligibility_last_checked_at` | string (date-time) | — |
| `fawz_certified_date` | string (date) | — |
| `governorate` | string | — |
| `is_eligible_for_shared_entries` | boolean | — |
| `is_fawz_certified` | boolean | — |
| `merchant_category_code` | string | — |
| `merchant_name` | string | — |
| `merchant_name_ar` | string | — |
| `monthly_receiving_volume_iqd` | integer | — |
| `phone_hash` | string | — |
| `rolling_30_day_volume_iqd` | integer | — |
| `superqi_merchant_id` | string | External SuperQi merchant ID |
| `suspended_at` | string (date-time) | — |
| `suspension_reason` | string | — |
| `total_prizes_won_iqd` | integer | — |
| `total_shared_entries_earned` | integer | — |
| `unique_customer_tx_month` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "account_status": "active",
  "address": "example_address",
  "city": "example_city",
  "current_multiplier": 1.0,
  "deleted_at": "2026-01-01T00:00:00Z",
  "device_fingerprint_hash": "example_device_fingerprint_hash",
  "eligibility_last_checked_at": "2026-01-01T00:00:00Z",
  "fawz_certified_date": "2026-01-01",
  "governorate": "example_governorate",
  "is_eligible_for_shared_entries": false,
  "is_fawz_certified": false,
  "merchant_category_code": "EXAMPLE_CODE",
  "merchant_name": "example_merchant_name",
  "merchant_name_ar": "example_merchant_name_ar",
  "monthly_receiving_volume_iqd": 0,
  "phone_hash": "example_phone_hash",
  "rolling_30_day_volume_iqd": 0,
  "superqi_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "suspended_at": "2026-01-01T00:00:00Z",
  "suspension_reason": "example_suspension_reason",
  "total_prizes_won_iqd": 0,
  "total_shared_entries_earned": 0,
  "unique_customer_tx_month": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_merchant_management/merchants`

**List merchants**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `account_status` | string | — | Filter parameter |
| `city` | string | — | Filter parameter |
| `governorate` | string | — | Filter parameter |
| `is_eligible_for_shared_entries` | string | — | Filter parameter |
| `is_fawz_certified` | string | — | Filter parameter |
| `merchant_category_code` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `merchants_list` | array | Array of merchant objects |
| `total_merchants` | integer | Total count of merchants |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "merchants_list": [
    {
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "account_status": "active",
      "address": "example_address",
      "city": "example_city",
      "current_multiplier": 1.0,
      "deleted_at": "2026-01-01T00:00:00Z",
      "device_fingerprint_hash": "example_device_fingerprint_hash",
      "eligibility_last_checked_at": "2026-01-01T00:00:00Z",
      "fawz_certified_date": "2026-01-01",
      "governorate": "example_governorate",
      "is_eligible_for_shared_entries": false,
      "is_fawz_certified": false,
      "merchant_category_code": "EXAMPLE_CODE",
      "merchant_name": "example_merchant_name",
      "merchant_name_ar": "example_merchant_name_ar",
      "monthly_receiving_volume_iqd": 0,
      "phone_hash": "example_phone_hash",
      "rolling_30_day_volume_iqd": 0,
      "superqi_merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "suspended_at": "2026-01-01T00:00:00Z",
      "suspension_reason": "example_suspension_reason",
      "total_prizes_won_iqd": 0,
      "total_shared_entries_earned": 0,
      "unique_customer_tx_month": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_merchants": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_merchant_management/merchants/{merchant_id}`

**Update merchant**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `merchant_id` | string (UUID) | Merchant Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `account_status` | enum: ['active', 'archived', 'created', 'eligible', 'fawz_certified', 'ineligible', 'suspended'] | No | — |
| `address` | string | No | — |
| `city` | string | No | — |
| `current_multiplier` | number | No | — |
| `deleted_at` | string (date-time) | No | — |
| `device_fingerprint_hash` | string | No | — |
| `eligibility_last_checked_at` | string (date-time) | No | — |
| `fawz_certified_date` | string (date) | No | — |
| `governorate` | string | No | — |
| `is_eligible_for_shared_entries` | boolean | No | — |
| `is_fawz_certified` | boolean | No | — |
| `merchant_category_code` | string | No | — |
| `merchant_name` | string | No | — |
| `merchant_name_ar` | string | No | — |
| `monthly_receiving_volume_iqd` | integer | No | — |
| `phone_hash` | string | No | — |
| `rolling_30_day_volume_iqd` | integer | No | — |
| `suspended_at` | string (date-time) | No | — |
| `suspension_reason` | string | No | — |
| `total_prizes_won_iqd` | integer | No | — |
| `total_shared_entries_earned` | integer | No | — |
| `unique_customer_tx_month` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "account_status": "active"
}
```

**Example Response**:

```json
{
  "message": "Merchant Updated Successfully"
}
```

#### `POST /api/v0/fawz_merchant_management/merchant_eligibility_caches`

**Create a new merchant eligibility cache**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `calculated_at` | string (date-time) | Yes | — |
| `eligibility_reason` | string | No | — |
| `is_eligible` | boolean | No | — |
| `merchant_id` | string | Yes | — |
| `rolling_30_day_volume_iqd` | integer | No | — |
| `unique_customer_tx_count` | integer | No | — |
| `valid_until` | string (date-time) | Yes | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `merchant_eligibility_cache_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "calculated_at": "2026-01-01T00:00:00Z",
  "eligibility_reason": "example_eligibility_reason",
  "is_eligible": false,
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "rolling_30_day_volume_iqd": 0,
  "unique_customer_tx_count": 0,
  "valid_until": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "merchant_eligibility_cache_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "MerchantEligibilityCache Created Successfully"
}
```

#### `GET /api/v0/fawz_merchant_management/merchant_eligibility_caches/{merchant_eligibility_cache_id}`

**Get merchant eligibility cache by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `merchant_eligibility_cache_id` | string (UUID) | Merchant Eligibility Cache Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `merchant_eligibility_cache_id` | string | — |
| `tenant_id` | string | — |
| `calculated_at` | string (date-time) | — |
| `eligibility_reason` | string | — |
| `is_eligible` | boolean | — |
| `merchant_id` | string | — |
| `rolling_30_day_volume_iqd` | integer | — |
| `unique_customer_tx_count` | integer | — |
| `valid_until` | string (date-time) | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "merchant_eligibility_cache_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "calculated_at": "2026-01-01T00:00:00Z",
  "eligibility_reason": "example_eligibility_reason",
  "is_eligible": false,
  "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
  "rolling_30_day_volume_iqd": 0,
  "unique_customer_tx_count": 0,
  "valid_until": "2026-01-01T00:00:00Z",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_merchant_management/merchant_eligibility_caches`

**List merchant eligibility caches**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `is_eligible` | string | — | Filter parameter |
| `merchant_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `merchant_eligibility_caches_list` | array | Array of merchant_eligibility_cache objects |
| `total_merchant_eligibility_caches` | integer | Total count of merchant_eligibility_caches |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "merchant_eligibility_caches_list": [
    {
      "merchant_eligibility_cache_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "calculated_at": "2026-01-01T00:00:00Z",
      "eligibility_reason": "example_eligibility_reason",
      "is_eligible": false,
      "merchant_id": "550e8400-e29b-41d4-a716-446655440000",
      "rolling_30_day_volume_iqd": 0,
      "unique_customer_tx_count": 0,
      "valid_until": "2026-01-01T00:00:00Z",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_merchant_eligibility_caches": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_merchant_management/merchant_eligibility_caches/{merchant_eligibility_cache_id}`

**Update merchant eligibility cache**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `merchant_eligibility_cache_id` | string (UUID) | Merchant Eligibility Cache Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `calculated_at` | string (date-time) | No | — |
| `eligibility_reason` | string | No | — |
| `is_eligible` | boolean | No | — |
| `merchant_id` | string | No | — |
| `rolling_30_day_volume_iqd` | integer | No | — |
| `unique_customer_tx_count` | integer | No | — |
| `valid_until` | string (date-time) | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "calculated_at": "2026-01-01T00:00:00Z"
}
```

**Example Response**:

```json
{
  "message": "MerchantEligibilityCache Updated Successfully"
}
```

---

## backend-fawz-platform-management

**Base URL**: `/api/v0/fawz_platform_management`
**Port**: `8008`
**Description**: Infrastructure entities for multi-tenancy, scheduled job management, daily analytics snapshots, and tenant configuration. Contains tenant (multi-tenant isolation with country/currency/timezone), scheduled_job (cron-based job registry for nightly batches, streak resets, archival), job_execution_log (run-level execution tracking), and analytics_daily_snapshot (daily aggregated KPI metrics). Tenant_id='fawz-iq-001' for Phase 1 single-tenant deployment

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_platform_management/analytics_daily_snapshots` | create | analytics_daily_snapshot | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/analytics_daily_snapshots/{analytics_daily_snapshot_id}` | read | analytics_daily_snapshot | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/analytics_daily_snapshots` | list | analytics_daily_snapshot | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_platform_management/job_execution_logs` | create | job_execution_log | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/job_execution_logs/{job_execution_log_id}` | read | job_execution_log | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/job_execution_logs` | list | job_execution_log | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_platform_management/scheduled_jobs` | create | scheduled_job | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/scheduled_jobs/{scheduled_job_id}` | read | scheduled_job | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/scheduled_jobs` | list | scheduled_job | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_platform_management/scheduled_jobs/{scheduled_job_id}` | update | scheduled_job | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_platform_management/tenants` | create | tenant | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/tenants/{tenant_id}` | read | tenant | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_platform_management/tenants` | list | tenant | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_platform_management/tenants/{tenant_id}` | update | tenant | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_platform_management/analytics_daily_snapshots`

**Create a new analytics daily snapshot**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `active_consumers` | integer | No | — |
| `active_merchants` | integer | No | — |
| `bonus_entries` | integer | No | — |
| `challenge_entries` | integer | No | — |
| `challenges_completed` | integer | No | — |
| `channel_breakdown` | string | No | JSON breakdown by payment channel |
| `disputes_resolved` | integer | No | — |
| `disputes_submitted` | integer | No | — |
| `fraud_cases_opened` | integer | No | — |
| `fraud_cases_resolved` | integer | No | — |
| `governorate_breakdown` | string | No | JSON breakdown by governorate |
| `new_consumers` | integer | No | — |
| `new_merchants` | integer | No | — |
| `referral_entries` | integer | No | — |
| `referrals_completed` | integer | No | — |
| `referrals_initiated` | integer | No | — |
| `snapshot_date` | string (date) | Yes | — |
| `total_entries_generated` | integer | No | — |
| `total_prize_payouts_iqd` | integer | No | — |
| `total_qualifying_transactions` | integer | No | — |
| `total_transaction_volume_iqd` | integer | No | — |
| `transaction_entries` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `analytics_daily_snapshot_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "active_consumers": 0,
  "active_merchants": 0,
  "bonus_entries": 0,
  "challenge_entries": 0,
  "challenges_completed": 0,
  "channel_breakdown": "example_channel_breakdown",
  "disputes_resolved": 0,
  "disputes_submitted": 0,
  "fraud_cases_opened": 0,
  "fraud_cases_resolved": 0,
  "governorate_breakdown": "example_governorate_breakdown",
  "new_consumers": 0,
  "new_merchants": 0,
  "referral_entries": 0,
  "referrals_completed": 0,
  "referrals_initiated": 0,
  "snapshot_date": "2026-01-01",
  "total_entries_generated": 0,
  "total_prize_payouts_iqd": 0,
  "total_qualifying_transactions": 0,
  "total_transaction_volume_iqd": 0,
  "transaction_entries": 0
}
```

**Example Response**:

```json
{
  "analytics_daily_snapshot_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "AnalyticsDailySnapshot Created Successfully"
}
```

#### `GET /api/v0/fawz_platform_management/analytics_daily_snapshots/{analytics_daily_snapshot_id}`

**Get analytics daily snapshot by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `analytics_daily_snapshot_id` | string (UUID) | Analytics Daily Snapshot Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `analytics_daily_snapshot_id` | string | — |
| `tenant_id` | string | — |
| `active_consumers` | integer | — |
| `active_merchants` | integer | — |
| `bonus_entries` | integer | — |
| `challenge_entries` | integer | — |
| `challenges_completed` | integer | — |
| `channel_breakdown` | string | JSON breakdown by payment channel |
| `disputes_resolved` | integer | — |
| `disputes_submitted` | integer | — |
| `fraud_cases_opened` | integer | — |
| `fraud_cases_resolved` | integer | — |
| `governorate_breakdown` | string | JSON breakdown by governorate |
| `new_consumers` | integer | — |
| `new_merchants` | integer | — |
| `referral_entries` | integer | — |
| `referrals_completed` | integer | — |
| `referrals_initiated` | integer | — |
| `snapshot_date` | string (date) | — |
| `total_entries_generated` | integer | — |
| `total_prize_payouts_iqd` | integer | — |
| `total_qualifying_transactions` | integer | — |
| `total_transaction_volume_iqd` | integer | — |
| `transaction_entries` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "analytics_daily_snapshot_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "active_consumers": 0,
  "active_merchants": 0,
  "bonus_entries": 0,
  "challenge_entries": 0,
  "challenges_completed": 0,
  "channel_breakdown": "example_channel_breakdown",
  "disputes_resolved": 0,
  "disputes_submitted": 0,
  "fraud_cases_opened": 0,
  "fraud_cases_resolved": 0,
  "governorate_breakdown": "example_governorate_breakdown",
  "new_consumers": 0,
  "new_merchants": 0,
  "referral_entries": 0,
  "referrals_completed": 0,
  "referrals_initiated": 0,
  "snapshot_date": "2026-01-01",
  "total_entries_generated": 0,
  "total_prize_payouts_iqd": 0,
  "total_qualifying_transactions": 0,
  "total_transaction_volume_iqd": 0,
  "transaction_entries": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_platform_management/analytics_daily_snapshots`

**List analytics daily snapshots**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `snapshot_date` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `analytics_daily_snapshots_list` | array | Array of analytics_daily_snapshot objects |
| `total_analytics_daily_snapshots` | integer | Total count of analytics_daily_snapshots |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "analytics_daily_snapshots_list": [
    {
      "analytics_daily_snapshot_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "active_consumers": 0,
      "active_merchants": 0,
      "bonus_entries": 0,
      "challenge_entries": 0,
      "challenges_completed": 0,
      "channel_breakdown": "example_channel_breakdown",
      "disputes_resolved": 0,
      "disputes_submitted": 0,
      "fraud_cases_opened": 0,
      "fraud_cases_resolved": 0,
      "governorate_breakdown": "example_governorate_breakdown",
      "new_consumers": 0,
      "new_merchants": 0,
      "referral_entries": 0,
      "referrals_completed": 0,
      "referrals_initiated": 0,
      "snapshot_date": "2026-01-01",
      "total_entries_generated": 0,
      "total_prize_payouts_iqd": 0,
      "total_qualifying_transactions": 0,
      "total_transaction_volume_iqd": 0,
      "transaction_entries": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_analytics_daily_snapshots": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_platform_management/job_execution_logs`

**Create a new job execution log**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `completed_at` | string (date-time) | No | — |
| `error_details` | string | No | JSON error details |
| `error_message` | string | No | — |
| `execution_context` | string | No | JSON execution context |
| `job_id` | string | Yes | — |
| `job_name` | string | Yes | — |
| `records_failed` | integer | No | — |
| `records_processed` | integer | No | — |
| `records_succeeded` | integer | No | — |
| `started_at` | string (date-time) | Yes | — |
| `status` | enum: ['failed', 'partial', 'running', 'success'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `job_execution_log_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "completed_at": "2026-01-01T00:00:00Z",
  "error_details": "example_error_details",
  "error_message": "example_error_message",
  "execution_context": "example_execution_context",
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "job_name": "example_job_name",
  "records_failed": 0,
  "records_processed": 0,
  "records_succeeded": 0,
  "started_at": "2026-01-01T00:00:00Z",
  "status": "failed"
}
```

**Example Response**:

```json
{
  "job_execution_log_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "JobExecutionLog Created Successfully"
}
```

#### `GET /api/v0/fawz_platform_management/job_execution_logs/{job_execution_log_id}`

**Get job execution log by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `job_execution_log_id` | string (UUID) | Job Execution Log Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `job_execution_log_id` | string | — |
| `tenant_id` | string | — |
| `completed_at` | string (date-time) | — |
| `error_details` | string | JSON error details |
| `error_message` | string | — |
| `execution_context` | string | JSON execution context |
| `job_id` | string | — |
| `job_name` | string | — |
| `records_failed` | integer | — |
| `records_processed` | integer | — |
| `records_succeeded` | integer | — |
| `started_at` | string (date-time) | — |
| `status` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "job_execution_log_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "completed_at": "2026-01-01T00:00:00Z",
  "error_details": "example_error_details",
  "error_message": "example_error_message",
  "execution_context": "example_execution_context",
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "job_name": "example_job_name",
  "records_failed": 0,
  "records_processed": 0,
  "records_succeeded": 0,
  "started_at": "2026-01-01T00:00:00Z",
  "status": "failed",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_platform_management/job_execution_logs`

**List job execution logs**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `job_id` | string | — | Filter parameter |
| `job_name` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `job_execution_logs_list` | array | Array of job_execution_log objects |
| `total_job_execution_logs` | integer | Total count of job_execution_logs |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "job_execution_logs_list": [
    {
      "job_execution_log_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "completed_at": "2026-01-01T00:00:00Z",
      "error_details": "example_error_details",
      "error_message": "example_error_message",
      "execution_context": "example_execution_context",
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "job_name": "example_job_name",
      "records_failed": 0,
      "records_processed": 0,
      "records_succeeded": 0,
      "started_at": "2026-01-01T00:00:00Z",
      "status": "failed",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_job_execution_logs": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_platform_management/scheduled_jobs`

**Create a new scheduled job**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `failure_count` | integer | No | — |
| `is_enabled` | boolean | No | — |
| `job_name` | string | Yes | — |
| `job_type` | enum: ['community_challenge_reward', 'day_boundary_check', 'draw_pre_scaling', 'entry_archival', 'fawz_certified_multiplier_decay', 'jackpot_rollover', 'merchant_eligibility_refresh', 'monthly_streak_reset', 'notification_cleanup', 'retroactive_expiry', 'retroactive_seeding', 'weekly_streak_reset', 'winner_export'] | Yes | — |
| `last_error_message` | string | No | — |
| `last_run_at` | string (date-time) | No | — |
| `last_run_duration_ms` | integer | No | — |
| `last_run_status` | enum: ['failed', 'partial', 'success'] | No | — |
| `next_run_at` | string (date-time) | No | — |
| `run_count` | integer | No | — |
| `schedule_cron` | string | No | — |
| `timezone` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `scheduled_job_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "failure_count": 0,
  "is_enabled": true,
  "job_name": "example_job_name",
  "job_type": "community_challenge_reward",
  "last_error_message": "example_last_error_message",
  "last_run_at": "2026-01-01T00:00:00Z",
  "last_run_duration_ms": 1,
  "last_run_status": "failed",
  "next_run_at": "2026-01-01T00:00:00Z",
  "run_count": 0,
  "schedule_cron": "example_schedule_cron",
  "timezone": "Asia/Baghdad"
}
```

**Example Response**:

```json
{
  "scheduled_job_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "ScheduledJob Created Successfully"
}
```

#### `GET /api/v0/fawz_platform_management/scheduled_jobs/{scheduled_job_id}`

**Get scheduled job by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `scheduled_job_id` | string (UUID) | Scheduled Job Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `scheduled_job_id` | string | — |
| `tenant_id` | string | — |
| `failure_count` | integer | — |
| `is_enabled` | boolean | — |
| `job_name` | string | — |
| `job_type` | string | — |
| `last_error_message` | string | — |
| `last_run_at` | string (date-time) | — |
| `last_run_duration_ms` | integer | — |
| `last_run_status` | string | — |
| `next_run_at` | string (date-time) | — |
| `run_count` | integer | — |
| `schedule_cron` | string | — |
| `timezone` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "scheduled_job_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "failure_count": 0,
  "is_enabled": true,
  "job_name": "example_job_name",
  "job_type": "community_challenge_reward",
  "last_error_message": "example_last_error_message",
  "last_run_at": "2026-01-01T00:00:00Z",
  "last_run_duration_ms": 1,
  "last_run_status": "failed",
  "next_run_at": "2026-01-01T00:00:00Z",
  "run_count": 0,
  "schedule_cron": "example_schedule_cron",
  "timezone": "Asia/Baghdad",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_platform_management/scheduled_jobs`

**List scheduled jobs**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `is_enabled` | string | — | Filter parameter |
| `job_type` | string | — | Filter parameter |
| `last_run_status` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `scheduled_jobs_list` | array | Array of scheduled_job objects |
| `total_scheduled_jobs` | integer | Total count of scheduled_jobs |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "scheduled_jobs_list": [
    {
      "scheduled_job_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "failure_count": 0,
      "is_enabled": true,
      "job_name": "example_job_name",
      "job_type": "community_challenge_reward",
      "last_error_message": "example_last_error_message",
      "last_run_at": "2026-01-01T00:00:00Z",
      "last_run_duration_ms": 1,
      "last_run_status": "failed",
      "next_run_at": "2026-01-01T00:00:00Z",
      "run_count": 0,
      "schedule_cron": "example_schedule_cron",
      "timezone": "Asia/Baghdad",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_scheduled_jobs": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_platform_management/scheduled_jobs/{scheduled_job_id}`

**Update scheduled job**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `scheduled_job_id` | string (UUID) | Scheduled Job Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `failure_count` | integer | No | — |
| `is_enabled` | boolean | No | — |
| `job_name` | string | No | — |
| `job_type` | enum: ['community_challenge_reward', 'day_boundary_check', 'draw_pre_scaling', 'entry_archival', 'fawz_certified_multiplier_decay', 'jackpot_rollover', 'merchant_eligibility_refresh', 'monthly_streak_reset', 'notification_cleanup', 'retroactive_expiry', 'retroactive_seeding', 'weekly_streak_reset', 'winner_export'] | No | — |
| `last_error_message` | string | No | — |
| `last_run_at` | string (date-time) | No | — |
| `last_run_duration_ms` | integer | No | — |
| `last_run_status` | enum: ['failed', 'partial', 'success'] | No | — |
| `next_run_at` | string (date-time) | No | — |
| `run_count` | integer | No | — |
| `schedule_cron` | string | No | — |
| `timezone` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "failure_count": 1
}
```

**Example Response**:

```json
{
  "message": "ScheduledJob Updated Successfully"
}
```

#### `POST /api/v0/fawz_platform_management/tenants`

**Create a new tenant**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | — |
| `config` | string | No | JSON tenant configuration |
| `country_code` | string | No | — |
| `currency_code` | string | No | — |
| `is_active` | boolean | No | — |
| `name` | string | Yes | — |
| `name_localized` | string | No | — |
| `timezone` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenant_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "code": "EXAMPLE_CODE",
  "config": "example_config",
  "country_code": "IQ",
  "currency_code": "IQD",
  "is_active": true,
  "name": "example_name",
  "name_localized": "example_name_localized",
  "timezone": "Asia/Baghdad"
}
```

**Example Response**:

```json
{
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Tenant Created Successfully"
}
```

#### `GET /api/v0/fawz_platform_management/tenants/{tenant_id}`

**Get tenant by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenant_id` | string (UUID) | Tenant Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenant_id` | string | — |
| `code` | string | — |
| `config` | string | JSON tenant configuration |
| `country_code` | string | — |
| `currency_code` | string | — |
| `is_active` | boolean | — |
| `name` | string | — |
| `name_localized` | string | — |
| `timezone` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "code": "EXAMPLE_CODE",
  "config": "example_config",
  "country_code": "IQ",
  "currency_code": "IQD",
  "is_active": true,
  "name": "example_name",
  "name_localized": "example_name_localized",
  "timezone": "Asia/Baghdad",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_platform_management/tenants`

**List tenants**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `is_active` | string | — | Filter parameter |
| `search` | string | — | Text search across searchable fields |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `tenants_list` | array | Array of tenant objects |
| `total_tenants` | integer | Total count of tenants |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "tenants_list": [
    {
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "EXAMPLE_CODE",
      "config": "example_config",
      "country_code": "IQ",
      "currency_code": "IQD",
      "is_active": true,
      "name": "example_name",
      "name_localized": "example_name_localized",
      "timezone": "Asia/Baghdad",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_tenants": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_platform_management/tenants/{tenant_id}`

**Update tenant**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `tenant_id` | string (UUID) | Tenant Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | No | — |
| `config` | string | No | JSON tenant configuration |
| `country_code` | string | No | — |
| `currency_code` | string | No | — |
| `is_active` | boolean | No | — |
| `name` | string | No | — |
| `name_localized` | string | No | — |
| `timezone` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "code": "EXAMPLE_CODE"
}
```

**Example Response**:

```json
{
  "message": "Tenant Updated Successfully"
}
```

---

## backend-fawz-prize-payout-management

**Base URL**: `/api/v0/fawz_prize_payout_management`
**Port**: `8009`
**Description**: Manages financial disbursement of prizes via SuperQi Wallet API, per-user payout cap enforcement, and budget monitoring. Contains prize_payout (individual payout records with retry logic, hold/release workflow, and compliance review tracking), user_payout_cap (per-user weekly/monthly cap tracking), and budget_monitoring (period-based budget vs actual spend with threshold alerts). Prize credits are idempotent and irreversible once completed

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_prize_payout_management/budget_monitorings` | create | budget_monitoring | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_prize_payout_management/budget_monitorings/{budget_monitoring_id}` | read | budget_monitoring | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_prize_payout_management/budget_monitorings` | list | budget_monitoring | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_prize_payout_management/budget_monitorings/{budget_monitoring_id}` | update | budget_monitoring | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_prize_payout_management/prize_payouts` | create | prize_payout | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_prize_payout_management/prize_payouts/{prize_payout_id}` | read | prize_payout | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_prize_payout_management/prize_payouts` | list | prize_payout | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_prize_payout_management/prize_payouts/{prize_payout_id}` | update | prize_payout | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_prize_payout_management/user_payout_caps` | create | user_payout_cap | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_prize_payout_management/user_payout_caps/{user_payout_cap_id}` | read | user_payout_cap | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_prize_payout_management/user_payout_caps` | list | user_payout_cap | AccessLevel.ADMIN |
| `PATCH` | `/api/v0/fawz_prize_payout_management/user_payout_caps/{user_payout_cap_id}` | update | user_payout_cap | AccessLevel.ADMIN |

### Endpoint Details

#### `POST /api/v0/fawz_prize_payout_management/budget_monitorings`

**Create a new budget monitoring**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actual_spend_iqd` | integer | No | — |
| `alert_threshold_100_sent` | boolean | No | — |
| `alert_threshold_80_sent` | boolean | No | — |
| `budget_amount_iqd` | integer | Yes | — |
| `last_updated_at` | string (date-time) | Yes | — |
| `period_end` | string (date) | Yes | — |
| `period_start` | string (date) | Yes | — |
| `period_type` | enum: ['monthly', 'weekly', 'yearly'] | Yes | — |
| `projected_spend_iqd` | integer | No | — |
| `utilization_percent` | number | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `budget_monitoring_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "actual_spend_iqd": 0,
  "alert_threshold_100_sent": false,
  "alert_threshold_80_sent": false,
  "budget_amount_iqd": 1,
  "last_updated_at": "2026-01-01T00:00:00Z",
  "period_end": "2026-01-01",
  "period_start": "2026-01-01",
  "period_type": "monthly",
  "projected_spend_iqd": 0,
  "utilization_percent": 0.0
}
```

**Example Response**:

```json
{
  "budget_monitoring_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "BudgetMonitoring Created Successfully"
}
```

#### `GET /api/v0/fawz_prize_payout_management/budget_monitorings/{budget_monitoring_id}`

**Get budget monitoring by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `budget_monitoring_id` | string (UUID) | Budget Monitoring Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `budget_monitoring_id` | string | — |
| `tenant_id` | string | — |
| `actual_spend_iqd` | integer | — |
| `alert_threshold_100_sent` | boolean | — |
| `alert_threshold_80_sent` | boolean | — |
| `budget_amount_iqd` | integer | — |
| `last_updated_at` | string (date-time) | — |
| `period_end` | string (date) | — |
| `period_start` | string (date) | — |
| `period_type` | string | — |
| `projected_spend_iqd` | integer | — |
| `utilization_percent` | number | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "budget_monitoring_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "actual_spend_iqd": 0,
  "alert_threshold_100_sent": false,
  "alert_threshold_80_sent": false,
  "budget_amount_iqd": 1,
  "last_updated_at": "2026-01-01T00:00:00Z",
  "period_end": "2026-01-01",
  "period_start": "2026-01-01",
  "period_type": "monthly",
  "projected_spend_iqd": 0,
  "utilization_percent": 0.0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_prize_payout_management/budget_monitorings`

**List budget monitorings**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `period_type` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `budget_monitorings_list` | array | Array of budget_monitoring objects |
| `total_budget_monitorings` | integer | Total count of budget_monitorings |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "budget_monitorings_list": [
    {
      "budget_monitoring_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "actual_spend_iqd": 0,
      "alert_threshold_100_sent": false,
      "alert_threshold_80_sent": false,
      "budget_amount_iqd": 1,
      "last_updated_at": "2026-01-01T00:00:00Z",
      "period_end": "2026-01-01",
      "period_start": "2026-01-01",
      "period_type": "monthly",
      "projected_spend_iqd": 0,
      "utilization_percent": 0.0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_budget_monitorings": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_prize_payout_management/budget_monitorings/{budget_monitoring_id}`

**Update budget monitoring**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `budget_monitoring_id` | string (UUID) | Budget Monitoring Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actual_spend_iqd` | integer | No | — |
| `alert_threshold_100_sent` | boolean | No | — |
| `alert_threshold_80_sent` | boolean | No | — |
| `budget_amount_iqd` | integer | No | — |
| `last_updated_at` | string (date-time) | No | — |
| `period_end` | string (date) | No | — |
| `period_start` | string (date) | No | — |
| `period_type` | enum: ['monthly', 'weekly', 'yearly'] | No | — |
| `projected_spend_iqd` | integer | No | — |
| `utilization_percent` | number | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "actual_spend_iqd": 1
}
```

**Example Response**:

```json
{
  "message": "BudgetMonitoring Updated Successfully"
}
```

#### `POST /api/v0/fawz_prize_payout_management/prize_payouts`

**Create a new prize payout**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount_iqd` | integer | Yes | — |
| `compliance_review_case_id` | string | No | Reference to fraud_review_case for held payouts |
| `credited_at` | string (date-time) | No | — |
| `draw_id` | string | No | Reference to draw |
| `draw_winner_id` | string | No | Reference to draw_winner |
| `failed_at` | string (date-time) | No | — |
| `failure_reason` | string | No | — |
| `held_at` | string (date-time) | No | — |
| `held_reason` | string | No | — |
| `last_error` | string | No | — |
| `last_retry_at` | string (date-time) | No | — |
| `max_retries` | integer | No | — |
| `next_retry_at` | string (date-time) | No | — |
| `owner_type` | enum: ['merchant', 'user'] | Yes | — |
| `payout_type` | string | No | prize or referral_reward |
| `processing_started_at` | string (date-time) | No | — |
| `referral_id` | string | No | Reference to referral for cash rewards |
| `rejected_at` | string (date-time) | No | — |
| `rejected_by` | string | No | — |
| `rejection_reason` | string | No | — |
| `released_at` | string (date-time) | No | — |
| `released_by` | string | No | — |
| `retry_count` | integer | No | — |
| `status` | enum: ['credited', 'failed', 'held_cap_exceeded', 'held_compliance_review', 'held_for_review', 'paid', 'pending', 'pending_payout', 'processing', 'rejected'] | No | — |
| `superqi_wallet_tx_id` | string | No | SuperQi Wallet API transaction reference |
| `superqi_wallet_tx_status` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `prize_payout_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "amount_iqd": 1,
  "compliance_review_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "credited_at": "2026-01-01T00:00:00Z",
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "draw_winner_id": "550e8400-e29b-41d4-a716-446655440000",
  "failed_at": "2026-01-01T00:00:00Z",
  "failure_reason": "example_failure_reason",
  "held_at": "2026-01-01T00:00:00Z",
  "held_reason": "example_held_reason",
  "last_error": "example_last_error",
  "last_retry_at": "2026-01-01T00:00:00Z",
  "max_retries": 3,
  "next_retry_at": "2026-01-01T00:00:00Z",
  "owner_type": "merchant",
  "payout_type": "prize",
  "processing_started_at": "2026-01-01T00:00:00Z",
  "referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "rejected_at": "2026-01-01T00:00:00Z",
  "rejected_by": "example_rejected_by",
  "rejection_reason": "example_rejection_reason",
  "released_at": "2026-01-01T00:00:00Z",
  "released_by": "example_released_by",
  "retry_count": 0,
  "status": "credited",
  "superqi_wallet_tx_id": "550e8400-e29b-41d4-a716-446655440000",
  "superqi_wallet_tx_status": "example_superqi_wallet_tx_status"
}
```

**Example Response**:

```json
{
  "prize_payout_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "PrizePayout Created Successfully"
}
```

#### `GET /api/v0/fawz_prize_payout_management/prize_payouts/{prize_payout_id}`

**Get prize payout by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `prize_payout_id` | string (UUID) | Prize Payout Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `prize_payout_id` | string | — |
| `tenant_id` | string | — |
| `amount_iqd` | integer | — |
| `compliance_review_case_id` | string | Reference to fraud_review_case for held payouts |
| `credited_at` | string (date-time) | — |
| `draw_id` | string | Reference to draw |
| `draw_winner_id` | string | Reference to draw_winner |
| `failed_at` | string (date-time) | — |
| `failure_reason` | string | — |
| `held_at` | string (date-time) | — |
| `held_reason` | string | — |
| `last_error` | string | — |
| `last_retry_at` | string (date-time) | — |
| `max_retries` | integer | — |
| `next_retry_at` | string (date-time) | — |
| `owner_id` | string | Consumer or merchant receiving payout |
| `owner_type` | string | — |
| `payout_type` | string | prize or referral_reward |
| `processing_started_at` | string (date-time) | — |
| `referral_id` | string | Reference to referral for cash rewards |
| `rejected_at` | string (date-time) | — |
| `rejected_by` | string | — |
| `rejection_reason` | string | — |
| `released_at` | string (date-time) | — |
| `released_by` | string | — |
| `retry_count` | integer | — |
| `status` | string | — |
| `superqi_wallet_tx_id` | string | SuperQi Wallet API transaction reference |
| `superqi_wallet_tx_status` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "prize_payout_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "amount_iqd": 1,
  "compliance_review_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "credited_at": "2026-01-01T00:00:00Z",
  "draw_id": "550e8400-e29b-41d4-a716-446655440000",
  "draw_winner_id": "550e8400-e29b-41d4-a716-446655440000",
  "failed_at": "2026-01-01T00:00:00Z",
  "failure_reason": "example_failure_reason",
  "held_at": "2026-01-01T00:00:00Z",
  "held_reason": "example_held_reason",
  "last_error": "example_last_error",
  "last_retry_at": "2026-01-01T00:00:00Z",
  "max_retries": 3,
  "next_retry_at": "2026-01-01T00:00:00Z",
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_type": "merchant",
  "payout_type": "prize",
  "processing_started_at": "2026-01-01T00:00:00Z",
  "referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "rejected_at": "2026-01-01T00:00:00Z",
  "rejected_by": "example_rejected_by",
  "rejection_reason": "example_rejection_reason",
  "released_at": "2026-01-01T00:00:00Z",
  "released_by": "example_released_by",
  "retry_count": 0,
  "status": "credited",
  "superqi_wallet_tx_id": "550e8400-e29b-41d4-a716-446655440000",
  "superqi_wallet_tx_status": "example_superqi_wallet_tx_status",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_prize_payout_management/prize_payouts`

**List prize payouts**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `draw_id` | string | — | Filter parameter |
| `owner_id` | string | — | Filter parameter |
| `owner_type` | string | — | Filter parameter |
| `payout_type` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `prize_payouts_list` | array | Array of prize_payout objects |
| `total_prize_payouts` | integer | Total count of prize_payouts |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "prize_payouts_list": [
    {
      "prize_payout_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "amount_iqd": 1,
      "compliance_review_case_id": "550e8400-e29b-41d4-a716-446655440000",
      "credited_at": "2026-01-01T00:00:00Z",
      "draw_id": "550e8400-e29b-41d4-a716-446655440000",
      "draw_winner_id": "550e8400-e29b-41d4-a716-446655440000",
      "failed_at": "2026-01-01T00:00:00Z",
      "failure_reason": "example_failure_reason",
      "held_at": "2026-01-01T00:00:00Z",
      "held_reason": "example_held_reason",
      "last_error": "example_last_error",
      "last_retry_at": "2026-01-01T00:00:00Z",
      "max_retries": 3,
      "next_retry_at": "2026-01-01T00:00:00Z",
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "owner_type": "merchant",
      "payout_type": "prize",
      "processing_started_at": "2026-01-01T00:00:00Z",
      "referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "rejected_at": "2026-01-01T00:00:00Z",
      "rejected_by": "example_rejected_by",
      "rejection_reason": "example_rejection_reason",
      "released_at": "2026-01-01T00:00:00Z",
      "released_by": "example_released_by",
      "retry_count": 0,
      "status": "credited",
      "superqi_wallet_tx_id": "550e8400-e29b-41d4-a716-446655440000",
      "superqi_wallet_tx_status": "example_superqi_wallet_tx_status",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_prize_payouts": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_prize_payout_management/prize_payouts/{prize_payout_id}`

**Update prize payout**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `prize_payout_id` | string (UUID) | Prize Payout Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `amount_iqd` | integer | No | — |
| `compliance_review_case_id` | string | No | Reference to fraud_review_case for held payouts |
| `credited_at` | string (date-time) | No | — |
| `draw_id` | string | No | Reference to draw |
| `draw_winner_id` | string | No | Reference to draw_winner |
| `failed_at` | string (date-time) | No | — |
| `failure_reason` | string | No | — |
| `held_at` | string (date-time) | No | — |
| `held_reason` | string | No | — |
| `last_error` | string | No | — |
| `last_retry_at` | string (date-time) | No | — |
| `max_retries` | integer | No | — |
| `next_retry_at` | string (date-time) | No | — |
| `owner_type` | enum: ['merchant', 'user'] | No | — |
| `payout_type` | string | No | prize or referral_reward |
| `processing_started_at` | string (date-time) | No | — |
| `referral_id` | string | No | Reference to referral for cash rewards |
| `rejected_at` | string (date-time) | No | — |
| `rejected_by` | string | No | — |
| `rejection_reason` | string | No | — |
| `released_at` | string (date-time) | No | — |
| `released_by` | string | No | — |
| `retry_count` | integer | No | — |
| `status` | enum: ['credited', 'failed', 'held_cap_exceeded', 'held_compliance_review', 'held_for_review', 'paid', 'pending', 'pending_payout', 'processing', 'rejected'] | No | — |
| `superqi_wallet_tx_id` | string | No | SuperQi Wallet API transaction reference |
| `superqi_wallet_tx_status` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "amount_iqd": 1
}
```

**Example Response**:

```json
{
  "message": "PrizePayout Updated Successfully"
}
```

#### `POST /api/v0/fawz_prize_payout_management/user_payout_caps`

**Create a new user payout cap**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cap_amount_iqd` | integer | Yes | — |
| `cap_exceeded` | boolean | No | — |
| `cap_exceeded_at` | string (date-time) | No | — |
| `cap_type` | enum: ['monthly', 'weekly'] | Yes | — |
| `held_amount_iqd` | integer | No | — |
| `owner_id` | string | Yes | Consumer or merchant |
| `owner_type` | enum: ['consumer', 'merchant'] | Yes | — |
| `period_end` | string (date) | Yes | — |
| `period_start` | string (date) | Yes | — |
| `total_payout_iqd` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_payout_cap_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "cap_amount_iqd": 1,
  "cap_exceeded": false,
  "cap_exceeded_at": "2026-01-01T00:00:00Z",
  "cap_type": "monthly",
  "held_amount_iqd": 0,
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_type": "consumer",
  "period_end": "2026-01-01",
  "period_start": "2026-01-01",
  "total_payout_iqd": 0
}
```

**Example Response**:

```json
{
  "user_payout_cap_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "UserPayoutCap Created Successfully"
}
```

#### `GET /api/v0/fawz_prize_payout_management/user_payout_caps/{user_payout_cap_id}`

**Get user payout cap by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_payout_cap_id` | string (UUID) | User Payout Cap Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_payout_cap_id` | string | — |
| `tenant_id` | string | — |
| `cap_amount_iqd` | integer | — |
| `cap_exceeded` | boolean | — |
| `cap_exceeded_at` | string (date-time) | — |
| `cap_type` | string | — |
| `held_amount_iqd` | integer | — |
| `owner_id` | string | Consumer or merchant |
| `owner_type` | string | — |
| `period_end` | string (date) | — |
| `period_start` | string (date) | — |
| `total_payout_iqd` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_payout_cap_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "cap_amount_iqd": 1,
  "cap_exceeded": false,
  "cap_exceeded_at": "2026-01-01T00:00:00Z",
  "cap_type": "monthly",
  "held_amount_iqd": 0,
  "owner_id": "550e8400-e29b-41d4-a716-446655440000",
  "owner_type": "consumer",
  "period_end": "2026-01-01",
  "period_start": "2026-01-01",
  "total_payout_iqd": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_prize_payout_management/user_payout_caps`

**List user payout caps**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `cap_exceeded` | string | — | Filter parameter |
| `cap_type` | string | — | Filter parameter |
| `owner_id` | string | — | Filter parameter |
| `owner_type` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `user_payout_caps_list` | array | Array of user_payout_cap objects |
| `total_user_payout_caps` | integer | Total count of user_payout_caps |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "user_payout_caps_list": [
    {
      "user_payout_cap_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "cap_amount_iqd": 1,
      "cap_exceeded": false,
      "cap_exceeded_at": "2026-01-01T00:00:00Z",
      "cap_type": "monthly",
      "held_amount_iqd": 0,
      "owner_id": "550e8400-e29b-41d4-a716-446655440000",
      "owner_type": "consumer",
      "period_end": "2026-01-01",
      "period_start": "2026-01-01",
      "total_payout_iqd": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_user_payout_caps": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_prize_payout_management/user_payout_caps/{user_payout_cap_id}`

**Update user payout cap**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `user_payout_cap_id` | string (UUID) | User Payout Cap Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cap_amount_iqd` | integer | No | — |
| `cap_exceeded` | boolean | No | — |
| `cap_exceeded_at` | string (date-time) | No | — |
| `cap_type` | enum: ['monthly', 'weekly'] | No | — |
| `held_amount_iqd` | integer | No | — |
| `owner_id` | string | No | Consumer or merchant |
| `owner_type` | enum: ['consumer', 'merchant'] | No | — |
| `period_end` | string (date) | No | — |
| `period_start` | string (date) | No | — |
| `total_payout_iqd` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "cap_amount_iqd": 1
}
```

**Example Response**:

```json
{
  "message": "UserPayoutCap Updated Successfully"
}
```

---

## backend-fawz-referral-system

**Base URL**: `/api/v0/fawz_referral_system`
**Port**: `8010`
**Description**: Implements the Golden Ticket consumer-to-consumer referral programme with link generation, click attribution, fraud validation, and reward processing. Contains referral_link (unique links with 30-day expiry and click/conversion tracking), referral (full lifecycle records with 4 fraud checks, reward amounts, review workflow), and referral_click_tracking (individual click events with device/IP data). Referral follows initiated→pending→qualified→rewarded/pending_review/rejected/expired lifecycle. References consumer_user via string IDs

### Endpoint Summary

| Method | Path | Operation | Entity | Access |
|--------|------|-----------|--------|--------|
| `POST` | `/api/v0/fawz_referral_system/referrals` | create | referral | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_referral_system/referrals/{referral_id}` | read | referral | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_referral_system/referrals` | list | referral | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_referral_system/referrals/{referral_id}` | update | referral | AccessLevel.OWNER |
| `POST` | `/api/v0/fawz_referral_system/referral_click_trackings` | create | referral_click_tracking | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_referral_system/referral_click_trackings/{referral_click_tracking_id}` | read | referral_click_tracking | AccessLevel.ADMIN |
| `GET` | `/api/v0/fawz_referral_system/referral_click_trackings` | list | referral_click_tracking | AccessLevel.ADMIN |
| `POST` | `/api/v0/fawz_referral_system/referral_links` | create | referral_link | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_referral_system/referral_links/{referral_link_id}` | read | referral_link | AccessLevel.OWNER |
| `GET` | `/api/v0/fawz_referral_system/referral_links` | list | referral_link | AccessLevel.OWNER |
| `PATCH` | `/api/v0/fawz_referral_system/referral_links/{referral_link_id}` | update | referral_link | AccessLevel.OWNER |

### Endpoint Details

#### `POST /api/v0/fawz_referral_system/referrals`

**Create a new referral**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `click_device_fingerprint` | string | No | — |
| `click_device_fingerprint_hash` | string | No | — |
| `click_ip` | string | No | — |
| `click_ip_hash` | string | No | — |
| `clicked_at` | string (date-time) | No | — |
| `expired_at` | string (date-time) | No | — |
| `expires_at` | string (date-time) | No | — |
| `fraud_check_different_device` | boolean | No | — |
| `fraud_check_different_qi_card` | boolean | No | — |
| `fraud_check_no_prior_activity` | boolean | No | — |
| `fraud_check_qualifying_tx_type` | boolean | No | — |
| `fraud_validation_passed` | boolean | No | — |
| `fraud_validation_results` | string | No | JSON fraud validation details |
| `link_expires_at` | string (date-time) | Yes | — |
| `pending_review_at` | string (date-time) | No | — |
| `qualified_at` | string (date-time) | No | — |
| `qualifying_transaction_amount_iqd` | integer | No | — |
| `qualifying_transaction_id` | string | No | — |
| `referral_code` | string | Yes | — |
| `referral_link_id` | string | No | — |
| `referral_type` | enum: ['consumer_to_consumer', 'consumer_to_merchant', 'merchant_to_consumer'] | No | — |
| `referred_id` | string | No | Referred consumer user |
| `referred_reward_entries` | integer | No | — |
| `referred_rewarded_at` | string (date-time) | No | — |
| `referrer_reward_cash_iqd` | integer | No | — |
| `referrer_reward_entries` | integer | No | — |
| `referrer_rewarded_at` | string (date-time) | No | — |
| `registered_at` | string (date-time) | No | — |
| `rejected_at` | string (date-time) | No | — |
| `rejection_reason` | string | No | — |
| `review_case_id` | string | No | Reference to fraud_review_case |
| `review_decision` | enum: ['approved', 'rejected'] | No | — |
| `review_notes` | string | No | — |
| `reviewed_at` | string (date-time) | No | — |
| `reviewed_by` | string | No | — |
| `status` | enum: ['archived', 'clicked', 'expired', 'initiated', 'pending', 'pending_review', 'qualified', 'registered', 'rejected', 'rewarded'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "click_device_fingerprint": "example_click_device_fingerprint",
  "click_device_fingerprint_hash": "example_click_device_fingerprint_hash",
  "click_ip": "example_click_ip",
  "click_ip_hash": "example_click_ip_hash",
  "clicked_at": "2026-01-01T00:00:00Z",
  "expired_at": "2026-01-01T00:00:00Z",
  "expires_at": "2026-01-01T00:00:00Z",
  "fraud_check_different_device": true,
  "fraud_check_different_qi_card": true,
  "fraud_check_no_prior_activity": true,
  "fraud_check_qualifying_tx_type": true,
  "fraud_validation_passed": true,
  "fraud_validation_results": "example_fraud_validation_results",
  "link_expires_at": "2026-01-01T00:00:00Z",
  "pending_review_at": "2026-01-01T00:00:00Z",
  "qualified_at": "2026-01-01T00:00:00Z",
  "qualifying_transaction_amount_iqd": 1,
  "qualifying_transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "referral_code": "EXAMPLE_CODE",
  "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
  "referral_type": "consumer_to_consumer",
  "referred_id": "550e8400-e29b-41d4-a716-446655440000",
  "referred_reward_entries": 0,
  "referred_rewarded_at": "2026-01-01T00:00:00Z",
  "referrer_reward_cash_iqd": 0,
  "referrer_reward_entries": 0,
  "referrer_rewarded_at": "2026-01-01T00:00:00Z",
  "registered_at": "2026-01-01T00:00:00Z",
  "rejected_at": "2026-01-01T00:00:00Z",
  "rejection_reason": "example_rejection_reason",
  "review_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "review_decision": "approved",
  "review_notes": "example_review_notes",
  "reviewed_at": "2026-01-01T00:00:00Z",
  "reviewed_by": "example_reviewed_by",
  "status": "archived"
}
```

**Example Response**:

```json
{
  "referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Referral Created Successfully"
}
```

#### `GET /api/v0/fawz_referral_system/referrals/{referral_id}`

**Get referral by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `referral_id` | string (UUID) | Referral Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_id` | string | — |
| `tenant_id` | string | — |
| `click_device_fingerprint` | string | — |
| `click_device_fingerprint_hash` | string | — |
| `click_ip` | string | — |
| `click_ip_hash` | string | — |
| `clicked_at` | string (date-time) | — |
| `expired_at` | string (date-time) | — |
| `expires_at` | string (date-time) | — |
| `fraud_check_different_device` | boolean | — |
| `fraud_check_different_qi_card` | boolean | — |
| `fraud_check_no_prior_activity` | boolean | — |
| `fraud_check_qualifying_tx_type` | boolean | — |
| `fraud_validation_passed` | boolean | — |
| `fraud_validation_results` | string | JSON fraud validation details |
| `link_expires_at` | string (date-time) | — |
| `pending_review_at` | string (date-time) | — |
| `qualified_at` | string (date-time) | — |
| `qualifying_transaction_amount_iqd` | integer | — |
| `qualifying_transaction_id` | string | — |
| `referral_code` | string | — |
| `referral_link_id` | string | — |
| `referral_type` | string | — |
| `referred_id` | string | Referred consumer user |
| `referred_reward_entries` | integer | — |
| `referred_rewarded_at` | string (date-time) | — |
| `referrer_id` | string | Referrer consumer user |
| `referrer_reward_cash_iqd` | integer | — |
| `referrer_reward_entries` | integer | — |
| `referrer_rewarded_at` | string (date-time) | — |
| `registered_at` | string (date-time) | — |
| `rejected_at` | string (date-time) | — |
| `rejection_reason` | string | — |
| `review_case_id` | string | Reference to fraud_review_case |
| `review_decision` | string | — |
| `review_notes` | string | — |
| `reviewed_at` | string (date-time) | — |
| `reviewed_by` | string | — |
| `status` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "click_device_fingerprint": "example_click_device_fingerprint",
  "click_device_fingerprint_hash": "example_click_device_fingerprint_hash",
  "click_ip": "example_click_ip",
  "click_ip_hash": "example_click_ip_hash",
  "clicked_at": "2026-01-01T00:00:00Z",
  "expired_at": "2026-01-01T00:00:00Z",
  "expires_at": "2026-01-01T00:00:00Z",
  "fraud_check_different_device": true,
  "fraud_check_different_qi_card": true,
  "fraud_check_no_prior_activity": true,
  "fraud_check_qualifying_tx_type": true,
  "fraud_validation_passed": true,
  "fraud_validation_results": "example_fraud_validation_results",
  "link_expires_at": "2026-01-01T00:00:00Z",
  "pending_review_at": "2026-01-01T00:00:00Z",
  "qualified_at": "2026-01-01T00:00:00Z",
  "qualifying_transaction_amount_iqd": 1,
  "qualifying_transaction_id": "550e8400-e29b-41d4-a716-446655440000",
  "referral_code": "EXAMPLE_CODE",
  "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
  "referral_type": "consumer_to_consumer",
  "referred_id": "550e8400-e29b-41d4-a716-446655440000",
  "referred_reward_entries": 0,
  "referred_rewarded_at": "2026-01-01T00:00:00Z",
  "referrer_id": "550e8400-e29b-41d4-a716-446655440000",
  "referrer_reward_cash_iqd": 0,
  "referrer_reward_entries": 0,
  "referrer_rewarded_at": "2026-01-01T00:00:00Z",
  "registered_at": "2026-01-01T00:00:00Z",
  "rejected_at": "2026-01-01T00:00:00Z",
  "rejection_reason": "example_rejection_reason",
  "review_case_id": "550e8400-e29b-41d4-a716-446655440000",
  "review_decision": "approved",
  "review_notes": "example_review_notes",
  "reviewed_at": "2026-01-01T00:00:00Z",
  "reviewed_by": "example_reviewed_by",
  "status": "archived",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_referral_system/referrals`

**List referrals**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `referral_code` | string | — | Filter parameter |
| `referral_type` | string | — | Filter parameter |
| `referred_id` | string | — | Filter parameter |
| `referrer_id` | string | — | Filter parameter |
| `status` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referrals_list` | array | Array of referral objects |
| `total_referrals` | integer | Total count of referrals |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "referrals_list": [
    {
      "referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "click_device_fingerprint": "example_click_device_fingerprint",
      "click_device_fingerprint_hash": "example_click_device_fingerprint_hash",
      "click_ip": "example_click_ip",
      "click_ip_hash": "example_click_ip_hash",
      "clicked_at": "2026-01-01T00:00:00Z",
      "expired_at": "2026-01-01T00:00:00Z",
      "expires_at": "2026-01-01T00:00:00Z",
      "fraud_check_different_device": true,
      "fraud_check_different_qi_card": true,
      "fraud_check_no_prior_activity": true,
      "fraud_check_qualifying_tx_type": true,
      "fraud_validation_passed": true,
      "fraud_validation_results": "example_fraud_validation_results",
      "link_expires_at": "2026-01-01T00:00:00Z",
      "pending_review_at": "2026-01-01T00:00:00Z",
      "qualified_at": "2026-01-01T00:00:00Z",
      "qualifying_transaction_amount_iqd": 1,
      "qualifying_transaction_id": "550e8400-e29b-41d4-a716-446655440000",
      "referral_code": "EXAMPLE_CODE",
      "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
      "referral_type": "consumer_to_consumer",
      "referred_id": "550e8400-e29b-41d4-a716-446655440000",
      "referred_reward_entries": 0,
      "referred_rewarded_at": "2026-01-01T00:00:00Z",
      "referrer_id": "550e8400-e29b-41d4-a716-446655440000",
      "referrer_reward_cash_iqd": 0,
      "referrer_reward_entries": 0,
      "referrer_rewarded_at": "2026-01-01T00:00:00Z",
      "registered_at": "2026-01-01T00:00:00Z",
      "rejected_at": "2026-01-01T00:00:00Z",
      "rejection_reason": "example_rejection_reason",
      "review_case_id": "550e8400-e29b-41d4-a716-446655440000",
      "review_decision": "approved",
      "review_notes": "example_review_notes",
      "reviewed_at": "2026-01-01T00:00:00Z",
      "reviewed_by": "example_reviewed_by",
      "status": "archived",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_referrals": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_referral_system/referrals/{referral_id}`

**Update referral**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `referral_id` | string (UUID) | Referral Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `click_device_fingerprint` | string | No | — |
| `click_device_fingerprint_hash` | string | No | — |
| `click_ip` | string | No | — |
| `click_ip_hash` | string | No | — |
| `clicked_at` | string (date-time) | No | — |
| `expired_at` | string (date-time) | No | — |
| `expires_at` | string (date-time) | No | — |
| `fraud_check_different_device` | boolean | No | — |
| `fraud_check_different_qi_card` | boolean | No | — |
| `fraud_check_no_prior_activity` | boolean | No | — |
| `fraud_check_qualifying_tx_type` | boolean | No | — |
| `fraud_validation_passed` | boolean | No | — |
| `fraud_validation_results` | string | No | JSON fraud validation details |
| `link_expires_at` | string (date-time) | No | — |
| `pending_review_at` | string (date-time) | No | — |
| `qualified_at` | string (date-time) | No | — |
| `qualifying_transaction_amount_iqd` | integer | No | — |
| `qualifying_transaction_id` | string | No | — |
| `referral_code` | string | No | — |
| `referral_link_id` | string | No | — |
| `referral_type` | enum: ['consumer_to_consumer', 'consumer_to_merchant', 'merchant_to_consumer'] | No | — |
| `referred_id` | string | No | Referred consumer user |
| `referred_reward_entries` | integer | No | — |
| `referred_rewarded_at` | string (date-time) | No | — |
| `referrer_reward_cash_iqd` | integer | No | — |
| `referrer_reward_entries` | integer | No | — |
| `referrer_rewarded_at` | string (date-time) | No | — |
| `registered_at` | string (date-time) | No | — |
| `rejected_at` | string (date-time) | No | — |
| `rejection_reason` | string | No | — |
| `review_case_id` | string | No | Reference to fraud_review_case |
| `review_decision` | enum: ['approved', 'rejected'] | No | — |
| `review_notes` | string | No | — |
| `reviewed_at` | string (date-time) | No | — |
| `reviewed_by` | string | No | — |
| `status` | enum: ['archived', 'clicked', 'expired', 'initiated', 'pending', 'pending_review', 'qualified', 'registered', 'rejected', 'rewarded'] | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "click_device_fingerprint": "example_click_device_fingerprint"
}
```

**Example Response**:

```json
{
  "message": "Referral Updated Successfully"
}
```

#### `POST /api/v0/fawz_referral_system/referral_click_trackings`

**Create a new referral click tracking**
**Access Level**: `AccessLevel.ADMIN`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `click_ip` | string | No | — |
| `clicked_at` | string (date-time) | Yes | — |
| `converted_to_referral_id` | string | No | Reference to referral if converted |
| `device_fingerprint` | string | No | — |
| `referer_url` | string | No | — |
| `referral_code` | string | Yes | — |
| `referral_link_id` | string | Yes | — |
| `user_agent` | string | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_click_tracking_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "click_ip": "example_click_ip",
  "clicked_at": "2026-01-01T00:00:00Z",
  "converted_to_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_fingerprint": "example_device_fingerprint",
  "referer_url": "example_referer_url",
  "referral_code": "EXAMPLE_CODE",
  "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_agent": "example_user_agent"
}
```

**Example Response**:

```json
{
  "referral_click_tracking_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "ReferralClickTracking Created Successfully"
}
```

#### `GET /api/v0/fawz_referral_system/referral_click_trackings/{referral_click_tracking_id}`

**Get referral click tracking by ID**
**Access Level**: `AccessLevel.ADMIN`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `referral_click_tracking_id` | string (UUID) | Referral Click Tracking Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_click_tracking_id` | string | — |
| `tenant_id` | string | — |
| `click_ip` | string | — |
| `clicked_at` | string (date-time) | — |
| `converted_to_referral_id` | string | Reference to referral if converted |
| `device_fingerprint` | string | — |
| `referer_url` | string | — |
| `referral_code` | string | — |
| `referral_link_id` | string | — |
| `user_agent` | string | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "referral_click_tracking_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "click_ip": "example_click_ip",
  "clicked_at": "2026-01-01T00:00:00Z",
  "converted_to_referral_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_fingerprint": "example_device_fingerprint",
  "referer_url": "example_referer_url",
  "referral_code": "EXAMPLE_CODE",
  "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_agent": "example_user_agent",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_referral_system/referral_click_trackings`

**List referral click trackings**
**Access Level**: `AccessLevel.ADMIN`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `referral_code` | string | — | Filter parameter |
| `referral_link_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_click_trackings_list` | array | Array of referral_click_tracking objects |
| `total_referral_click_trackings` | integer | Total count of referral_click_trackings |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — requires admin role |
| `500` | Internal server error |

**Example Response**:

```json
{
  "referral_click_trackings_list": [
    {
      "referral_click_tracking_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "click_ip": "example_click_ip",
      "clicked_at": "2026-01-01T00:00:00Z",
      "converted_to_referral_id": "550e8400-e29b-41d4-a716-446655440000",
      "device_fingerprint": "example_device_fingerprint",
      "referer_url": "example_referer_url",
      "referral_code": "EXAMPLE_CODE",
      "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
      "user_agent": "example_user_agent",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_referral_click_trackings": 1,
  "page": 1,
  "page_size": 20
}
```

#### `POST /api/v0/fawz_referral_system/referral_links`

**Create a new referral link**
**Access Level**: `AccessLevel.OWNER`

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `click_count` | integer | No | — |
| `expires_at` | string (date-time) | Yes | — |
| `full_url` | string | Yes | — |
| `is_active` | boolean | No | — |
| `referral_code` | string | Yes | — |
| `successful_referrals` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_link_id` | string | Created entity ID |
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `201` | Created successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "click_count": 0,
  "expires_at": "2026-01-01T00:00:00Z",
  "full_url": "example_full_url",
  "is_active": true,
  "referral_code": "EXAMPLE_CODE",
  "successful_referrals": 0
}
```

**Example Response**:

```json
{
  "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "ReferralLink Created Successfully"
}
```

#### `GET /api/v0/fawz_referral_system/referral_links/{referral_link_id}`

**Get referral link by ID**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `referral_link_id` | string (UUID) | Referral Link Id |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_link_id` | string | — |
| `tenant_id` | string | — |
| `click_count` | integer | — |
| `expires_at` | string (date-time) | — |
| `full_url` | string | — |
| `is_active` | boolean | — |
| `referral_code` | string | — |
| `referrer_id` | string | Consumer user who owns this link |
| `successful_referrals` | integer | — |
| `created_at` | string (date-time) | — |
| `updated_at` | string (date-time) | — |
| `created_by` | string | — |
| `updated_by` | string | — |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `500` | Internal server error |

**Example Response**:

```json
{
  "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
  "click_count": 0,
  "expires_at": "2026-01-01T00:00:00Z",
  "full_url": "example_full_url",
  "is_active": true,
  "referral_code": "EXAMPLE_CODE",
  "referrer_id": "550e8400-e29b-41d4-a716-446655440000",
  "successful_referrals": 0,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z",
  "created_by": "example_created_by",
  "updated_by": "example_updated_by"
}
```

#### `GET /api/v0/fawz_referral_system/referral_links`

**List referral links**
**Access Level**: `AccessLevel.OWNER`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `page_size` | integer | 20 | Items per page (max 100) |
| `is_active` | string | — | Filter parameter |
| `referral_code` | string | — | Filter parameter |
| `referrer_id` | string | — | Filter parameter |
| `sort_by` | string | — | Field name to sort by |
| `sort_order` | string | desc | Sort order: "asc" or "desc" |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `referral_links_list` | array | Array of referral_link objects |
| `total_referral_links` | integer | Total count of referral_links |
| `page` | integer | Current page number (1-indexed) |
| `page_size` | integer | Number of items per page |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Success |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `500` | Internal server error |

**Example Response**:

```json
{
  "referral_links_list": [
    {
      "referral_link_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
      "click_count": 0,
      "expires_at": "2026-01-01T00:00:00Z",
      "full_url": "example_full_url",
      "is_active": true,
      "referral_code": "EXAMPLE_CODE",
      "referrer_id": "550e8400-e29b-41d4-a716-446655440000",
      "successful_referrals": 0,
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-01-01T00:00:00Z",
      "created_by": "example_created_by",
      "updated_by": "example_updated_by"
    }
  ],
  "total_referral_links": 1,
  "page": 1,
  "page_size": 20
}
```

#### `PATCH /api/v0/fawz_referral_system/referral_links/{referral_link_id}`

**Update referral link**
**Access Level**: `AccessLevel.OWNER`

**Path Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `referral_link_id` | string (UUID) | Referral Link Id |

**Request Body** (`application/json`):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `click_count` | integer | No | — |
| `expires_at` | string (date-time) | No | — |
| `full_url` | string | No | — |
| `is_active` | boolean | No | — |
| `referral_code` | string | No | — |
| `successful_referrals` | integer | No | — |

**Response Schema**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Success message |

**Status Codes**:

| Code | Description |
|------|-------------|
| `200` | Updated successfully |
| `401` | Unauthorized — invalid or missing token |
| `403` | Forbidden — resource owned by another user |
| `404` | Entity not found |
| `422` | Validation error — invalid request body |
| `500` | Internal server error |

**Example Request**:

```json
{
  "click_count": 1
}
```

**Example Response**:

```json
{
  "message": "ReferralLink Updated Successfully"
}
```

---

*Generated by AAG — AI App Generator (prompt_runner)*
