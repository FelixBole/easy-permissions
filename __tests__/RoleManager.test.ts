// __tests__/RoleManager.test.ts

import { RoleManager } from "../src/RoleManager";
import { PermissionMapper } from "../src/PermissionMapper";
import { PermissionRegistry } from "../src/PermissionRegistry";
import { Permission } from "../src/permissions.types";

describe("RoleManager", () => {
	let roleManager: RoleManager;
	let permissionMapper: PermissionMapper;

	beforeEach(() => {
		const permissionRegistry = new PermissionRegistry();
		permissionMapper = new PermissionMapper(permissionRegistry);
		roleManager = new RoleManager(permissionMapper);
	});

	test("should create a new role", () => {
		const role = { id: "admin", name: "Admin", permissions: [] };
		roleManager.createRole(role);

		const storedRole = roleManager.getRole("admin");
		expect(storedRole).toEqual(role);
	});

	test("should create a role with string permissions", () => {
		const role = {
			id: "editor",
			name: "Editor",
			permissions: ["view:documents", "edit:documents:*"],
		};
		roleManager.createRole(role);

		const storedRole = roleManager.getRole("editor");
		const expectedPermissions = [
			{
				id: "view:documents",
				action: "view",
				resource: "documents",
				resourceScope: undefined,
			},
			{
				id: "edit:documents:*",
				action: "edit",
				resource: "documents",
				resourceScope: "*",
			},
		];
		expect(storedRole?.permissions).toEqual(expectedPermissions);
	})

	test("should not create a duplicate role", () => {
		const role = { id: "admin", name: "Admin", permissions: [] };
		roleManager.createRole(role);

		expect(() => {
			roleManager.createRole(role);
		}).toThrow(`Role with ID ${role.id} already exists.`);
	});

	test("should assign a permission to a role using a Permission object", () => {
		const role = { id: "admin", name: "Admin", permissions: [] };
		roleManager.createRole(role);

		const permission: Permission = {
			id: "edit:documents:*",
			action: "edit",
			resource: "documents",
			resourceScope: "*",
		};
		roleManager.assignPermissionToRole("admin", permission);

		const storedRole = roleManager.getRole("admin");
		expect(storedRole?.permissions).toContainEqual(permission);
	});

	test("should assign a permission to a role using a string", () => {
		const role = { id: "editor", name: "Editor", permissions: [] };
		roleManager.createRole(role);

		roleManager.assignPermissionToRole("editor", "view:documents");

		const storedRole = roleManager.getRole("editor");
		const expectedPermission = {
			id: "view:documents",
			action: "view",
			resource: "documents",
			resourceScope: undefined,
		};
		expect(storedRole?.permissions).toContainEqual(expectedPermission);
	});

	test("should throw an error if assigning permission to a non-existent role", () => {
		const permission = "edit:documents:*";
		expect(() => {
			roleManager.assignPermissionToRole("nonexistent_role", permission);
		}).toThrow(`Role with ID nonexistent_role not found.`);
	});

	test("should correctly check if a role has a specific permission", () => {
		const role = { id: "editor", name: "Editor", permissions: [] };
		roleManager.createRole(role);
		roleManager.assignPermissionToRole("editor", "view:documents");

		const user = {
			roles: ["editor"],
			permissions: [], // No direct permissions
		};

		const canViewDocuments = roleManager.hasPermission(user, "view:documents");
		expect(canViewDocuments).toBe(true);

		const canEditDocuments = roleManager.hasPermission(
			user,
			"edit:documents:*"
		);
		expect(canEditDocuments).toBe(false);
	});

	test("should correctly check if a user has a direct permission", () => {
		const user = {
			roles: [],
			permissions: ["edit:documents:1234"], // Direct permission
		};

		const canEditSpecificDocument = roleManager.hasPermission(
			user,
			"edit:documents:1234"
		);
		expect(canEditSpecificDocument).toBe(true);

		const canViewDocuments = roleManager.hasPermission(user, "view:documents");
		expect(canViewDocuments).toBe(false);
	});

	test("should authorize a super admin with a wildcard permission", () => {
		const role = { id: "super_admin", name: "Super Admin", permissions: [] };
		roleManager.createRole(role);
		roleManager.assignPermissionToRole("super_admin", "*");

		const user = {
			roles: ["super_admin"],
			permissions: [],
		};

		const canEditAnything = roleManager.hasPermission(user, "edit:documents");
		expect(canEditAnything).toBe(true);
	});
});
