/**
 * An individual permission that can be granted to a user or role.
 */
export type Permission = {
	/**
	 * The unique identifier for the permission.
	 * @example "read:users", "write:documents", "delete:documents:123"
	 */
	id: string;

	/**
	 * The action of the permission.
	 * @example "read", "write", "delete"
	 */
	action: string;

	/**
	 * The resource that the permission applies to. This can be a specific resource or a wildcard.
	 * @example "users", "documents"
	 */
	resource: string;

	/**
	 * The scope of the resource. This can be used to further restrict the permission.
	 * @example a_document_id
	 */
	resourceScope?: string;
}

/**
 * A role that can be granted to a user.
 */
export type Role = {
	/**
	 * The unique identifier for the role.
	 */
	id: string;

	/**
	 * The descriptive name of the role.
	 */
	name: string;

	/**
	 * The permissions that are granted to users with this role.
	 */
	permissions: Permission[];
}
