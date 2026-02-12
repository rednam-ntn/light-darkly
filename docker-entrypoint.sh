#!/bin/sh
set -e

# If both BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD are set, enable Basic Auth
if [ -n "$BASIC_AUTH_USERNAME" ] && [ -n "$BASIC_AUTH_PASSWORD" ]; then
  echo "Basic Auth enabled for user: $BASIC_AUTH_USERNAME"
  htpasswd -cb /etc/nginx/.htpasswd "$BASIC_AUTH_USERNAME" "$BASIC_AUTH_PASSWORD"

  # Replace nginx config with auth-enabled version
  sed -i 's|# AUTH_BASIC_PLACEHOLDER|auth_basic "Light Darkly";|' /etc/nginx/conf.d/default.conf
  sed -i 's|# AUTH_BASIC_USER_FILE_PLACEHOLDER|auth_basic_user_file /etc/nginx/.htpasswd;|' /etc/nginx/conf.d/default.conf
else
  echo "Basic Auth disabled (BASIC_AUTH_USERNAME/BASIC_AUTH_PASSWORD not set)"
fi

exec "$@"
