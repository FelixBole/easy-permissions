import { Permission } from "./permissions.types";

/**
 * Class responsible for registering and managing permissions.
 */
export class PermissionRegistry {
	private permissions: Map<string, Permission> = new Map();

	registerPermission(permission: Permission) {
		if (this.permissions.has(permission.id)) {
			throw new Error(`Permission with ID ${permission.id} already exists.`);
		}
		this.permissions.set(permission.id, permission);
	}

	getPermission(id: string): Permission | undefined {
		return this.permissions.get(id);
	}

	getAllPermissions(): Permission[] {
		return Array.from(this.permissions.values());
	}
}
