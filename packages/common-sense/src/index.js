// Common Sense — Real-world validation middleware for AI agents

class CommonSense {
  constructor(options = {}) {
    this.checks = options.checks || [];
    this.customChecks = options.customChecks || {};
  }

  validate(action, context = {}) {
    const results = [];
    let allowed = true;
    let reason = null;

    for (const check of this.checks) {
      const result = this.runCheck(check, action, context);
      results.push(result);
      if (!result.passed) {
        allowed = false;
        reason = result.message;
        break;
      }
    }

    // Run custom checks
    for (const [name, fn] of Object.entries(this.customChecks)) {
      try {
        const result = fn(action, context);
        results.push({ check: name, passed: result, message: result ? 'OK' : `Failed: ${name}` });
        if (!result) {
          allowed = false;
          reason = `Failed: ${name}`;
          break;
        }
      } catch (e) {
        results.push({ check: name, passed: false, message: e.message });
        allowed = false;
        reason = e.message;
        break;
      }
    }

    return { allowed, reason, results };
  }

  runCheck(check, action, context) {
    switch (check) {
      case 'file_open':
        return { check, passed: !context.fileOpen, message: context.fileOpen ? 'File is open in another process' : 'OK' };
      case 'dependency_conflict':
        return { check, passed: !context.hasConflict, message: context.hasConflict ? 'Dependency conflict detected' : 'OK' };
      case 'disk_space':
        return { check, passed: (context.diskSpace || 100) > 10, message: (context.diskSpace || 100) <= 10 ? 'Low disk space' : 'OK' };
      case 'port_in_use':
        return { check, passed: !context.portInUse, message: context.portInUse ? 'Port already in use' : 'OK' };
      case 'process_running':
        return { check, passed: !context.processRunning, message: context.processRunning ? 'Process already running' : 'OK' };
      case 'env_var_missing':
        return { check, passed: !context.missingEnvVars, message: context.missingEnvVars ? 'Missing environment variables' : 'OK' };
      case 'version_conflict':
        return { check, passed: !context.versionConflict, message: context.versionConflict ? 'Version conflict detected' : 'OK' };
      default:
        return { check, passed: true, message: 'OK' };
    }
  }

  addCheck(check) {
    this.checks.push(check);
  }

  addCustomCheck(name, fn) {
    this.customChecks[name] = fn;
  }
}

module.exports = CommonSense;
module.exports.CommonSense = CommonSense;
module.exports.default = CommonSense;
