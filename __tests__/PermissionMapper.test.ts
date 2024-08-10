// __tests__/PermissionMapper.test.ts

import { PermissionMapper } from "../src/PermissionMapper";
import { PermissionRegistry } from "../src/PermissionRegistry";
import { Permission } from "../src/permissions.types";

describe("PermissionMapper", () => {
	let permissionRegistry: PermissionRegistry;
	let permissionMapper: PermissionMapper;

	beforeEach(() => {
		permissionRegistry = new PermissionRegistry();
		permissionMapper = new PermissionMapper(permissionRegistry);
	});

	test("should register permissions from strings", () => {
		const permissions = ["edit:documents:*", "view:documents"];
		permissionMapper.registerPermissions(permissions);

		const editPermission = permissionRegistry.getPermission("edit:documents:*");
		const viewPermission = permissionRegistry.getPermission("view:documents");

		expect(editPermission).toEqual({
			id: "edit:documents:*",
			action: "edit",
			resource: "documents",
			resourceScope: "*",
		});
		expect(viewPermission).toEqual({
			id: "view:documents",
			action: "view",
			resource: "documents",
		});
	});

	test("should register permissions from objects", () => {
		const permissions: Permission[] = [
			{
				id: "edit:documents:*",
				action: "edit",
				resource: "documents",
				resourceScope: "*",
			},
			{ id: "view:documents", action: "view", resource: "documents" },
		];
		permissionMapper.registerPermissions(permissions);

		const editPermission = permissionRegistry.getPermission("edit:documents:*");
		const viewPermission = permissionRegistry.getPermission("view:documents");

		expect(editPermission).toEqual(permissions[0]);
		expect(viewPermission).toEqual(permissions[1]);
	});

	test("should correctly parse permission strings", () => {
		const permission = permissionMapper.parsePermissionString(
			"edit:documents:1234"
		);
		expect(permission).toEqual({
			id: "edit:documents:1234",
			action: "edit",
			resource: "documents",
			resourceScope: "1234",
		});
	});
});
