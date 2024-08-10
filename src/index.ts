import { PermissionRegistry } from "./PermissionRegistry";
import { PermissionMapper } from "./PermissionMapper";
import { RoleManager } from "./RoleManager";

const permissionRegistry = new PermissionRegistry();
const permissionMapper = new PermissionMapper(permissionRegistry);
const roleManager = new RoleManager(permissionMapper);

// Only these are exported because the application will typically interact with these directly
export {
	permissionMapper,
	roleManager,

	// We export the PermissionRegistry if the application needs to access all permissions directly
	permissionRegistry,
};

// Export the types if the consuming application needs to use them
export type { Permission, Role } from "./permissions.types";
