#!/bin/bash

mkdir -p ~/.config/openstack

cat > ~/.config/openstack/clouds.yaml <<EOF
clouds:
  local:
    auth:
      auth_url: ${OS_AUTH_URL}
      username: ${OS_USERNAME}
      password: ${OS_PASSWORD}
      project_name: ${OS_PROJECT_NAME}
      user_domain_name: ${OS_USER_DOMAIN_NAME}
      project_domain_name: ${OS_PROJECT_DOMAIN_NAME}
    region_name: ${OS_REGION_NAME}
    interface: ${OS_INTERFACE}
    identity_api_version: ${OS_IDENTITY_API_VERSION}
    verify: false
EOF

chmod 600 ~/.config/openstack/clouds.yaml

echo "clouds.yaml created at ~/.config/openstack/clouds.yaml"

