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

## JS scripts

### Append audit

A script to append fingerprints to the audit.json from a report given by the glue step of the security scan.

#### Usage

```bash
yarn run audit -- -i path/to/report -a path/to/audit -f FINGERPRINT_1,FINGERPRINT_2... [-f FINGERPRINT_3]
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
