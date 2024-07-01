///
/// Copyright (C) 2024 con terra GmbH (info@conterra.de)
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

import UsernameInterceptor from "../UsernameInterceptor";
import UserServiceMock from "./UserServiceMock";
import {Mutable, properties} from "apprt-core/Mutable";
import { assert } from "chai";

describe(module.id, () => {
    [
        {
            workflowType: "create",
            properties: {
                creatorField: "creator"
            },
            expected: {
                fieldName: "creator",
                value: "Bob Foo"
            },
            message: "If workflow type is 'create' and the 'creatorField' property is set, the creatorField field should be filled with the user name"
        },
        {
            workflowType: "create-features",
            properties: {
                creatorField: "creator"
            },
            expected: {
                fieldName: "creator",
                value: "Bob Foo"
            },
            message: "If workflow type is 'create-features' and the 'creatorField' property is set, the creatorField field should be filled with the user name"
        },
        {
            workflowType: "update",
            properties: {
                creatorField: "creator",
                usernameField: "Benutzer"
            },
            expected: {
                fieldName: "Benutzer",
                value: "Bob Foo"
            },
            message: "If workflow type is 'update' and the 'creatorField' property is set, the 'usernameField' should be filled with the user name"
        },
        {
            properties: {
                usernameField: "Benutzer"
            },
            expected: {
                fieldName: "Benutzer",
                value: "Bob Foo"
            },
            message: "If the 'creatorField' property is not set, the 'usernameField' should be filled with the user name"
        }
    ].forEach(testCase => {
        it(testCase.message, async () => {
            const usernameInterceptor = initUsernameInterceptor(testCase.properties);
            const editorWidget = mockEditorWidget(<WorkflowType>testCase.workflowType);

            await usernameInterceptor.interceptEditor(editorWidget);

            const featureFormViewModelMock = editorWidget.viewModel.featureFormViewModel;
            assert.equal(featureFormViewModelMock.hash.get(testCase.expected.fieldName), testCase.expected.value);
        });
    });
});

function initUsernameInterceptor(properties: Partial<UserNameInterceptorProperties> = {}) {
    const usernameInterceptor = new UsernameInterceptor();
    usernameInterceptor._userService = new UserServiceMock();
    const defaultProperties = <UserNameInterceptorProperties>{
        creatorField: "",
        usernameField: "kommentar",
        usernameAttributes: [
            "givenname",
            "sn"
        ]
    };
    usernameInterceptor._properties = Object.assign(defaultProperties, properties);
    return usernameInterceptor;
}

function mockEditorWidget(testWorkflowType: WorkflowType) {
    return {
        viewModel: new ViewModelMock(testWorkflowType)
    };
}

interface UserNameInterceptorProperties {
    usernameField: string;
    creatorField: string;
    usernameAttributes: string[]
}

class ViewModelMock extends Mutable {
    featureFormViewModel: FeatureFormViewModel;
    activeWorkflow: ActiveWorkflow = { type: "create" };

    constructor(testWorkflowType: WorkflowType) {
        super();
        this.featureFormViewModel = new FeatureFormViewModel();
        this.activeWorkflow.type = testWorkflowType;
    }
}

properties(ViewModelMock, {
    featureFormViewModel: null,
    activeWorkflow: null
});

class FeatureFormViewModel extends Mutable {
    hash: Map<string, string>;
    feature: any;

    constructor() {
        super();
        this.hash = new Map<string, string>();
        this.feature = {};
    }

    setValue(fieldName: string, value: string) {
        this.hash.set(fieldName, value);
    }
}

properties(FeatureFormViewModel, {
    feature: null
});

interface ActiveWorkflow {
    type: WorkflowType;
}

type WorkflowType = "create" | "create-features" | "update";
