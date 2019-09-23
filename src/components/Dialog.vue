<template>
    <div class="dialog">
        <div class="mask"></div>
        <div class="dialog-content">
            <h3 class="title">{{ modal.title }}</h3>
            <p class="text">{{ modal.text }}</p>
            <div class="btn-group">
                <div class="btn" @click="cancel">{{ modal.cancelButtonText }}</div>
                <div class="btn" @click="submit">{{ modal.confirmButtonText }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'dialog',
    props: {
        dialogOption: Object
    },
    data() {
        return {
            resolve: '',
            reject: '',
            promise: '', // 保存promise对象,
        }
    },
    computed: {
 
        modal: function() {
            let options = this.dialogOption;
            return {
                //title: options.title || '提示',
                text: options.text,
                cancelButtonText: options.cancelButtonText || '取消',
                confirmButtonText: options.confirmButtonText || '确定',
            }
        }
    },
    methods: {
        //确定,将promise断定为完成状态
        submit() {
            this.resolve('submit');
        },
        // 取消,将promise断定为reject状态
        cancel() {
            this.reject('cancel');
        },
        //显示confirm弹出,并创建promise对象，给父组件调用
        confirm() {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
            return this.promise; //返回promise对象,给父级组件调用
        }
    }

}
</script>

<style lang="scss">
.dialog {
    position: relative;

    .dialog-content {
        position: fixed;
        box-sizing: border-box;
        padding-top: 20px;
        width: 300px;
        min-height: 140px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        background: #fff;
        z-index: 50002;
        .title {
            font-size: 16px;
            font-weight: 600;
            line-height: 30px;
            text-align: center;
        }
        .text {
            font-size: 14px;
            line-height: 60px;
            color: #555;
            text-align: center;
        }
        .btn-group {
            display: flex;
            justify-content: space-around;
            border-top: 1px solid #ddd;
            position: absolute;
            bottom: 0;
            width: 100%;
            .btn {
                padding: 10px 0;
                margin-left: 10px;
                margin-right: 10px;
                font-size: 14px;
                cursor: pointer;
                width:50%;
                text-align:center;
                &:last-child {
                    color: #76D49B;
                }
            }
            .btn:first-of-type{
                border-right:1px solid #ddd;
            }
        }
    }
    .mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 50001;
        background: rgba(0, 0, 0, .5);
    }
}
</style>