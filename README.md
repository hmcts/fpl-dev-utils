# fpl-dev-utils

Place to keep useful scripts for FPLA dev

## Tips

To quickly access the shell scripts add this into your .zshrc

```bash
path+=('/Users/your/path/here/fpl-dev-utils/shell')
```

or if you are using bash

```bash
export PATH=/Users/your/path/here/fpl-dev-utils/shell:$PATH
```

## Bash scripts

### Let me log in

Occasionally during the deployment of your PR to the preview clusters the idam redirection script may fail, this results in an inability to login to the web service that is built (error message is username and password is incorrect).

To fix this you can either log in to [idam aat portal](https://idam-web-admin.aat.platform.hmcts.net/) (requires VPN and proxy) (log in details provided by the team) and navigate to services and then XUI/CCD and in the redirect URI text area search for your preview URI (e.g. `http://xui-fpl-case-service-pr-PR_NUM.service.core-compute-preview.internal/oauth2/callback`) you can also add the URI here if it isn't present.

An alternative to this is the `letMeLogin` script. Here you just need to ensure that your VPN is running and then running the command
```bash
./letMeLogin PR_NUM [xui|ccd]
```
where `PR_NUM` is your pull request number and then choosing between `xui` or `ccd` for the service to add the redirect to (if left blank then it will add to both)

## JS scripts

### Append audit

A script to append fingerprints to the audit.json from a report given by the glue step of the security scan.

#### Usage

```bash
yarn run audit -i /full/path/to/report -a /full/path/to/audit -f FINGERPRINT_1,FINGERPRINT_2... [-f FINGERPRINT_3]
```

The full fingerprint isn't required just something to uniquely identify it (normally the fingerprint code)

#### Expected report format
```json
[
  {
    "some_field": "is ignored",
    "fingerprint": "FINGERPRINT"
  }
]
```

#### Expected audit format
```json
{
  "FINGERPRINT": "ignore"
}
```
