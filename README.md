# Editing-UserNameProcessor Bundle
This bundle registers a FeatureProcessor that provides the current user name to the editing bundle.

Sample App
------------------
http://www.mapapps.de/mapapps/resources/apps/downloads_editing_usernameprocessor/index.html

Installation Guide
------------------
**Requirement: map.apps 3.4.0**

**The user needs to be logged in to save the edited features!**

```
"dn_editingusernameprocessor": {
  "UserNameProcessor": {
    // define the username field
    "userNameField": "username",
    // select the attributes that make up the username
    // values: city, country, gender, givenname, loginName, mail, name, phonenumber, sn, street
    "usedNameAttributes": ["givenname", "sn"]
  }
}
```

More information about the FeatureProcessor:
https://developernetwork.conterra.de/en/documentation/mapapps/37/developers-documentation/editing

Development Guide
------------------
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`