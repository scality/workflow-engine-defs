// @flow

type WorkflowEnginePoint = {
    id: string,
    _class: string,
    selected: boolean,
    x: number,
    y: number,
};

type WorkflowEngineLink = {
    id: string,
    _class: string,
    selected: boolean,
    type: string,
    source: string,
    sourcePort: string,
    target: string,
    targetPort: string,
    points: Array<WorkflowEnginePoint>,
    extras: {},
};

type WorkflowEnginePort = {
    id: string,
    _class: string,
    selected: boolean,
    name: string,
    parentNode: string,
    links: Array<string>,
    in: boolean,
    label: string,
};

type WorkflowEngineNode = {
    id: string,
    _class: string,
    selected: boolean,
    type: string,
    x: number,
    y: number,
    extras: {},
    ports: Array<WorkflowEnginePort>,
    name: string,
    color: string,
    // extensions from react-js-diagrams:
    subType: string,
    script: string,
    key: string,
    value: string,
    cronRule: string,
    operator: string,
    func: string,
    asynchronous: boolean,
    endpoint: string,
    postData: boolean,
};

type WorkflowEngineModel = {
    offsetX: number,
    offsetY: number,
    nameCounter: number,
    zoom: number,
    links: Array<WorkflowEngineLink>,
    nodes: Array<WorkflowEngineNode>,
};

type WorkflowEngineValidationResult = {
    isValid: boolean,
};

type WorkflowEngineValidationError = {
    isValid: boolean,
    message: string,
};

class WorkflowEngineDefs {
    model: WorkflowEngineModel;

    get TYPE_DATA() {
        return 'data';
    }

    get TYPE_SEARCH() {
        return 'search';
    }

    get TYPE_TAG() {
        return 'tag';
    }

    get TYPE_DECISION() {
        return 'decision';
    }

    get TYPE_FUNCTION() {
        return 'function';
    }

    get TYPE_STOPPER() {
        return 'stopper';
    }

    get TYPE_UPDATE() {
        return 'update';
    }

    get SUB_TYPE_BASIC() {
        return 'basic';
    }

    get SUB_TYPE_ADVANCED() {
        return 'advanced';
    }

    get SUB_TYPE_FISSION() {
        return 'fission';
    }

    get SUB_TYPE_AWS_LAMBDA() {
        return 'aws_lambda';
    }

    get SUB_TYPE_AZURE_FUNCTION() {
        return 'azure_function';
    }

    get SUB_TYPE_GOOGLE_CLOUD_FUNCTION() {
        return 'google_cloud_function';
    }

    get _GUARD() {
        return '_ZENKO_WORKFLOW_GUARD';
    }

    get dataSubTypes() {
        return [this.SUB_TYPE_BASIC, this.SUB_TYPE_ADVANCED];
    }

    get searchSubTypes() {
        return [this.SUB_TYPE_BASIC, this.SUB_TYPE_ADVANCED];
    }

    get tagSubTypes() {
        return [this.SUB_TYPE_BASIC, this.SUB_TYPE_ADVANCED];
    }

    get decisionSubTypes() {
        return [this.SUB_TYPE_BASIC, this.SUB_TYPE_ADVANCED];
    }

    get decisionBasicOperators() {
        return ['==', '!=', '<', '<=', '>', '>=', 'LIKE'];
    }

    get functionSubTypes() {
        return [this.SUB_TYPE_FISSION,
            this.SUB_TYPE_AWS_LAMBDA,
            this.SUB_TYPE_AZURE_FUNCTION,
            this.SUB_TYPE_GOOGLE_CLOUD_FUNCTION];
    }

    get stopperSubTypes() {
        return [];
    }

    get updateSubTypes() {
        return [];
    }

    getDefaultDataSubType() {
        return this.dataSubTypes[0];
    }

    getDefaultSearchSubType() {
        return this.searchSubTypes[0];
    }

