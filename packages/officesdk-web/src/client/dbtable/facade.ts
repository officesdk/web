import type { Client } from '@officesdk/rpc';
import type { DatabaseTableMethods } from '../../shared';

export interface DatabaseTableFacade {
  // TODO:
}

export function createDatabaseTableFacade(client: Client<DatabaseTableMethods>): DatabaseTableFacade {
  return {
    // TODO:
  };
}
