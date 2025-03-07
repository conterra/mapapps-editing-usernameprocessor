///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import {Authentication, User} from "apprt/api";

/**
 * This class is used to test the UserNameInterceptor class without having to set up security on the local dev server.
 */
export default class UserServiceMock {
    getAuthentication(): Partial<Authentication> {
        return {
            isAuthenticated: () => true,
            getUser: () => new UserMock()
        };
    }
}

class UserMock implements User {
    get(attrName: string): string {
        if (attrName === "givenname") {
            return "Bob";
        }
        if (attrName === "sn") {
            return "Foo";
        }
        return "";
    }

    getName(): string {
        return "testUserName";
    }

    [key: string]: unknown;
}
