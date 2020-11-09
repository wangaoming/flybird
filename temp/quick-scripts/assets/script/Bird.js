(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/Bird.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5f3faEpqKdJfbOLQ5hgVfeb', 'Bird', __filename);
// script/Bird.js

"use strict";

var State = cc.Enum({
    /** 游戏开始前的准备状态 */
    Ready: -1,
    /** 小鸟上升中 */
    Rise: -1,
    /** 小鸟自由落体中 */
    FreeFall: -1,
    /** 小鸟碰撞到管道坠落中 */
    Drop: -1,
    /** 小鸟已坠落到地面静止 */
    Dead: -1
});

cc.Class({
    statics: {
        State: State
    },

    extends: cc.Component,

    properties: {
        /** 上抛初速度，单位：像素/秒 */
        initRiseSpeed: 800,
        /** 重力加速度，单位：像素/秒的平方 */
        gravity: 1000,
        /** 小鸟的状态 */
        state: {
            default: State.Ready,
            type: State
        },
        /** 地面节点 */
        ground: {
            default: null,
            type: cc.Node
        },
        // 小鸟向上飞的声音
        riseAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 碰掉水管掉落声
        dropAudio: {
            default: null,
            url: cc.AudioClip
        },
        // 发生碰撞声
        hitAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    init: function init(game) {
        this.game = game;
        this.state = State.Ready;
        this.currentSpeed = 0; //初始化当前的速度
        this.anim = this.getComponent(cc.Animation); //获取动画组件
    },
    update: function update(dt) {
        if (this.state === State.Ready || this.state === State.Dead) {
            //如果是住呢比或者死亡状态则停止计算
            return;
        }
        this._updatePosition(dt);
        this._updateState(dt);
        this._detectCollision();
        this._fixBirdFinalPosition();
    },
    _updatePosition: function _updatePosition(dt) {
        var flying = this.state === State.Rise || this.state === State.FreeFall || this.state === State.Drop; //判断小鸟是否处于飞行状态
        if (flying) {
            //如果处于飞行状态
            var h = cc.director.getVisibleSize().height / 2;
            if (this.node.y >= h) {
                //当小鸟的高度超过上边的时候，让小鸟的位置和速度降下来
                this.node.y = h - 1;
                this.currentSpeed = -1;
            } else {
                this.currentSpeed -= dt * this.gravity; //根据预先设置好的重力计算当前的速度
                this.node.y += dt * this.currentSpeed; //根据计算出来的y轴速度，计算出当前小鸟的位置
            }
        }
    },
    _updateState: function _updateState(dt) {
        switch (this.state) {
            case State.Rise:
                //当当前状态是飞起的时候，如果速度小于零了，则转换为自由下落状态
                if (this.currentSpeed < 0) {
                    this.state = State.FreeFall;
                    this._runFallAction();
                    this._runRiseAction();
                    cc.audioEngine.playEffect(this.dropAudio);
                }
                break;
        }
    },

    //起飞函数
    rise: function rise() {
        this.state = State.Rise;
        this.currentSpeed = this.initRiseSpeed;
        this._runRiseAction();
        //
        cc.audioEngine.playEffect(this.riseAudio);
    },

    //开始起飞
    startFly: function startFly() {
        this._getNextPipe();
        this.anim.stop("birdFlapping");
        this.rise();
    },

    //向上飞的角度偏移
    _runRiseAction: function _runRiseAction() {
        this.node.stopAllActions();
        var jumpAction = cc.rotateTo(0.3, -30).easing(cc.easeCubicActionOut());
        this.node.runAction(jumpAction);
    },


    //下落的角度偏移
    _runFallAction: function _runFallAction() {
        var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.6;

        this.node.stopAllActions();
        var dropAction = cc.rotateTo(duration, 90).easing(cc.easeCubicActionIn());
        this.node.runAction(dropAction);
    },


    //当小鸟碰撞到管道的时候坠落的角度偏移
    _runDropAction: function _runDropAction() {
        if (this.currentSpeed > 0) {
            this.currentSpeed = 0;
        }
        this._runFallAction(0.4);
    },
    _getNextPipe: function _getNextPipe() {
        this.nextPipe = this.game.pipeManager.getNext();
    },
    _detectCollision: function _detectCollision() {
        if (!this.nextPipe) {
            return;
        }
        if (this.state === State.Ready || this.state === State.Dead || this.state === State.Drop) {
            return;
        }
        var collideWithPipe = false;
        // 检测小鸟与上方管子的碰撞
        if (this._detectCollisionWithBird(this.nextPipe.topPipe)) {
            collideWithPipe = true;
        }
        // 检测小鸟与下方管子的碰撞
        if (this._detectCollisionWithBird(this.nextPipe.bottomPipe)) {
            collideWithPipe = true;
        }
        // 检测小鸟与地面的碰撞
        var collideWithGround = false;
        if (this._detectCollisionWithBird(this.ground)) {
            collideWithGround = true;
        }
        // 处理碰撞结果
        if (collideWithPipe || collideWithGround) {
            cc.audioEngine.playEffect(this.hitAudio);

            if (collideWithGround) {
                // 与地面碰撞
                this.state = State.Dead;
            } else {
                // 与水管碰撞
                this.state = State.Drop;
                this._runDropAction();
            }
            this.anim.stop();
            this.game.gameOver();
        } else {
            // 处理没有发生碰撞的情况
            var birdLeft = this.node.x;
            var pipeRight = this.nextPipe.node.x + this.nextPipe.topPipe.width;
            var crossPipe = birdLeft > pipeRight;
            if (crossPipe) {
                this.game.gainScore();
                this._getNextPipe();
            }
        }
        // 处理碰撞结果
        if (collideWithPipe || collideWithGround) {
            cc.audioEngine.playEffect(this.hitAudio);
        }
    },
    _detectCollisionWithBird: function _detectCollisionWithBird(otherNode) {
        return cc.rectIntersectsRect(this.node.getBoundingBoxToWorld(), otherNode.getBoundingBoxToWorld());
    },

    /** 修正最后落地位置 */
    _fixBirdFinalPosition: function _fixBirdFinalPosition() {
        if (this._detectCollisionWithBird(this.ground)) {
            this.node.y = this.ground.y + this.node.width / 2;
        }
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
        //# sourceMappingURL=Bird.js.map
        