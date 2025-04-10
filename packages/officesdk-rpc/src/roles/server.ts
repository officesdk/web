/**
 * Office SDK 跨窗口通信服务端。
 * 跨窗口通信基础设计为：运行编辑器的窗口视作服务端，提供编辑器基础服务。基于编辑器窗口，上层窗口可作为客户端请求编辑器的服务接口和状态，编辑器服务端可以同时对接若干个客户端，同时服务端所有功能都不应需要依赖客户端。
 * 客户端与服务端通过 postMessage 通信。
 *
 * 服务端需要提供：
 * 1. 服务端连接器，用于连接客户端。
 */
// spawn

import { connect, WindowMessenger } from 'penpal';
import type { RemoteProxy } from 'penpal';

import { getParentWindowOrThrow } from './window';
import { OfficeSdkRpcChannel, createConnectionServerProtocol } from './connection';
import type { ConnectionClientProtocol, ConnectionInvokeOptions } from './connection';
import { isClientNotAccessible } from '../errors';
import type { RPCServerProxy, RPCMethods } from './rpc';

export interface ServerOptions<TMethods extends RPCMethods> {
  /**
   * Subset of the allowedOrigins option in WindowMessenger.
   * ----
   * An array of strings defining to which origins
   * communication will be allowed. If not provided, communication will be
   * restricted to the origin of the current page. You may specify an allowed
   * origin of `*` to not restrict communication, but beware the risks of
   * doing so.
   */
  allowedOrigins?: string[];

  /**
   * 远程调用协议代理，用于生成客户端远程调用服务端的方法，
   * 需要保证服务端按照同样的 RPCMethods 协议提供方法实现
   */
  proxy: RPCServerProxy<TMethods>;
}

export async function serve<TMethods extends RPCMethods>(options: ServerOptions<TMethods>): Promise<string[]> {
  const { allowedOrigins, proxy } = options;

  let messenger: WindowMessenger;
  try {
    messenger = new WindowMessenger({
      remoteWindow: getParentWindowOrThrow(),
      allowedOrigins: allowedOrigins,
    });
  } catch (error) {
    if (isClientNotAccessible(error)) {
      // TODO:
      throw error;
    }

    throw error;
  }

  const clientIds = new Set<string>();

  let client: RemoteProxy<ConnectionClientProtocol> | undefined;

  const connection = connect<ConnectionClientProtocol>({
    messenger,
    channel: OfficeSdkRpcChannel,
    methods: createConnectionServerProtocol({
      clients: clientIds,
      onInvoke: (clientId, method, args, options?: ConnectionInvokeOptions) => {
        if (!client) {
          // TODO
          throw new Error('Unexpected invoke before client connected');
        }

        if (!clientIds.has(clientId)) {
          return;
        }

        debugger;
        // TODO:

        const methods = proxy({
          callback: client.callback,
        });

        // TODO: 引用类型
        return methods[method](...args, {
          clientId,
        });
      },
    }),
  });

  client = await connection.promise;

  const pulledIds = await client.open();

  pulledIds.forEach((id) => {
    clientIds.add(id);
  });

  return Array.from(clientIds);
}
