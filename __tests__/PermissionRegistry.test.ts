// __tests__/PermissionRegistry.test.ts

import { PermissionRegistry } from "../src/PermissionRegistry";
import { Permission } from "../src/permissions.types";

describe("PermissionRegistry", () => {
	let permissionRegistry: PermissionRegistry;

	beforeEach(() => {
		permissionRegistry = new PermissionRegistry();
	});

	test("should register a new permission", () => {
		const permission: Permission = {
			id: "edit:documents:*",
			action: "edit",
			resource: "documents",
			resourceScope: "*",
		};
		permissionRegistry.registerPermission(permission);

		const registeredPermission =
			permissionRegistry.getPermission("edit:documents:*");
		expect(registeredPermission).toEqual(permission);
	});

	test("should not allow duplicate permissions", () => {
		const permission: Permission = {
			id: "edit:documents:*",
			action: "edit",
			resource: "documents",
			resourceScope: "*",
		};
		permissionRegistry.registerPermission(permission);

		expect(() => {
			permissionRegistry.registerPermission(permission);
		}).toThrow(`Permission with ID ${permission.id} already exists.`);
	});

	test("should return undefined for non-existent permission", () => {
		const permission = permissionRegistry.getPermission("nonexistent");
		expect(permission).toBeUndefined();
	});

	test("should return all registered permissions", () => {
		const permission1: Permission = {
			id: "edit:documents:*",
			action: "edit",
			resource: "documents",
			resourceScope: "*",
		};
		const permission2: Permission = {
			id: "view:documents",
			action: "view",
			resource: "documents",
		};
		permissionRegistry.registerPermission(permission1);
		permissionRegistry.registerPermission(permission2);

		const allPermissions = permissionRegistry.getAllPermissions();
		expect(allPermissions).toHaveLength(2);
		expect(allPermissions).toContainEqual(permission1);
		expect(allPermissions).toContainEqual(permission2);
	});
});
