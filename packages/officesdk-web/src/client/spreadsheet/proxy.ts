import type { RPCClientProxy } from '@officesdk/rpc';
import type { SpreadsheetMethods } from '../../shared';

export function createSpreadsheetProxy(): RPCClientProxy<SpreadsheetMethods> {
  return (context) => {
    // const { invoke } = context;

    return {};
  };
}
