export interface EmailService {
  send: (email: string, message: string) => Promise<void>;
}
