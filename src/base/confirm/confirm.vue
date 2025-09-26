<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag" @click.stop>
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{ text }}</p>
                    <div class="operate">
                        <div class="operate-btn left" @click="cancel">{{ cancelText }}</div>
                        <div class="operate-btn confirm-btn" @click="confirm">{{ confirmText }}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup name="confirm">
import { ref } from 'vue'

const emit = defineEmits(['confirm', 'cancel'])
const showFlag = ref(false)
const props = defineProps({
    text: {
        type: String,
        default: '确定要执行此操作吗？'
    },
    cancelText: {
        type: String,
        default: '取消'
    },
    confirmText: {
        type: String,
        default: '确定'
    }
})

function show(){
    showFlag.value = true
}

function hide(){
    showFlag.value = false
}
function confirm() {
    emit('confirm')
    hide()
}
function cancel() {
    emit('cancel')
    hide()
}

// 暴露方法供父组件调用
defineExpose({
    show,
    hide
})
</script>

<style scoped>
.confirm {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: rgba(0, 0, 0, 0.5);

    &.confirm-fade-enter-active {
        animation: confirm-fadein 0.3s
    }

    .confirm-content {
        animation: confirm-zoom 0.3s
    }
}

.confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
}

.confirm-content {
    width: 270px;
    border-radius: 13px;
    background: #fff;

    .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        color: #42bd56;
    }

    .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 16px;
        color: gray;
        cursor: pointer;

        .operate-btn {
            flex: 1;
            line-height: 22px;
            padding: 10px 0;
            border-top: 1px solid #f0f0f0;
            transition: all 0.3s;

            &.left {
                border-right: 1px solid #f0f0f0;
            }
            
            &:hover {
                background-color: #f5f5f5;
                border-radius: 13px;
            }
            
            &.confirm-btn {
                color: #42bd56;
                font-weight: 500;
            }
        }
    }
}

@keyframes confirm-fadein {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes confirm-zoom {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}
</style>
