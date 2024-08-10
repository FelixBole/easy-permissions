import { PermissionMapper } from "./PermissionMapper";
import { Permission, Role } from "./permissions.types";

/**
 * Class that manages roles and their associated permissions.
 */
export class RoleManager {
	private roles: Map<string, Role> = new Map();
	private permissionMapper: PermissionMapper;

	constructor(permissionMapper: PermissionMapper) {
		this.permissionMapper = permissionMapper;
	}

	createRole(
		role: Omit<Role, "permissions"> & { permissions: Permission[] | string[] }
	) {
		// Go over role permissions and if they are strings, convert them to Permission objects
		role.permissions = role.permissions.map((perm) =>
			typeof perm === "string"
				? this.permissionMapper.parsePermissionString(perm)
				: perm
		);

		if (this.roles.has(role.id)) {
			throw new Error(`Role with ID ${role.id} already exists.`);
		}
		this.roles.set(role.id, role as Role);
	}

	createRoles(
		roles: (Omit<Role, "permissions"> & {
			permissions: Permission[] | string[];
		})[]
	) {
		roles.forEach((role) => this.createRole(role));
	}

	assignPermissionToRole(roleId: string, permission: Permission | string) {
		const role = this.roles.get(roleId);
		if (!role) {
			throw new Error(`Role with ID ${roleId} not found.`);
		}

		// If permission is a string, convert it to a Permission object
		const permissionObj =
			typeof permission === "string"
				? this.permissionMapper.parsePermissionString(permission)
				: permission;

		role.permissions.push(permissionObj);
	}

	getRole(roleId: string): Role | undefined {
		return this.roles.get(roleId);
	}

	hasPermission(
		user: {
			roles: (Role | string)[];
			permissions: (Permission | string)[];
		},
		permissionToCheck: string | Permission
	): boolean {
		const { roles, permissions } = user;

		// Convert permissionToCheck to a Permission object if it's a string
		const permission =
			typeof permissionToCheck === "string"
				? this.parsePermissionString(permissionToCheck)
				: permissionToCheck;

		// Check direct permissions
		for (const userPermission of permissions) {
			const perm =
				typeof userPermission === "string"
					? this.parsePermissionString(userPermission)
					: userPermission;
			if (
				this.permissionMatches(
					perm,
					permission.action,
					permission.resource,
					permission.resourceScope
				)
			) {
				return true;
			}
		}

		// Check role-based permissions
		for (const roleId of roles) {
			const role = typeof roleId === "string" ? this.getRole(roleId) : roleId;
			if (
				role &&
				this.checkRolePermission(
					role.id,
					permission.action,
					permission.resource,
					permission.resourceScope
				)
			) {
				return true;
			}
		}

		return false;
	}

	private parsePermissionString(permissionString: string): Permission {
		const [action, resource, resourceScope] = permissionString.split(":");
		return {
			id: `${action}:${resource}${resourceScope ? `:${resourceScope}` : ""}`,
			action,
			resource,
			resourceScope,
		};
	}

	private permissionMatches(
		permission: Permission,
		action: string,
		resource: string,
		scope?: string
	): boolean {
		if (permission.action === "*") return true;

		if (
			permission.action !== action ||
			(permission.resource !== "*" && permission.resource !== resource)
		) {
			return false;
		}

		return (
			permission.resourceScope === scope ||
			permission.resourceScope === "*" ||
			(permission.resourceScope === undefined && scope === undefined)
		);
	}

	private checkRolePermission(
		roleId: string,
		action: string,
		resource: string,
		scope?: string
	): boolean {
		const role = this.getRole(roleId);
		if (!role) return false;

		for (const perm of role.permissions) {
			if (this.permissionMatches(perm, action, resource, scope)) {
				return true;
			}
		}
		return false;
	}
}
