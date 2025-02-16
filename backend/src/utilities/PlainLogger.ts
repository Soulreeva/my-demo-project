import { ConsoleLogger, LogLevel } from '@nestjs/common';

export class PlainLogger extends ConsoleLogger {
  protected printMessages(
    messages: unknown[],
    context?: string,
    logLevel?: LogLevel,
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    messages.forEach((message) => {
      const contextMessage = (context && `[${context}] `) || '';
      const formattedLogLevel = logLevel.toUpperCase();
      const pid = process.pid;
      const formattedMessage = `${pid} ${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${message}\n`;
      process[
        writeStreamType !== null && writeStreamType !== void 0
          ? writeStreamType
          : 'stdout'
      ].write(formattedMessage);
    });
  }
}