    getDefaultTagSubType() {
        return this.tagSubTypes[0];
    }

    getDefaultDecisionSubType() {
        return this.decisionSubTypes[0];
    }

    getDefaultFunctionSubType() {
        return this.functionSubTypes[0];
    }

    getDefaultStopperSubType() {
        return '';
    }

    getDefaultUpdateSubType() {
        return '';
    }

    constructor(model: WorkflowEngineModel = {}) {
        this.model = model;
    }

    generateNewModel() {
        return {
            offsetX: 0,
            offsetY: 0,
            nameCounter: 0,
            zoom: 100,
            links: [],
            nodes: [],
        };
    }

    setModel(model: WorkflowEngineModel) {
        this.model = model;
    }

    /** Find node with given ID
     *
     * @param {string} nodeId node ID
     *
     * @return {object} node if found else null
     */
    findNode(nodeId: string): ?WorkflowEngineNode {
        // eslint-disable-next-line no-restricted-syntax
        for (const node of this.model.nodes) {
            if (node.id === nodeId) {
                return node;
            }
        }
        return null;
    }

    /** Find node by name
     *
     * @param {string} name node name
     *
     * @return {object} node if found else null
     */
    findNodeByName(name: string): ?WorkflowEngineNode {
        // eslint-disable-next-line no-restricted-syntax
        for (const node of this.model.nodes) {
            if (node.name === name) {
                return node;
            }
        }
        return null;
    }

    /** Find nodes of type type
     *
     * @param {string} type the type of node
     *
     * @return {array} nodes if found else []
     */
    findNodes(type: string): Array<WorkflowEngineNode> {
        const nodes = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const node of this.model.nodes) {
            if (node.type === type) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    /** Find next nodes in the graph given node
     *
     * @param {object} refNode the reference node
     * @param {string} name if provided restrict to next nodes
     * bound to specified port name
     *
     * @return {array} nodes if found else []
     */
    findNextNodes(refNode: WorkflowEngineNode, name: ?string): Array<string> {
        const nextNodes = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const port of refNode.ports) {
            if (!port.in) {
                if (name !== undefined) {
                    if (port.name !== name) {
                        continue;
                    }
                }
                // eslint-disable-next-line no-restricted-syntax
                for (const linkId of port.links) {
                    const link = this.findLink(linkId);
                    if (link) {
                        const _node = this.findNode(link.target);
                        if (_node) {
                            nextNodes.push(_node.id);
                        }
                    }
                }
            }
        }
        return nextNodes;
    }

