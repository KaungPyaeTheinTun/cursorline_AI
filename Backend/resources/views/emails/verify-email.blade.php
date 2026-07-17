<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          {{-- Logo --}}
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#111827;">
                cursor<span style="color:#2563EB;">line</span>
              </span>
            </td>
          </tr>

          {{-- Heading --}}
          <tr>
            <td style="padding-bottom:16px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">
                Verify your email address
              </h1>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">
                Click the button below to verify your email and start using Cursorline.
              </p>
            </td>
          </tr>

          {{-- Button --}}
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ $url }}" style="display:block;padding:16px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;text-align:center;">
                      Verify email address
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- Fallback link --}}
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6B7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:8px 0 0;">
                <a href="{{ $url }}" style="font-size:14px;color:#2563EB;text-decoration:underline;word-break:break-all;">{{ $url }}</a>
              </p>
            </td>
          </tr>

          {{-- Divider --}}
          <tr>
            <td style="padding-bottom:24px;">
              <div style="border-top:1px solid #E5E7EB;"></div>
            </td>
          </tr>

          {{-- Footer --}}
          <tr>
            <td>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#9CA3AF;">
                You received this email because someone signed up for a Cursorline account with this email address. If this wasn't you, you can ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
