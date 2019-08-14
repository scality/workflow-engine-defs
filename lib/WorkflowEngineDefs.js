class WorkflowEngineDefs {
    // node types
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

    // sub-types
    // data sub-types
    // search sub-types
    // tag & decision sub-types
    get SUB_TYPE_BASIC() {
        return 'basic';
    }

    get SUB_TYPE_ADVANCED() {
        return 'advanced';
    }

    // function sub-types
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

    // target sub-types

    // special tags
    get _GUARD() {
        return '_ZENKO_WORKFLOW_GUARD';
    }

    // getters
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

    // default subTypes
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
        return undefined;
    }

    getDefaultUpdateSubType() {
        return undefined;
    }

    constructor(model = {}) {
        this.model = model;
    }

    generateNewModel() {
        return {
            offsetX: 0,
            offsetY: 0,
            nameCounter: 0,
            zoom: 100,
            links: [],
            nodes: []
        };
    }

    setModel(model) {
        this.model = model;
    }

    /** Find node with given ID
     *
     * @param {string} nodeId node ID
     *
     * @return {object} node if found else null
     */
    findNode(nodeId) {
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
    findNodeByName(name) {
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
    findNodes(type) {
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
    findNextNodes(refNode, name = undefined) {
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
    findPrevNodes(refNode, name = undefined) {
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
    findLink(linkId) {
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
    findNodePort(node, portId) {
        // eslint-disable-next-line no-restricted-syntax
        for (const port of node.ports) {
            if (port.id === portId) {
                return port;
            }
        }
        return null;
    }

    _isCyclicInternal(node, visited, nodeStack) {
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
    _isCyclic() {
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
    checkModel() {
        let foundSource = false;
        // check nodes
        // eslint-disable-next-line no-restricted-syntax
        for (const node of this.model.nodes) {
            // every node shall have an ID
            if (node.id === undefined) {
                throw new Error('missing node id');
            }
            // check that types have their own properties
            if (node.type === undefined) {
                throw new Error('missing node type');
            }
            if (node.type === this.TYPE_DATA) {
                if (foundSource) {
                    throw new Error(
                        `\"${node.name}\" only one source per workflow`);
                }
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    if (node.script === undefined) {
                        throw new Error(
                            `\"${node.name}\" data missing filter script`);
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        throw new Error(
                            `\"${node.name}\" data missing bucket`);
                    }
                    // value can actually be undefined meaning *
                } else {
                    throw new Error(
                        `\"${node.name}\": ${node.subType} not supported`);
                }
                foundSource = true;
            } else if (node.type === this.TYPE_SEARCH) {
                if (foundSource) {
                    throw new Error(
                        `\"${node.name}\" only one source per workflow`);
                }
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    // bucket is mandatory for search
                    if (node.key === undefined) {
                        throw new Error(
                            `\"${node.name}\" search missing key`);
                    }
                    if (node.script === undefined) {
                        throw new Error(
                            `\"${node.name}\" search missing filter script`);
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        throw new Error(
                            `\"${node.name}\" search missing key`);
                    }
                    // value can actually be undefined meaning *
                } else {
                    throw new Error(
                        `\"${node.name}\": ${node.subType} not supported`);
                }
                if (node.cronRule === undefined) {
                    throw new Error(
                        `\"${node.name}\" shall define cron rule`);
                }
                foundSource = true;
            } else if (node.type === this.TYPE_TAG) {
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    if (node.script === undefined) {
                        throw new Error(`\"${node.name}\" script missing`);
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        throw new Error(`\"${node.name}\" key missing`);
                    }
                    if (node.value === undefined) {
                        throw new Error(`\"${node.name}\" value missing`);
                    }
                } else {
                    throw new Error(
                        `\"${node.name}\": ${node.subType} not supported`);
                }
            } else if (node.type === this.TYPE_DECISION) {
                if (node.subType === this.SUB_TYPE_ADVANCED) {
                    if (node.script === undefined) {
                        throw new Error(`\"${node.name}\" script missing`);
                    }
                } else if (node.subType === this.SUB_TYPE_BASIC) {
                    if (node.key === undefined) {
                        throw new Error(`\"${node.name}\" key missing`);
                    }
                    if (node.value === undefined) {
                        throw new Error(`\"${node.name}\" value missing`);
                    }
                    if (node.operator === undefined) {
                        throw new Error(`\"${node.name}\" operator missing`);
                    }
                } else {
                    throw new Error(
                        `\"${node.name}\": ${node.subType} not supported`);
                }
            } else if (node.type === this.TYPE_FUNCTION) {
                if (node.subType === this.SUB_TYPE_FISSION) {
                    if (node.func === undefined) {
                        throw new Error(
                            `\"${node.name}\" func must be defined`);
                    }
                    if (node.asynchronous === undefined) {
                        throw new Error(
                            `\"${node.name}\" asynchronous not defined`);
                    }
                } else if (node.subType === this.SUB_TYPE_AZURE_FUNCTION) {
                    if (node.func === undefined) {
                        throw new Error(
                            `\"${node.name}\" func must be defined`);
                    }
                    if (node.endpoint === undefined) {
                        throw new Error(
                            `\"${node.name}\" endpoint must be defined`);
                    }
                    if (node.postData === undefined) {
                        throw new Error(
                            `\"${node.name}\" postData not defined`);
                    }
                } else {
                    throw new Error(
                        `\"${node.name}\": ${node.subType} not supported`);
                }
            } else if (node.type === this.TYPE_STOPPER) {
                // OK
            } else if (node.type === this.TYPE_UPDATE) {
                // OK
            } else {
                throw new Error(`\"${node.name}\": ${node.type} not supported`);
            }
            // every node shall have ports
            if (node.ports === undefined) {
                throw new Error(`\"${node.name}\" has no ports`);
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const port of node.ports) {
                // every port shall have an ID
                if (port.id === undefined) {
                    throw new Error(`\"${node.name}\" has missing port id`);
                }
                // port parentNode shall match node ID
                if (port.parentNode !== node.id) {
                    throw new Error(`\"${node.name}\" parentNode ID mismatch`);
                }
                // every port shall have links
                if (port.links === undefined) {
                    throw new Error(`\"${node.name}\" missing port links`);
                }
                // a port must have at least one link
                if (port.links.length === 0) {
                    throw new Error(`\"${node.name}\" port has no link`);
                }
                // eslint-disable-next-line no-restricted-syntax
                for (const linkId of port.links) {
                    // link shall point to a valid link
                    if (this.findLink(linkId) === null) {
                        throw new
                        Error(`\"${node.name}\" ${linkId} is not a valid link`);
                    }
                }
            }
        }
        // check links
        // eslint-disable-next-line no-restricted-syntax
        for (const link of this.model.links) {
            // every link shall have an ID
            if (link.id === undefined) {
                throw new Error('missing link ID');
            }
            // check that source is a legit node
            let node = this.findNode(link.source);
            if (node) {
                const sourcePort = this.findNodePort(node, link.sourcePort);
                // check that sourcePort is a port of the source node
                if (sourcePort === null) {
                    throw new Error('link source port invalid');
                }
                // check port name
                if (sourcePort.name !== 'output' &&
                    sourcePort.name !== 'output2') {
                    throw new Error('source port must be an output port');
                }
            } else {
                throw new Error('link source invalid');
            }
            // check that target is a legit nodes
            node = this.findNode(link.target);
            if (node) {
                const targetPort = this.findNodePort(node, link.targetPort);
                // check that targetPort is a port of the target node
                if (targetPort === null) {
                    throw new Error('link target invalid');
                }
                // check port name
                if (targetPort.name !== 'input') {
                    throw new Error('target port must be an input port');
                }
            } else {
                throw new Error('link target port invalid');
            }
        }
        // check if model is cyclic
        if (this._isCyclic()) {
            throw new Error('model is cyclic');
        }
    }
}

module.exports = WorkflowEngineDefs;
