export const ApiLogger = {
    logs: [] as any[],
    
    log: function(service: string, action: string, payload: any = null, type: string = 'info') {
        const timestamp = new Date().toISOString();
        
        let safePayload = null;
        if (payload !== null) {
            safePayload = this._sanitize(payload);
        }
        
        const logEntry = { timestamp, service, action, type, payload: safePayload };
        this.logs.push(logEntry);
        
        let icon = 'ℹ️';
        let color = '#00ffff'; 
        if (type === 'success') { icon = '✅'; color = '#00ff41'; }
        if (type === 'error') { icon = '❌'; color = '#ff0055'; }
        if (type === 'warning') { icon = '⚠️'; color = '#ffaa00'; }
        if (type === 'request') { icon = '📤'; color = '#a78bfa'; }
        if (type === 'response') { icon = '📥'; color = '#34d399'; }

        console.groupCollapsed(`%c${icon} [${service}] ${action}`, `color: ${color}; font-weight: bold; background: rgba(0,0,0,0.5); padding: 2px 4px; border-radius: 4px;`);
        console.log(`Time: ${timestamp}`);
        if (safePayload) console.dir(safePayload);
        console.groupEnd();
    },

    _sanitize: function(value: any, seen = new WeakSet()): any {
        if (value === null || typeof value !== 'object') {
            if (typeof value === 'string' && value.length > 500) {
                return `[STRING_TRUNCATED_FOR_LOGS: ${value.length} bytes]`;
            }
            return value;
        }
        
        if (value instanceof HTMLElement || value instanceof Event || (typeof value.constructor === 'function' && ['AudioContext', 'MediaStream', 'MediaRecorder'].includes(value.constructor.name))) {
            return `[${value.constructor.name}]`;
        }

        if (seen.has(value)) {
            return "[Circular Reference]";
        }
        seen.add(value);

        const isArray = Array.isArray(value);
        const isPlainObject = Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null;
        
        if (!isArray && !isPlainObject) {
            const objName = value.constructor ? value.constructor.name : 'Object';
            return `[Complex Object: ${objName}]`;
        }

        const result: any = isArray ? [] : {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                result[key] = this._sanitize(value[key], seen);
            }
        }
        return result;
    },

    exportLogs: function() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api_logs_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

if (typeof window !== 'undefined') {
    // @ts-ignore
    window.ApiLogger = ApiLogger;
}
