/*
 * Copyright (C) 2023 con terra GmbH (info@conterra.de)
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
import async from "apprt-core/async";
import UserServiceMock from "./UserServiceMock";

export default class UsernameInterceptor {

    #featureWatcher = null;
    #featureFormViewModelWatcher = null;
    _userService = new UserServiceMock();  // This will be replaced with the UserService from the framework

    interceptEditor(editorWidget) {
        const viewModel = editorWidget.viewModel;
        this.#featureFormViewModelWatcher?.remove();
        this.#featureFormViewModelWatcher = viewModel.watch("featureFormViewModel", () => {
            const featureFormViewModel = viewModel.featureFormViewModel;
            if (!featureFormViewModel) {
                return;
            }
            const properties = this._properties;
            this.#featureWatcher?.remove();
            this.#featureWatcher = featureFormViewModel.watch("feature", (feature) => {
                const workFlowType = viewModel.activeWorkflow.type;
                const username = this.getUserName();
                if (!feature || !username) {
                    return;
                }
                async(() => {
                    if (properties.creatorField && properties.creatorField !== "") {
                        switch (workFlowType) {
                            case "create":
                                featureFormViewModel.setValue(properties.creatorField, username);
                                break;
                            case "create-features":
                                featureFormViewModel.setValue(properties.creatorField, username);
                                break;
                            case "update":
                                featureFormViewModel.setValue(properties.usernameField, username);
                                break;
                        }
                    } else {
                        featureFormViewModel.setValue(properties.usernameField, username);
                    }

                    //feature.setAttribute(this._properties.usernameField, username);
                    //featureFormViewModel.submit();
                    //featureFormViewModel.emit("value-change");
                }, 500);
            });
        });
    }

    getUserName() {
        const authentication = this._userService.getAuthentication();
        if (!authentication.isAuthenticated()) {
            console.info("User not authenticated!");
            return;
        }
        const user = authentication.getUser();
        let username = "";
        this._properties.usernameAttributes.forEach(function (nameAttribute) {
            username += user.get(nameAttribute);
            username += " ";
        });
        username = username.trim();
        if (username.length === 0) {
            username = user.getName();
        }
        return username;
    }

}
