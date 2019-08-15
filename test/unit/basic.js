const WorkflowEngineDefs = require('../../lib/WorkflowEngineDefs');
const assert = require('assert');

describe('test', () => {
    it('should instantiate a workflow engine defs class', () => {
        const wed = new WorkflowEngineDefs();
        assert(wed);
    });
    it('generate a new valid model', () => {
        const wed = new WorkflowEngineDefs();
        assert(wed);
        wed.setModel(wed.generateNewModel('foo'));
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
    });
    it('should list data sub-types', () => {
        const wed = new WorkflowEngineDefs();
        assert(wed.dataSubTypes);
    });
    it('empty workflow is valid', () => {
        const model = require('./EmptyWorkflowOK');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
    });
    it('should validate the model', () => {
        const model = require('./TinyWorkflowOK');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
    });
    it('should allow only one source', () => {
        const model = require('./TwoSources');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('should validate decisions', () => {
        const model = require('./Decision');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
        const node = wed.findNode('73594f64-8aa4-484f-aa93-9d3ae4ea242f');
        assert(node !== undefined);
        const trueNodes = wed.findNextNodes(node, 'output');
        assert.deepEqual(trueNodes,
                         ['c41f5dd0-419f-4ef6-a03f-789b46e85df0']);
        const falseNodes = wed.findNextNodes(node, 'output2');
        assert.deepEqual(falseNodes,
                         ['4e885157-6a6e-4613-8931-94576a28d586']);
    });
    it('should not validate the model because ports with no links', () => {
        const model = require('./PortHasNoLink');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('should not validate the model because missing node ID', () => {
        const model = require('./MissingNodeID');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('should be cyclic', () => {
        const model = require('./CyclicWorkflow');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('find source nodes', () => {
        const model = require('./FindSourceNodes');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
        const sourceNodes = wed.findNodes(wed.TYPE_DATA);
        assert(sourceNodes.length === 1);
    });
    it('find 3 next nodes', () => {
        const model = require('./ThreeNextNodes');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
        const sourceNodes = wed.findNodes(wed.TYPE_DATA);
        assert(sourceNodes.length === 1);
        const nextNodes = wed.findNextNodes(sourceNodes[0]);
        assert.deepEqual(nextNodes,
                         ['1f60ef3f-1d32-423c-ab86-13118b359e41',
                          'da707718-c670-426b-8162-5cefb0cc4960',
                          'b49cf7ab-ad46-4f7f-8242-cf10225d68b5']);
    });
    it('find 3 next nodes 2', () => {
        const model = require('./ThreeNextNodes2');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
        const node = wed.findNodeByName('test');
        assert(node !== undefined);
        const nextNodes = wed.findNextNodes(node);
        assert.deepEqual(nextNodes,
                         ['bd272ee9-ff81-447b-ab55-e317a88f5186',
                          'f773d288-e99e-4605-8458-1d7fea5dbf90',
                          'b0e9a8c4-8441-48b0-9423-79d6c37f6741']);
    });
    it('find prev nodes', () => {
        const model = require('./MultiInput');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
        const node = wed.findNodeByName('end');
        assert(node !== undefined);
        const prevNodes = wed.findPrevNodes(node);
        assert.deepEqual(prevNodes,
                         ['ad61a261-b29b-456c-af3e-115a660e1bb8',
                          '8fd26370-510a-48f7-a8d7-a0d79d2d383e']);
    });
    it('find prev nodes 2', () => {
        const model = require('./Multi3Input');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(validationResult.isValid);
        const node = wed.findNodeByName('end');
        assert(node !== undefined);
        const prevNodes = wed.findPrevNodes(node);
        assert.deepEqual(prevNodes,
                         ['ad61a261-b29b-456c-af3e-115a660e1bb8',
                          '8fd26370-510a-48f7-a8d7-a0d79d2d383e',
                          '3e0fc652-e2c2-438b-bd2a-e813fa75beb8']);
    });
    it('reject links pointing to nowhere', () => {
        const model = require('./LinkNowhere.json');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('reject out-to-out links', () => {
        const model = require('./OutToOut.json');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('reject in-to-in links', () => {
        const model = require('./InToIn.json');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
    it('reject inverted links', () => {
        const model = require('./InvertedLink.json');
        const wed = new WorkflowEngineDefs(model);
        const validationResult = wed.checkModel();
        assert(!validationResult.isValid);
    });
});
