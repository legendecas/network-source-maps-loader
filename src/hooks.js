import { debuglog } from 'node:util';

const debug = debuglog('network-source-maps-loader');

const kSourceMappingURLMagicComment = /\/[*/]#\s+sourceMappingURL=(?<sourceMappingURL>[^\s]+)/g;
const kSupportedFormats = ['commonjs', 'module'];
const kSupportedProtocols = ['http:', 'https:'];

function extractSourceMapURLMagicComment(content) {
  let match;
  let lastMatch;
  // A while loop is used here to get the last occurrence of sourceMappingURL.
  // This is needed so that we don't match sourceMappingURL in string literals.
  while ((match = kSourceMappingURLMagicComment.exec(content))) {
    lastMatch = match;
  }
  if (lastMatch == null) {
    return null;
  }
  return {
    index: lastMatch.index,
    length: lastMatch[0].length,
    sourceMappingURL: lastMatch.groups.sourceMappingURL,
  };
}

async function resolveSourceMapByURL(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const content = await response.arrayBuffer();
  const base64Content = Buffer.from(content).toString('base64');
  return `data:application/json;charset=utf-8;base64,${base64Content}`;
}

function constructSourceMapURLMagicComment(sourceMappingURL) {
  return `//# sourceMappingURL=${sourceMappingURL}`;
}

export async function load(url, context, nextLoad) {
  debug('load', url);
  const result = await nextLoad(url, context);
  if (!kSupportedFormats.includes(result.format)) {
    return result;
  }
  const match = extractSourceMapURLMagicComment(result.source);
  if (match == null) {
    return result;
  }
  debug('matched source mapping url for %s', url, match);

  const { index, length, sourceMappingURL } = match;
  const resolvedURL = new URL(sourceMappingURL, url);
  if (!kSupportedProtocols.includes(resolvedURL.protocol)) {
    debug('unsupported protocol', resolvedURL.protocol);
    return result;
  }
  try {
    const resolvedSourceMappingURL = await resolveSourceMapByURL(resolvedURL);
    result.source = result.source.slice(0, index) + constructSourceMapURLMagicComment(resolvedSourceMappingURL) + result.source.slice(index + length);
  } catch (e) {
    debug(e);
    return result;
  }
  debug('resolved source mapping url for %s', url, result);
  return result;
}
