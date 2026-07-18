<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
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

          {{-- Checkmark --}}
          <tr>
            <td style="padding-bottom:24px;">
              <div style="width:48px;height:48px;border-radius:50%;background-color:#ECFDF5;text-align:center;line-height:48px;">
                <span style="font-size:24px;">&#10003;</span>
              </div>
            </td>
          </tr>

          {{-- Heading --}}
          <tr>
            <td style="padding-bottom:16px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">
                Payment successful
              </h1>
            </td>
          </tr>

          {{-- Body --}}
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">
                Hi {{ $name }}, your <strong>{{ $planName }}</strong> subscription is now active. You have full access to all {{ $planName }} features.
              </p>
            </td>
          </tr>

          {{-- Details box --}}
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:13px;color:#6B7280;">Plan</span>
                        </td>
                        <td style="padding-bottom:12px;text-align:right;">
                          <span style="font-size:14px;font-weight:600;color:#111827;">Cursorline {{ $planName }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:13px;color:#6B7280;">Amount</span>
                        </td>
                        <td style="padding-bottom:12px;text-align:right;">
                          <span style="font-size:14px;font-weight:600;color:#111827;">{{ $amount }}/{{ $period }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <span style="font-size:13px;color:#6B7280;">Duration</span>
                        </td>
                        <td style="padding-bottom:12px;text-align:right;">
                          <span style="font-size:14px;font-weight:600;color:#111827;">{{ $startDate }} – {{ $endDate }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size:13px;color:#6B7280;">Subscription ID</span>
                        </td>
                        <td style="text-align:right;">
                          <span style="font-size:13px;font-family:'Courier New',Courier,monospace;color:#6B7280;">{{ $subscriptionId }}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {{-- Button --}}
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="{{ config('services.frontend.url', 'http://localhost:5173') }}/build" style="display:block;padding:16px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;text-align:center;">
                      Start coding
                    </a>
                  </td>
                </tr>
              </table>
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
                Questions? Reply to this email or visit our <a href="{{ config('services.frontend.url', 'http://localhost:5173') }}/contact" style="color:#2563EB;text-decoration:underline;">support page</a>. You can manage your subscription from your account settings.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
