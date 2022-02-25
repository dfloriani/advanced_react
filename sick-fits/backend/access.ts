import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check (yes or no)
export const permissions = {
  ...generatedPermissions,
  /* using spread because we can add permissions here
  on top of the ones generated, see the "isAwesome" example */
};

// Rule based functions
/* Rules can return a boolean (yes or no) or a filter
which limits which products they can CRUD */
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. do they have permissions of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own this item?
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true; // read everything
    }
    // see available products (based on the status field)
    return { status: 'AVAILABLE' };
  },
};
