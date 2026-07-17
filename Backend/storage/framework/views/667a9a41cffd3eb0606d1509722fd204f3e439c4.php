<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Usage Expired</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          
          <tr>
            <td style="padding-bottom:32px;">
              <span style="font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#111827;">
                cursor<span style="color:#2563EB;">line</span>
              </span>
            </td>
          </tr>

          
          <tr>
            <td style="padding-bottom:24px;">
              <div style="width:48px;height:48px;border-radius:50%;background-color:#FEF3C7;text-align:center;line-height:48px;">
                <span style="font-size:24px;">&#9888;</span>
              </div>
            </td>
          </tr>

          
          <tr>
            <td style="padding-bottom:16px;">
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">
                Your <?php echo e($planName); ?> access has expired
              </h1>
            </td>
          </tr>

          
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">
                Hi <?php echo e($name); ?>, your free trial period has ended. To continue using Cursorline's AI assistant, please subscribe to a plan that fits your needs.
              </p>
            </td>
          </tr>

          
          <tr>
            <td style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-radius:8px;background-color:#2563EB;">
                    <a href="<?php echo e(config('services.frontend.url', 'http://localhost:5173')); ?>/#pricing" style="display:block;padding:16px 24px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;text-align:center;">
                      View Plans
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          
          <tr>
            <td style="padding-bottom:24px;">
              <div style="border-top:1px solid #E5E7EB;"></div>
            </td>
          </tr>

          
          <tr>
            <td>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#9CA3AF;">
                Questions? Reply to this email or visit our <a href="<?php echo e(config('services.frontend.url', 'http://localhost:5173')); ?>/contact" style="color:#2563EB;text-decoration:underline;">support page</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\New folder\Backend\resources\views/emails/usage-exceeded.blade.php ENDPATH**/ ?>