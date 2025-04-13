export interface UrlOptions {
  /**
   * 服务器地址， OFFICE SDK 部署的地址
   */
  endpoint: string;
  /**
   * 用于鉴权的 token
   * TODO: 添加过期时间
   * TODO: 后端补充对应注释
   */
  token: string;
  /**
   * 文件 ID
   */
  fileId: string;

  /**
   * 语言
   */
  lang?: string;
}

/**
 * 获取支持的语言，过滤掉不支持的语言，返回支持的语言。
 * @param lang
 * @returns
 */
function getLang(lang?: string): string | null {
  const supportedLangs = ['en-US', 'zh-CN'];

  if (!lang) {
    return null;
  }

  if (supportedLangs.includes(lang)) {
    return lang;
  }

  // TODO: warn 传入的语言不支持

  return null;
}

/**
 * 生成 Office SDK 的 URL
 * @param options
 * @returns
 */
export function generateUrl(options: UrlOptions): URL {
  const { endpoint, token, fileId } = options;

  let url: URL;

  try {
    // Office SDK 的 URL 格式

    const path = '/v1/file/page';

    url = new URL(endpoint);
    // Check if the URL is valid
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      // TODO: 抛出自定义错误
      throw new Error('Invalid URL');
    }

    // TODO: path、params 支持配置
    url.pathname = path;

    url.searchParams.set('file_id', fileId);
    url.searchParams.set('token', token);

    const lang = getLang(options.lang);
    if (lang) {
      url.searchParams.set('lang', lang);
    }
  } catch (error) {
    // TODO: 抛出自定义错误
    throw error;
  }

  return url;
}
