export class ResendEmailDto {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
