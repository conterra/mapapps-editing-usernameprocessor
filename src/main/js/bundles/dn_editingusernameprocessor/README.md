# dn_editingusernameprocessor

This bundle registers an EditorInterceptor that provides the current username to the editing bundle.

## Usage

Simply add the bundle "dn_editingusernameprocessor" to your app.

## Configuration Reference

```json
"dn_editingusernameprocessor": {
    "Config": {
        "userNameField": "description",
        "usedNameAttributes": [
            "givenname",
            "sn"
        ]
    }
}
```

| Property                       | Type               | Possible Values                    | Default                              | Description                                         |
|--------------------------------|--------------------|------------------------------------|--------------------------------------|-----------------------------------------------------|
| userNameField                  | String             |                                    | ```""```                             | Define the username field.                          |
| usedNameAttributes             | Array              |                                    | ```["givenname", "sn"]```            | Configure the attributes that make up the username. |
