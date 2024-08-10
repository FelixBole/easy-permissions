import { PermissionRegistry } from "./PermissionRegistry";
import { Permission } from "./permissions.types";

/**
 * This class will convert strings in the action:resource:optional_resource_scope 
 * format into Permission objects and register them.
 */
export class PermissionMapper {
	private permissionRegistry: PermissionRegistry;

	constructor(permissionRegistry: PermissionRegistry) {
		this.permissionRegistry = permissionRegistry;
	}

	registerPermissions(
		permissionData: (Permission | string)[]
	) {
		permissionData.forEach((data) => {
			if (typeof data === "string") {
				const permission = this.parsePermissionString(data);
				this.permissionRegistry.registerPermission(permission);
			} else {
				this.permissionRegistry.registerPermission(data);
			}
		});
	}

	parsePermissionString(
		permissionString: string
	): Permission {
		const [action, resource, resourceScope] = permissionString.split(":");
		return {
			id: `${action}:${resource}${resourceScope ? `:${resourceScope}` : ""}`, // Generate an ID based on the string
			action,
			resource,
			resourceScope,
		};
	}
}
