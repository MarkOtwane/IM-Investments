export const getPasswordResetTemplate = (
  resetToken: string,
  baseUrl: string,
) => {
  const resetLink = `${baseUrl}/reset-password/${resetToken}`;
  return {
    subject: 'Shopie Password Reset',
    text: `You requested a password reset. Click this link to reset your password: ${resetLink}. This link expires in 1 hour.`,
    html: `
        <h1>Shopie Password Reset</h1>
        <p>You requested a password reset for your Shopie account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        <p>Thank you,<br>The Shopie Team</p>
      `,
  };
};
