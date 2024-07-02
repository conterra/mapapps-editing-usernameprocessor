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
import Accessor from "esri/core/Accessor";
import { assert } from "chai";

describe(module.id, () => {
    ([
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
        },
        {
            workflowType: "create",
            initializationDelay: 40,
            properties: {
                creatorField: "creator"
            },
            expected: {
                fieldName: "creator",
                value: "Bob Foo"
            },
            message: "With initializationDelay: If workflow type is 'create' and the 'creatorField' property is set, the creatorField field should be filled with the user name"
        },
        {
            workflowType: "create-features",
            initializationDelay: 40,
            properties: {
                creatorField: "creator"
            },
            expected: {
                fieldName: "creator",
                value: "Bob Foo"
            },
            message: "With initializationDelay: If workflow type is 'create-features' and the 'creatorField' property is set, the creatorField field should be filled with the user name"
        },
        {
            workflowType: "update",
            initializationDelay: 40,
            properties: {
                creatorField: "creator",
                usernameField: "Benutzer"
            },
            expected: {
                fieldName: "Benutzer",
                value: "Bob Foo"
            },
            message: "With initializationDelay: If workflow type is 'update' and the 'creatorField' property is set, the 'usernameField' should be filled with the user name"
        },
        {
            initializationDelay: 40,
            properties: {
                usernameField: "Benutzer"
            },
            expected: {
                fieldName: "Benutzer",
                value: "Bob Foo"
            },
            message: "With initializationDelay: If the 'creatorField' property is not set, the 'usernameField' should be filled with the user name"
        }
    ] as TestCase[]).forEach(testCase => {
        it(testCase.message, async () => {
            const usernameInterceptor = initUsernameInterceptor(testCase.properties);
            const editorWidget = mockEditorWidget(<WorkflowType>testCase.workflowType, testCase.initializationDelay);

            usernameInterceptor.interceptEditor(editorWidget);

            await later(700);
            const featureFormViewModelMock = editorWidget.viewModel.featureFormViewModel;
            assert.equal(featureFormViewModelMock?.hash.get(testCase.expected.fieldName), testCase.expected.value);
        });
    });
});

function later(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

interface TestCase {
    workflowType: WorkflowType;
    initializationDelay?: number;
    properties: Partial<UserNameInterceptorProperties>;
    expected: {
        fieldName: string;
        value: string;
    };
    message: string;
}

interface UserNameInterceptorProperties {
    usernameField: string;
    creatorField: string;
    usernameAttributes: string[]
}

function createFeatureFormViewModel(featureDelay: number = 0) {
    const featureFormViewModel = new FeatureFormViewModel();
    if (featureDelay === 0) {
        featureFormViewModel.feature = {};
    } else {
        setTimeout(() => {
            featureFormViewModel.feature = {};
        }, featureDelay);
    }
    return featureFormViewModel;
}

const FeatureFormViewModel = (Accessor as any).createSubclass({
    properties: {
        feature: {}
    },

    setValue(fieldName: string, value: string) {
        if (!this.hash) {
            this.hash = new Map<string, string>();
        }
        this.hash.set(fieldName, value);
    }
});

const createViewModelMock = (testWorkflowType: WorkflowType, featureFormViewModelDelay: number = 0) => {
    const viewModelMock = new ViewModelMock();
    if (featureFormViewModelDelay === 0) {
        viewModelMock.featureFormViewModel = createFeatureFormViewModel(featureFormViewModelDelay);
    } else {
        setTimeout(() => {
            viewModelMock.featureFormViewModel = createFeatureFormViewModel(featureFormViewModelDelay);
        }, featureFormViewModelDelay);
    }

    viewModelMock.activeWorkflow = {
        type: testWorkflowType
    };
    return viewModelMock;
}

const ViewModelMock = (Accessor as any).createSubclass({
    properties: {
        featureFormViewModel: {},
        activeWorkflow: {}
    }
});

function mockEditorWidget(testWorkflowType: WorkflowType, initializationDelay: number = 0) {
    return {
        viewModel: createViewModelMock(testWorkflowType, initializationDelay)
    };
}

interface ActiveWorkflow {
    type: WorkflowType;
}

type WorkflowType = "create" | "create-features" | "update";