    /** Find prev nodes in the graph given node
     *
     * @param {object} refNode the reference node
     * @param {string} name if provided restrict to next nodes
     * bound to specified port name
     *
     * @return {array} nodes if found else []
     */
    findPrevNodes(refNode: WorkflowEngineNode, name: ?string): Array<string> {
        const prevNodes = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const port of refNode.ports) {
            if (port.in) {
                if (name !== undefined) {
                    if (port.name !== name) {
                        continue;
                    }
                }
                // eslint-disable-next-line no-restricted-syntax
                for (const linkId of port.links) {
                    const link = this.findLink(linkId);
                    if (link) {
                        const _node = this.findNode(link.source);
                        if (_node) {
                            prevNodes.push(_node.id);
                        }
                    }
                }
            }
        }
        return prevNodes;
    }

    /** Find link with given ID
     *
     * @param {string} linkId link ID
     *
     * @return {object} link if found else null
     */
    findLink(linkId: string): ?WorkflowEngineLink {
        // eslint-disable-next-line no-restricted-syntax
        for (const link of this.model.links) {
            if (link.id === linkId) {
                return link;
            }
        }
        return null;
    }

    /** Find node port with given ID
     *
     * @param {object} node node
     * @param {string} portId port ID
     *
     * @return {object} port if found else null
     */
    findNodePort(node: WorkflowEngineNode, portId: string): ?WorkflowEnginePort {
        // eslint-disable-next-line no-restricted-syntax
        for (const port of node.ports) {
            if (port.id === portId) {
                return port;
            }
        }
        return null;
    }

    _isCyclicInternal(node: WorkflowEngineNode, visited: {}, nodeStack: {}): boolean {
        // we assume model has been checkModel() previously
        if (visited[node.id] === undefined) {
            // eslint-disable-next-line no-param-reassign
            visited[node.id] = true;
            // eslint-disable-next-line no-param-reassign
            nodeStack[node.id] = true;
            // iterate over adjacent nodes
            // eslint-disable-next-line no-restricted-syntax
            for (const port of node.ports) {
                // eslint-disable-next-line no-restricted-syntax
                for (const linkId of port.links) {
                    const link = this.findLink(linkId);
                    if (link) {
                        let _node = this.findNode(link.source);
                        if (_node) {
                            if (_node.id !== node.id) {
                                continue;
                            }
                        }
                        _node = this.findNode(link.target);
                        if (_node) {
                            if (!(visited[_node.id] === true) &&
                                this._isCyclicInternal(_node, visited,
                                    nodeStack)) {
                                return true;
                            } else if (nodeStack[_node.id] === true) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line no-param-reassign
        nodeStack[node.id] = false;
        return false;
    }

    /** Check if the graph is cyclic
     *
     * @returns {boolean} true if graph is cyclic
     */
    _isCyclic(): boolean {
        const visited = {};
        const nodeStack = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const node of this.model.nodes) {
            if (this._isCyclicInternal(node, visited, nodeStack)) {
                return true;
            }
        }
        return false;
    }

    /** Check the validity of the model
     *
     * @return {undefined}
     */
    checkModel(): WorkflowEngineValidationResult | WorkflowEngineValidationError {
        let foundSource = false;
        // check nodes
        // eslint-disable-next-line no-restricted-syntax
        for (const node of this.model.nodes) {
            // every node shall have an ID
            if (node.id === undefined) {
                return {
                    isValid: false,
                    message: 'missing node id',
                };
            }
            // check that types have their own properties
            if (node.type === undefined) {
                return {
                    isValid: false,
                    message: 'missing node type',
                };
            }
            if (node.type === this.TYPE_DATA) {
                if (foundSource) {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}" only one source per workflow`,
                    };
                }
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    if (node.script === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" data missing filter script`,
                        };
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" data missing bucket`,
                        };
                    }
                    // value can actually be undefined meaning *
                } else {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}": ${node.subType} not supported`,
                    };
                }
                foundSource = true;
            } else if (node.type === this.TYPE_SEARCH) {
                if (foundSource) {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}" only one source per workflow`,
                    };
                }
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    // bucket is mandatory for search
                    if (node.key === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" search missing key`,
                        };
                    }
                    if (node.script === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" search missing filter script`,
                        };
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" search missing key`,
                        };
                    }
                    // value can actually be undefined meaning *
                } else {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}": ${node.subType} not supported`,
                    };
                }
                if (node.cronRule === undefined) {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}" shall define cron rule`,
                    };
                }
                foundSource = true;
            } else if (node.type === this.TYPE_TAG) {
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    if (node.script === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" script missing`,
                        };
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" key missing`,
                        };
                    }
                    if (node.value === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" value missing`,
                        };
                    }
                } else {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}": ${node.subType} not supported`,
                    };
                }
            } else if (node.type === this.TYPE_DECISION) {
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    if (node.script === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" script missing`,
                        };
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" key missing`,
                        };
                    }
                    if (node.value === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" value missing`,
                        };
                    }
                    if (node.operator === undefined) {
                        return {
                            isValid: false,
                            message: `"${node.name}" operator missing`,
                        };
                    }
                } else {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}": ${node.subType} not supported`,
                    };
                }
            } else if (node.type === this.TYPE_FUNCTION) {
                if (node.subType === this.SUB_TYPE_FISSION) {
                    if (node.func === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" func must be defined`,
                        };
                    }
                    if (node.asynchronous === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" asynchronous not defined`,
                        };
                    }
                } else if (node.subType === this.SUB_TYPE_AZURE_FUNCTION) {
                    if (node.func === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" func must be defined`,
                        };
                    }
                    if (node.endpoint === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" endpoint must be defined`,
                        };
                    }
                    if (node.postData === undefined) {
                        return {
                            isValid: false,
                            message:
                            `"${node.name}" postData not defined`,
                        };
                    }
                } else {
                    return {
                        isValid: false,
                        message:
                        `"${node.name}": ${node.subType} not supported`,
                    };
                }
            } else if (node.type === this.TYPE_STOPPER) {
                // OK
            } else if (node.type === this.TYPE_UPDATE) {
                // OK
            } else {
                return {
                    isValid: false,
                    message: `"${node.name}": ${node.type} not supported`,
                };
            }
            // every node shall have ports
            if (node.ports === undefined) {
                return {
                    isValid: false,
                    message: `"${node.name}" has no ports`,
                };
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const port of node.ports) {
                // every port shall have an ID
                if (port.id === undefined) {
                    return {
                        isValid: false,
                        message: `"${node.name}" has missing port id`,
                    };
                }
                // port parentNode shall match node ID
                if (port.parentNode !== node.id) {
                    return {
                        isValid: false,
                        message: `"${node.name}" parentNode ID mismatch`,
                    };
                }
                // every port shall have links
                if (port.links === undefined) {
                    return {
                        isValid: false,
                        message: `"${node.name}" missing port links`,
                    };
                }
                // a port must have at least one link
                if (port.links.length === 0) {
                    return {
                        isValid: false,
                        message: `"${node.name}" port has no link`,
                    };
                }
                // eslint-disable-next-line no-restricted-syntax
                for (const linkId of port.links) {
                    // link shall point to a valid link
                    if (this.findLink(linkId) === null) {
                        throw new
                        Error(`"${node.name}" ${linkId} is not a valid link`);
                    }
                }
            }
        }
        // check links
        // eslint-disable-next-line no-restricted-syntax
        for (const link of this.model.links) {
            // every link shall have an ID
            if (link.id === undefined) {
                return {
                    isValid: false,
                    message: 'missing link ID',
                };
            }
            // check that source is a legit node
            let node = this.findNode(link.source);
            if (node) {
                const sourcePort = this.findNodePort(node, link.sourcePort);
                // check that sourcePort is a port of the source node
                // eslint-disable-next-line
                if (sourcePort != null) {
                    // check port name
                    if (sourcePort.name !== 'output' &&
                        sourcePort.name !== 'output2') {
                        return {
                            isValid: false,
                            message: 'source port must be an output port',
                        };
                    }
                } else {
                    return {
                        isValid: false,
                        message: 'link source port invalid',
                    };
                }
            } else {
                return {
                    isValid: false,
                    message: 'link source invalid',
                };
            }
            // check that target is a legit nodes
            node = this.findNode(link.target);
            if (node) {
                const targetPort = this.findNodePort(node, link.targetPort);
                // check that targetPort is a port of the target node
                // eslint-disable-next-line
                if (targetPort != null) {
                    // check port name
                    if (targetPort.name !== 'input') {
                        return {
                            isValid: false,
                            message: 'target port must be an input port',
                        };
                    }
                } else {
                    return {
                        isValid: false,
                        message: 'link target invalid',
                    };
                }
            } else {
                return {
                    isValid: false,
                    message: 'link target port invalid',
                };
            }
        }
        // check if model is cyclic
        if (this._isCyclic()) {
            return {
                isValid: false,
                message: 'model is cyclic',
            };
        }
        return {
            isValid: true,
        };
    }
}

// eslint-disable-next-line
module.exports = WorkflowEngineDefs;
