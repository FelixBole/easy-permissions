# Easy Permissions

This module provides a reusable system for managing roles and permissions within a TypeScript application. It is designed to integrate easily with existing user management systems, allowing you to manage permissions without needing to directly manage users.

## Heads Up

This is a very simple package targeted at small projects. If you want something more robust that can directly integrate with larger apps and databases, you should consider looking at something like [casl](https://github.com/stalniy/casl).

If you need something quick and easy to setup, then ez-perms can do the trick.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Defining Permissions](#defining-permissions)
  - [Managing Roles](#managing-roles)
  - [Checking Permissions](#checking-permissions)
- [Usage Examples](#usage-examples)
  - [Registering Permissions](#registering-permissions)
  - [Assigning Roles](#assigning-roles)
  - [Checking User Permissions](#checking-user-permissions)
- [API Reference](#api-reference)

## Overview

This module allows you to manage user permissions and roles using a pattern like `action:resource:optional_resource_scope`. This format allows you to specify permissions at various levels of granularity, from broad actions on all resources to specific actions on individual resources.

### Key Concepts

- **Permission**: Defines an action on a resource, optionally scoped to a specific instance.
- **Role**: A collection of permissions that can be assigned to a user.
- **PermissionMapper**: Registers permissions using strings or objects.
- **RoleManager**: Manages roles and checks permissions.

## Getting Started

### Defining Permissions

Permissions are defined using a pattern of `action:resource:optional_resource_scope`. This allows you to specify exactly what a user is allowed to do.

```typescript
// Example Permission strings
const permissions = [
	"edit:documents:*", // Edit any document
	"view:documents", // View any document
	"delete:users", // Delete any user
];
```

### Managing Roles

Roles are collections of permissions. You can define roles and assign permissions to them.

```typescript
const adminRole = { id: "admin", name: "Admin", permissions: [] };
const userRole = { id: "user", name: "User", permissions: ["view:documents"] };

// Create roles using RoleManager
roleManager.createRole(adminRole);
roleManager.createRole(userRole);

// Or create multiple roles directly
roleManager.createRoles([adminRole, userRole]);
```

### Checking Permissions

To check if a user has a particular permission, pass the user's roles and permissions to the `RoleManager`'s `hasPermission` method.

```typescript
const canEditDocument = roleManager.hasPermission(user, "edit:documents:1234");
```

## Usage Examples

### Registering Permissions

You can register permissions using either strings or objects:

```typescript
import { permissionMapper } from "path_to_permissions_module";

const permissions = [
	"edit:documents:*", // String-based definition
	{ id: "view:documents", action: "view", resource: "documents" }, // Object-based definition
];

// Register permissions
permissionMapper.registerPermissions(permissions);
```

### Assigning Roles

Roles can be created and managed using the `RoleManager`:

```typescript
import { roleManager } from "path_to_permissions_module";

const adminRole = { id: "admin", name: "Admin", permissions: [] };
const editorRole = { id: "editor", name: "Editor", permissions: [] };

// Create roles
roleManager.createRole(adminRole);
roleManager.createRole(editorRole);

// Assign permissions to roles
roleManager.assignPermissionToRole("admin", "edit:documents:*");
roleManager.assignPermissionToRole("editor", "view:documents");
```

### Checking User Permissions

To check if a user has a specific permission, use the `hasPermission` method:

```typescript
const user = {
	roles: ["editor"],
	permissions: ["edit:documents:1234"], // Direct permission to edit a specific document
};

// Check if the user can edit a specific document
const canEditDocument = roleManager.hasPermission(user, "edit:documents:1234"); // true

// Check if the user can view any document
const canViewDocuments = roleManager.hasPermission(user, "view:documents"); // true (if we consider the Assigning Roles section and the user has the 'editor' role)
```

## API Reference

### `PermissionMapper`

- **registerPermissions(permissionData: (Permission | string)[])**
  - Registers a list of permissions, which can be either objects or formatted strings.

### `RoleManager`

- **createRole(role: Role)**
  - Creates a new role with a unique identifier.
- **assignPermissionToRole(roleId: string, permission: Permission)**
  - Assigns a specific permission to a role.
- **hasPermission(user: { roles: (Role | string)[], permissions: (Permission | string)[] }, permissionToCheck: string | Permission): boolean**
  - Checks if the given user object has the specified permission.

## License

This project uses the MIT license.
