
## How to use these scripts
| Command | Description |
| --- | --- |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C999` | Remove companies with that contains the string 'zebra-'. |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C888` | Remove WhatsApp Entitlement from user. |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C777` | Assign WhatsApp Entitlement to user. |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C666` | Remove Twilio number from user. |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C555` | Assign Twilio number to user. |

| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C333` | Receive mock twilio sms messages/attachments. |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C222` | Receive mock whatsApp sms messages/attachments. |
| `SCRIPT=TRUE SERVER=cpqa2-va1 npx playwright test -g C111` | Receive mock Bandwidth(Grouptext) messages/attachments. |
```