// We want to validate all urls, including urls that are using localhost or any ip address (v4 or v6), along with a port, with any path or parameters too
export const VALID_TARGET_REGEX =
    /^(https?:\/\/)?([\w-]+\.)*([a-zA-Z0-9\.\-]+)(:\d+)?(\/[^\s]*)*(\?.*)?$/

// Match urls that do not have https but should be https (meaning domain only)
export const HTTPS_URL_REGEX = /^(https?:\/\/)?([\w-]+\.)*([a-zA-Z0-9\.\-]+)$/
// Match urls that do not have http but should be http (localhost or ip address)
export const HTTP_URL_REGEX =
    /^(https?:\/\/)?(localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[^\s]*)*(\?.*)?$/
