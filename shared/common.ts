var matchHtmlRegExp = /"|'|&(?!amp;|quot;|#39;|lt;|gt;|#46;|#36;)|<|>/;
var matchLessHtmlRegExp = /[<>]/;

/**
 * Check if string is a valid json
 * @param {string} input - string that might be json encoded
 * @returns {object} with property data for parsed data and property valid to check if it was valid json encoded string or not
 **/
function getJSON(input: string): Record<string, any> {
    var output: any = { valid: false };

    try {
        output.data = JSON.parse(input);
        if (output.data && typeof output.data === 'object') output.valid = true;
    } catch (ex) {
        // silent error
    }

    return output;
}

/**
 * Escape special characters in the given string of html.
 * @param  {string} string - The string to escape for inserting into HTML
 * @param  {bool} more - if false, escapes only tags, if true escapes also quotes and ampersands
 * @returns {string} escaped string
 **/
const escape_html = function (string: string, more: boolean): string {
    var str = '' + string;
    var match;

    if (more) match = matchHtmlRegExp.exec(str);
    else match = matchLessHtmlRegExp.exec(str);

    if (!match) return str;

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 39: // '
                escape = '&#39;';
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
                break;
            default:
                continue;
        }

        if (lastIndex !== index) html += str.substring(lastIndex, index);

        lastIndex = index + 1;
        html += escape;
    }

    return (lastIndex !== index ? html + str.substring(lastIndex, index) : html) as string;
};

function escape_html_entities_replacer(this: any, key: string, value: any) {
    return escape_html_entities(key, value, false);
}

/**
 * Escape special characters in the given value, may be nested object
 * @param  {string} key - key of the value
 * @param  {vary} value - value to escape
 * @param  {bool} more - if false, escapes only tags, if true escapes also quotes and ampersands
 * @returns {vary} escaped value
 **/
function escape_html_entities(key: any, value: any, more: any): any {
    if (
        typeof value === 'object' &&
        value &&
        (value.constructor === Object || value.constructor === Array)
    ) {
        if (Array.isArray(value)) {
            let replacement = [];

            for (let k = 0; k < value.length; k++) {
                if (typeof value[k] === 'string') {
                    let ob = getJSON(value[k]);
                    if (ob.valid) {
                        replacement[parseInt(escape_html(String(k), more))] = JSON.stringify(
                            escape_html_entities(k, ob.data, more)
                        );
                    } else {
                        replacement[k] = escape_html(value[k], more);
                    }
                } else {
                    replacement[k] = escape_html_entities(k, value[k], more);
                }
            }

            return replacement;
        } else {
            let replacement: any = {};

            for (let k in value) {
                if (Object.hasOwnProperty.call(value, k)) {
                    if (typeof value[k] === 'string') {
                        let ob = getJSON(value[k]);

                        if (ob.valid) {
                            replacement[escape_html(k, more)] = JSON.stringify(
                                escape_html_entities(k, ob.data, more)
                            );
                        } else {
                            replacement[escape_html(k, more)] = escape_html(value[k], more);
                        }
                    } else {
                        replacement[escape_html(k, more)] = escape_html_entities(k, value[k], more);
                    }
                }
            }

            return replacement;
        }
    }

    return value;
}

/**
 * Get IP address from request object
 * @param {req} req - nodejs request object
 * @returns {string} ip address
 */
const getIpAddress = function (req: any): string | null {
    var ipAddress = req
        ? req.headers['x-forwarded-for'] ||
          req.headers['x-real-ip'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : '')
        : '';

    /* Since x-forwarded-for: client, proxy1, proxy2, proxy3 */
    var ips = ipAddress.split(',');
    if (req.headers['x-real-ip']) ips.push(req.headers['x-real-ip']);

    var ip = null;
    for (var i = ips.length - 1; i >= 0; i--) {
        ips[i] = stripPort(ips[i]);

        if (ips[i] !== '127.0.0.1') {
            ip = ips[i];
            break;
        }
    }

    return ip;
};

/**
 *  This function takes ipv4 or ipv6 with possible port, removes port information and returns plain ip address
 *  @param {string} ip - ip address to check for port and return plain ip
 *  @returns {string} plain ip address
 */
function stripPort(ip: any): string {
    var parts = (ip + '').split('.');

    //check if ipv4
    if (parts.length === 4) {
        return ip.split(':')[0].trim();
    } else {
        parts = (ip + '').split(':');

        if (parts.length === 9) {
            parts.pop();
        }

        if (parts.length === 8) {
            ip = parts.join(':');

            //remove enclosing [] for ipv6 if they are there
            if (ip[0] === '[') {
                ip = ip.substring(1);
            }

            if (ip[ip.length - 1] === ']') {
                ip = ip.slice(0, -1);
            }
        }
    }

    return (ip + '').trim();
}

/**
 * Cleans any object of any given special characters.
 * @param  {Object} obj - The object to clean
 * @returns {Object} cleaned object
 **/
function cleanObject(obj: Object) {
    return JSON.parse(JSON.stringify(obj, escape_html_entities_replacer));
}

function localToISO(date: Date): string {
    const offsetInMinutes = date.getTimezoneOffset();
    const offsetInMilliSeconds = offsetInMinutes * 60 * 1000;
    const localDate = new Date(date.getTime() - offsetInMilliSeconds);

    return localDate.toISOString();
}

function toMetadata(obj: Object) {
    return JSON.parse(
        JSON.stringify(obj, (_, value) => (typeof value === 'bigint' ? value.toString() : value))
    );
}

export default { getIpAddress, localToISO, toMetadata, cleanObject };
