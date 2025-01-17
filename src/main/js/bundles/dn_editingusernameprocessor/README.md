# dn_editingusernameprocessor

This bundle registers an EditorInterceptor that provides the current username to the editing bundle.

## Usage

Simply add the bundle "dn_editingusernameprocessor" to your app.

## Configuration Reference

```json
"dn_editingusernameprocessor": {
    "Config": {
        "setUserDelay": 500,
        "usernameField": "description",
        "creatorField": "",
        "usernameAttributes": [
            "givenname",
            "sn"
        ]
    }
}
```

| Property           | Type   | Possible Values | Default                   | Description                                                                                                                                                                                                                            |
|--------------------|--------|-----------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| setUserDelay       | Number |                 | ```500```                 | Delay before user name is set in milliseconds.                                                                                                                                                                                         |
| usernameField      | String |                 | ```""```                  | Define the username field.                                                                                                                                                                                                             |
| creatorField       | String |                 | ```""```                  | Define the creator field to save the user name to another attribute if a new features gets created. If this property has the value ```""``` the user name will be written to the username field in case of create and update workflow. |
| usernameAttributes | Array  |                 | ```["givenname", "sn"]``` | Configure the attributes that make up the username.                                                                                                                                                                                    |
