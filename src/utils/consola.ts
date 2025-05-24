import chalk from "chalk";

type LogLevel = "success" | "error" | "warning" | "info";

interface LoggerOptions {
  /**
   * Whether to show timestamp
   * @default true
   */
  timestamp?: boolean;
  /**
   * Custom time format
   * @default "HH:mm:ss"
   */
  timeFormat?: string;
  /**
   * Whether to output to console
   * @default true
   */
  console?: boolean;
  /**
   * Whether to colorize output
   * @default true
   */
  color?: boolean;
}

class Logger {
  private options: Required<LoggerOptions>;

  constructor(options: LoggerOptions = {}) {
    this.options = {
      timestamp: true,
      timeFormat: "HH:mm:ss",
      console: true,
      color: true,
      ...options,
    };
  }

  private getTimestamp(): string {
    if (!this.options.timestamp) return "";
    const now = new Date();
    return this.options.color
      ? chalk.gray(`[${now.toLocaleTimeString()}] `)
      : `[${now.toLocaleTimeString()}] `;
  }

  private formatMessage(level: LogLevel, ...messages: unknown[]): string {
    const timestamp = this.getTimestamp();
    const prefix = this.getPrefix(level);
    const formattedMessages = messages.map((msg) => {
      if (typeof msg === "object") {
        return this.options.color
          ? chalk.gray(JSON.stringify(msg, null, 2))
          : JSON.stringify(msg, null, 2);
      }
      return this.colorizeMessage(level, String(msg));
    });

    return `${timestamp}${prefix} ${formattedMessages.join(" ")}`;
  }

  private colorizeMessage(level: LogLevel, message: string): string {
    if (!this.options.color) return message;

    switch (level) {
      case "success":
        return chalk.green(message);
      case "error":
        return chalk.red(message);
      case "warning":
        return chalk.yellow(message);
      case "info":
        return chalk.cyan(message);
      default:
        return message;
    }
  }

  private getPrefix(level: LogLevel): string {
    if (!this.options.color) {
      switch (level) {
        case "success":
          return "[✓]";
        case "error":
          return "[✗]";
        case "warning":
          return "[!]";
        case "info":
          return "[i]";
        default:
          return "";
      }
    }

    switch (level) {
      case "success":
        return chalk.green("✓");
      case "error":
        return chalk.red("✗");
      case "warning":
        return chalk.yellow("!");
      case "info":
        return chalk.cyan("i");
      default:
        return "";
    }
  }

  success(...messages: unknown[]): void {
    this.log("success", messages, console.log);
  }

  error(...messages: unknown[]): void {
    this.log("error", messages, console.error);
  }

  warning(...messages: unknown[]): void {
    this.log("warning", messages, console.warn);
  }

  info(...messages: unknown[]): void {
    this.log("info", messages, console.info);
  }

  private log(
    level: LogLevel,
    messages: unknown[],
    output: (...args: unknown[]) => void
  ): void {
    if (!this.options.console) return;
    const message = this.formatMessage(level, ...messages);
    output(message);
  }
}

// Default logger instance
const logger = new Logger();

export { Logger, logger as default };
