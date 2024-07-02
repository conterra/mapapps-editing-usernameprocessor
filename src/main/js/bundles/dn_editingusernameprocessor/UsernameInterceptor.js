/*
 * Copyright (C) 2024 con terra GmbH (info@conterra.de)
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

export default class UsernameInterceptor {
    _userService;
    _properties = {};

    interceptEditor(editorWidget) {
        const properties = this._properties;
        const viewModel = editorWidget.viewModel;
        this.#getFeatureFormViewModelFromViewModel(viewModel).then(featureFormViewModel => {
            this.#getFeatureFromFeatureFormViewModel(featureFormViewModel).then(feature => {
                const workFlowType = viewModel.activeWorkflow.type;
                const username = this.getUserName();
                if (!feature || !username) {
                    return;
                }
                async(() => {
                    if (properties.creatorField && properties.creatorField !== "") {
                        switch (workFlowType) {
                            case "create":
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
                }, 500);
            });
        });
    }

    async #getFeatureFormViewModelFromViewModel(viewModel) {
        if (viewModel.featureFormViewModel) {
            return viewModel.featureFormViewModel;
        }
        return new Promise(resolve => {
            const watcher = viewModel.watch("featureFormViewModel", () => {
                if (viewModel.featureFormViewModel) {
                    watcher.remove();
                    resolve(viewModel.featureFormViewModel);
                }
            });
        });
    }

    async #getFeatureFromFeatureFormViewModel(featureFormViewModel) {
        if (featureFormViewModel.feature) {
            return featureFormViewModel.feature;
        }
        return new Promise(resolve => {
            const watcher = featureFormViewModel.watch("feature", () => {
                if (featureFormViewModel.feature) {
                    watcher.remove();
                    resolve(featureFormViewModel.feature);
                }
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
