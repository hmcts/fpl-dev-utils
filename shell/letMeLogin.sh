#!/usr/bin/env bash

export https_proxy=proxyout.reform.hmcts.net:8080

curl -X PATCH \
  https://idam-api.aat.platform.hmcts.net/testing-support/services/CCD \
  -H 'Content-Type: application/json' \
  -d '[ {
    "operation": "add",
    "field": "redirect_uri",
    "value": "https://case-management-web-fpl-case-service-pr-'"$1"'.service.core-compute-preview.internal/oauth2redirect"
    } ]'

export https_proxy=

