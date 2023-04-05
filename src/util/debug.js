let flex = {}

flex.console = {
  warn(msg, {
    silent = false,
    debug = false
  }) {
    if ((!silent || debug)) {
      console.warn('[Flex warn]: ' + msg)
      /* istanbul ignore if */
      if (debug) {
        console.warn((new Error('Warning Stack Trace')).stack)
      }
    }
  }
}