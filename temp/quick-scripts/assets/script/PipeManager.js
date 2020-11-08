(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/PipeManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3a377NGFtdNGbvBHVUz9StG', 'PipeManager', __filename);
// script/PipeManager.js

'use strict';

var PipeGroup = require('PipeGroup');

cc.Class({
    extends: cc.Component,

    properties: {
        /** 管道节点预制资源 */
        pipePrefab: cc.Prefab,
        /** 管道移动速度，单位px/s */
        pipeMoveSpeed: -300,
        /** 每对管道之间的间距，单位px */
        pipeSpacing: 400
    },

    onLoad: function onLoad() {
        this.pipeList = [];
        this.isRunning = false;
    },
    startSpawn: function startSpawn() {
        this._spawnPipe();
        var spawnInterval = Math.abs(this.pipeSpacing / this.pipeMoveSpeed);
        this.schedule(this._spawnPipe, spawnInterval);
        this.isRunning = true;
    },
    _spawnPipe: function _spawnPipe() {
        var pipeGroup = null;
        if (cc.pool.hasObject(PipeGroup)) {
            pipeGroup = cc.pool.getFromPool(PipeGroup);
        } else {
            pipeGroup = cc.instantiate(this.pipePrefab).getComponent(PipeGroup);
        }
        this.node.addChild(pipeGroup.node);
        pipeGroup.node.active = true;
        pipeGroup.init(this);
        this.pipeList.push(pipeGroup);
    },
    recyclePipe: function recyclePipe(pipe) {
        pipe.node.removeFromParent();
        pipe.node.active = false;
        cc.pool.putInPool(pipe);
    },


    /** 获取下个未通过的水管 */
    getNext: function getNext() {
        return this.pipeList.shift();
    },
    reset: function reset() {
        this.unschedule(this._spawnPipe);
        this.pipeList = [];
        this.isRunning = false;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PipeManager.js.map
        