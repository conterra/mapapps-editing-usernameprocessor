/*
 * Copyright (C) 2015 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    "dojo/_base/declare",
    "ct/Exception"
], function (declare, Exception) {
    return declare([], {
        process: function (context, nextProcessor) {
            var properties = this._properties || {};
            var graphic = context.graphic;
            var attributes = graphic.attributes;
            var fieldName = properties.userNameField;
            var authentication = this.userService.getAuthentication();
            if (!authentication.isAuthenticated()) {
                throw Exception.illegalStateError("UserNameProcessor: User not authenticated!");
            }
            var user = authentication.getUser();
            var username = (user.get("givenname") + " " + user.get("sn")).trim();
            if (username.length === 0) {
                username = user.getName();
            }
            attributes[fieldName] = username;
            return nextProcessor(context);
        }
    });
});