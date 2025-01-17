/*
 * Copyright (C) 2025 con terra GmbH (info@conterra.de)
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

    #watcher = null;

    _userService;
    _properties = {};

    deactivate() {
        this.#watcher?.remove();
        this.#watcher = null;
    }

    interceptEditor(editorWidget) {
        this.#watcher?.remove();
        this.#watcher = null;
        const properties = this._properties;
        const viewModel = editorWidget.viewModel;
        if (viewModel.featureFormViewModel) {
            this.#getFeatureFromFeatureFormViewModel(viewModel.featureFormViewModel).then((feature) => {
                this.#setUserName(feature, viewModel, viewModel.featureFormViewModel, properties);
            });
        }
        // Create watcher to watch for changed featureFormViewModel
        this.#watcher = viewModel.watch("featureFormViewModel", async (featureFormViewModel) => {
            if (featureFormViewModel) {
                const feature = await this.#getFeatureFromFeatureFormViewModel(featureFormViewModel);
                this.#setUserName(feature, viewModel, featureFormViewModel, properties);
            }
        });
    }

    #setUserName(feature, viewModel, featureFormViewModel, properties) {
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
        }, properties.setUserDelay);
    }

    #getFeatureFromFeatureFormViewModel(featureFormViewModel) {
        return new Promise(resolve => {
            if (featureFormViewModel.feature) {
                resolve(featureFormViewModel.feature);
            }
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
